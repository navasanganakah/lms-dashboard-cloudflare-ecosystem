class NsUser {
  final String id;
  final String email;
  final String name;
  final String role;

  NsUser({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
  });

  factory NsUser.fromJson(Map<String, dynamic> json) {
    return NsUser(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      name: json['name'] ?? '',
      role: json['role'] ?? 'student',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'role': role,
    };
  }
}
