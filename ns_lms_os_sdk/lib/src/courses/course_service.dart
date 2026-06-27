import 'dart:convert';
import '../core/api_client.dart';
import '../models/course_model.dart';

class NsCourseService {
  /// Fetch all active courses for the student
  Future<List<NsCourse>> getActiveCourses() async {
    try {
      final response = await NsApiClient.get('/api/courses');
      if (response.statusCode == 200) {
        final List data = jsonDecode(response.body);
        return data.map((e) => NsCourse.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      print("Error fetching courses: $e");
      return [];
    }
  }

  /// Fetch courses managed by the admin
  Future<List<NsCourse>> getAdminCourses() async {
    try {
      final response = await NsApiClient.get('/api/admin/courses');
      if (response.statusCode == 200) {
        final List data = jsonDecode(response.body);
        return data.map((e) => NsCourse.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      print("Error fetching admin courses: $e");
      return [];
    }
  }
}
