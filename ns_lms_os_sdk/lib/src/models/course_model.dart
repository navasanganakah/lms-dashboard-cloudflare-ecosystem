class NsCourse {
  final String id;
  final String title;
  final String description;
  final String category;
  final String image;
  final bool published;
  final int progress;
  final int students;

  NsCourse({
    required this.id,
    required this.title,
    this.description = '',
    this.category = '',
    this.image = '',
    this.published = false,
    this.progress = 0,
    this.students = 0,
  });

  factory NsCourse.fromJson(Map<String, dynamic> json) {
    return NsCourse(
      id: json['id']?.toString() ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: json['category'] ?? '',
      image: json['image'] ?? '',
      published: json['published'] == 1 || json['published'] == true,
      progress: json['progress'] ?? 0,
      students: json['students'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category,
      'image': image,
      'published': published,
      'progress': progress,
      'students': students,
    };
  }
}
