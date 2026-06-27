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

    // --- Authentication Routes ---
    if (url.pathname === "/api/auth/request-otp" && request.method === "POST") {
      try {
        const body = await request.json() as { email: string };
        const email = body.email;
        if (!email) return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
        
        // Generate a 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

        // Save to D1
        await env.DB.prepare(
          "INSERT INTO otps (email, code, expires_at) VALUES (?, ?, ?) ON CONFLICT(email) DO UPDATE SET code = excluded.code, expires_at = excluded.expires_at"
        ).bind(email, code, expiresAt).run();

        console.log(`[AUTH] OTP for ${email}: ${code}`);
        
        return new Response(JSON.stringify({ success: true, message: "OTP sent" }), { status: 200, headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
      }
    }

    if (url.pathname === "/api/auth/verify-otp" && request.method === "POST") {
      try {
        const body = await request.json() as { email: string, code: string };
        const { email, code } = body;
        if (!email || !code) return new Response(JSON.stringify({ error: "Email and code required" }), { status: 400 });

        const otpRecord = await env.DB.prepare("SELECT * FROM otps WHERE email = ? AND code = ? AND expires_at > ?")
          .bind(email, code, new Date().toISOString())
          .first();

        if (!otpRecord) {
          return new Response(JSON.stringify({ error: "Invalid or expired OTP" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        // OTP valid, remove it
        await env.DB.prepare("DELETE FROM otps WHERE email = ?").bind(email).run();

        // Check if user exists, else create
        let user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
        if (!user) {
          const userId = crypto.randomUUID();
          await env.DB.prepare("INSERT INTO users (id, role, email, name) VALUES (?, 'admin', ?, ?)")
            .bind(userId, email, email.split('@')[0])
            .run();
          user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
        }

        // Create Session
        const sessionId = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
        await env.DB.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
          .bind(sessionId, user!.id as string, expiresAt)
          .run();

        return new Response(JSON.stringify({ success: true, token: sessionId, user }), { status: 200, headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
      }
    }

    if (url.pathname === "/api/auth/me" && request.method === "GET") {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
      }
      const token = authHeader.split(" ")[1];

      const session = await env.DB.prepare("SELECT * FROM sessions WHERE id = ? AND expires_at > ?")
        .bind(token, new Date().toISOString())
        .first();

      if (!session) {
        return new Response(JSON.stringify({ error: "Invalid or expired session" }), { status: 401, headers: { "Content-Type": "application/json" } });
      }

      const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(session.user_id).first();
      return new Response(JSON.stringify({ user }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    if (url.pathname === "/api/auth/logout" && request.method === "POST") {
      const authHeader = request.headers.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(token).run();
      }
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // --- Courses & Enrollments Routes ---
    if (url.pathname === "/api/courses" && request.method === "GET") {
      try {
        const courses = await env.DB.prepare("SELECT * FROM courses WHERE status = 'published'").all();
        return new Response(JSON.stringify(courses.results), { status: 200, headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
      }
    }

    if (url.pathname === "/api/enrollments" && request.method === "GET") {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
      }
      const token = authHeader.split(" ")[1];
      const session = await env.DB.prepare("SELECT * FROM sessions WHERE id = ? AND expires_at > ?").bind(token, new Date().toISOString()).first();
      
      if (!session) {
        return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401, headers: { "Content-Type": "application/json" } });
      }

      try {
        const enrollments = await env.DB.prepare(`
          SELECT c.*, e.progress, e.enrolled_at 
          FROM enrollments e 
          JOIN courses c ON e.course_id = c.id 
          WHERE e.user_id = ?
        `).bind(session.user_id).all();
        return new Response(JSON.stringify(enrollments.results), { status: 200, headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
      }
    }

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
