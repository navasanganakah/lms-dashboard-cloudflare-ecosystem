import { DurableObject } from "cloudflare:workers";

export interface Env {
  DB: D1Database;
  STORAGE: R2Bucket;
  CONFIG_KV: KVNamespace;
  CHAT_ROOMS: DurableObjectNamespace;
}

// Durable Object for Real-Time Chat using SQLite backend
export class ChatRoom extends DurableObject {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    // Initialize SQLite tables within the Durable Object
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async fetch(request: Request) {
    // Handle WebSocket upgrade for real-time communication
    if (request.headers.get("Upgrade") === "websocket") {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      
      this.ctx.acceptWebSocket(server);

      // Send recent message history to the newly connected user
      const history = this.ctx.storage.sql.exec("SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50").toArray();
      server.send(JSON.stringify({ type: "history", data: history.reverse() }));

      return new Response(null, { status: 101, webSocket: client });
    }

    return new Response("Expected WebSocket", { status: 400 });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    try {
      const data = JSON.parse(message as string);
      if (data.type === "chat") {
        // Store message in DO SQLite
        this.ctx.storage.sql.exec(
          "INSERT INTO messages (user_id, user_name, content) VALUES (?, ?, ?)",
          data.userId,
          data.userName,
          data.content
        );

        // Broadcast to all connected clients
        const broadcastMsg = JSON.stringify({ type: "chat", data: {
          user_id: data.userId,
          user_name: data.userName,
          content: data.content,
          timestamp: new Date().toISOString()
        }});
        
        for (const client of this.ctx.getWebSockets()) {
          client.send(broadcastMsg);
        }
      }
    } catch (e) {
      console.error("Error processing websocket message", e);
    }
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // API Route for WebSockets / Chat
    if (url.pathname.startsWith("/api/chat/")) {
      const roomId = url.pathname.split("/")[3];
      if (!roomId) return new Response("Room ID required", { status: 400 });
      
      const id = env.CHAT_ROOMS.idFromName(roomId);
      const stub = env.CHAT_ROOMS.get(id);
      return stub.fetch(request);
    }

    // Serve Static Assets from Cloudflare Workers with Assets
    // Note: 'cloudflare:assets' binding is used implicitly in Workers with Assets
    return env.ASSETS ? env.ASSETS.fetch(request) : new Response("Not found", { status: 404 });
  }
};
