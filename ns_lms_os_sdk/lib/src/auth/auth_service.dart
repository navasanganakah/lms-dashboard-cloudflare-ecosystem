import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/api_client.dart';
import '../models/user_model.dart';

class NsAuthService {
  /// Request an OTP to be sent to the user's email
  Future<bool> requestOtp(String email) async {
    try {
      final response = await NsApiClient.post('/api/auth/request-otp', {'email': email});
      return response.statusCode == 200;
    } catch (e) {
      print("Error requesting OTP: $e");
      return false;
    }
  }

  /// Verify the OTP and login the user
  Future<NsUser?> verifyOtp(String email, String code) async {
    try {
      final response = await NsApiClient.post('/api/auth/verify-otp', {
        'email': email,
        'code': code,
      });

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final token = data['token'];
        
        // Save token securely (using shared_preferences for now)
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('ns_auth_token', token);
        
        return NsUser.fromJson(data['user']);
      }
      return null;
    } catch (e) {
      print("Error verifying OTP: $e");
      return null;
    }
  }

  /// Get the currently logged in user
  Future<NsUser?> getCurrentUser() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('ns_auth_token');
      if (token == null) return null;

      final response = await NsApiClient.get('/api/auth/me');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return NsUser.fromJson(data['user']);
      }
      
      // If unauthorized, clear the token
      if (response.statusCode == 401) {
        await logout();
      }
      return null;
    } catch (e) {
      print("Error getting current user: $e");
      return null;
    }
  }

  /// Logout the user
  Future<void> logout() async {
    try {
      await NsApiClient.post('/api/auth/logout', {});
    } catch (e) {
      // Ignore errors during logout API call
    } finally {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('ns_auth_token');
    }
  }
}
