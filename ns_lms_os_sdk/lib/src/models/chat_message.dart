class NsChatMessage {
  final String id;
  final String userId;
  final String userName;
  final String content;
  final DateTime timestamp;

  NsChatMessage({
    required this.id,
    required this.userId,
    required this.userName,
    required this.content,
    required this.timestamp,
  });

  factory NsChatMessage.fromJson(Map<String, dynamic> json) {
    return NsChatMessage(
      id: json['id']?.toString() ?? '',
      userId: json['user_id']?.toString() ?? '',
      userName: json['user_name'] ?? 'Unknown',
      content: json['content'] ?? '',
      timestamp: json['timestamp'] != null ? DateTime.parse(json['timestamp']) : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'user_name': userName,
      'content': content,
      'timestamp': timestamp.toIso8601String(),
    };
  }
}
