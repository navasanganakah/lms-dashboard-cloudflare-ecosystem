import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'ns_config.dart';

class NsApiClient {
  static Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('ns_auth_token');
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  static Future<http.Response> post(String endpoint, Map<String, dynamic> body) async {
    if (NsConfig.baseUrl.isEmpty) {
      throw Exception("SDK not initialized. Call NsConfig.initialize() first.");
    }
    final url = Uri.parse('${NsConfig.baseUrl}$endpoint');
    final headers = await _getHeaders();
    return await http.post(url, headers: headers, body: jsonEncode(body));
  }

  static Future<http.Response> get(String endpoint) async {
    if (NsConfig.baseUrl.isEmpty) {
      throw Exception("SDK not initialized. Call NsConfig.initialize() first.");
    }
    final url = Uri.parse('${NsConfig.baseUrl}$endpoint');
    final headers = await _getHeaders();
    return await http.get(url, headers: headers);
  }
}
