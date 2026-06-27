import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../core/ns_config.dart';
import '../models/chat_message.dart';

class NsChatService {
  WebSocketChannel? _channel;
  final StreamController<List<NsChatMessage>> _messagesController = StreamController<List<NsChatMessage>>.broadcast();
  final List<NsChatMessage> _messages = [];

  Stream<List<NsChatMessage>> get messagesStream => _messagesController.stream;

  void connect(String roomId) {
    if (NsConfig.baseUrl.isEmpty) {
      print("SDK not initialized. Cannot connect to chat.");
      return;
    }
    
    // Convert http/https to ws/wss
    String wsUrl = NsConfig.baseUrl;
    if (wsUrl.startsWith('http://')) {
      wsUrl = wsUrl.replaceFirst('http://', 'ws://');
    } else if (wsUrl.startsWith('https://')) {
      wsUrl = wsUrl.replaceFirst('https://', 'wss://');
    }

    final uri = Uri.parse('$wsUrl/api/chat/$roomId');

    try {
      _channel = WebSocketChannel.connect(uri);

      _channel!.stream.listen(
        (data) {
          try {
            final decoded = jsonDecode(data);
            if (decoded['type'] == 'history') {
              final List history = decoded['data'];
              _messages.clear();
              _messages.addAll(history.map((e) => NsChatMessage.fromJson(e)));
              _messagesController.add(List.from(_messages));
            } else if (decoded['type'] == 'chat') {
              _messages.add(NsChatMessage.fromJson(decoded['data']));
              _messagesController.add(List.from(_messages));
            }
          } catch (e) {
            print("Error parsing chat message: $e");
          }
        },
        onError: (error) {
          print("Chat WebSocket error: $error");
        },
        onDone: () {
          print("Chat WebSocket closed");
        },
      );
    } catch (e) {
      print("Failed to connect to chat WebSocket: $e");
    }
  }

  void sendMessage(String userId, String userName, String content) {
    if (_channel != null && content.isNotEmpty) {
      _channel!.sink.add(jsonEncode({
        'type': 'chat',
        'userId': userId,
        'userName': userName,
        'content': content,
      }));
    } else {
      print("WebSocket not connected. Cannot send message.");
    }
  }

  void disconnect() {
    _channel?.sink.close();
    _channel = null;
    _messages.clear();
    _messagesController.add([]);
  }

  void dispose() {
    disconnect();
    _messagesController.close();
  }
}
