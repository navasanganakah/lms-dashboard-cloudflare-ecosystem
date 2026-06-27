# ns_lms_os_sdk - SDK Specification

## Overview
The `ns_lms_os_sdk` is a professional-grade Flutter SDK designed to seamlessly connect any Flutter application with a Cloudflare-backed LMS server. It provides both headless data layers (for custom UI) and plug-and-play UI widgets.

## 1. Core Classes & Configuration

### `NsConfig`
Manages the global configuration for the SDK, including the self-hosted LMS server URL.
- **Methods:**
  - `static void initialize({required String url})`: Initializes the SDK with the base URL of the Cloudflare Worker server.

### `NsApiClient`
Handles internal HTTP networking, attaching authentication tokens and managing headers.
- **Methods:**
  - `static Future<http.Response> post(String endpoint, Map<String, dynamic> body)`
  - `static Future<http.Response> get(String endpoint)`

## 2. Data Models

### `NsUser`
Represents the authenticated user.
- **Fields:** `id` (String), `email` (String), `name` (String), `role` (String)
- **Serialization:** `fromJson`, `toJson`

### `NsCourse`
Represents a learning course.
- **Fields:** `id` (String), `title` (String), `description` (String), `category` (String), `image` (String), `published` (bool), `progress` (int), `students` (int)
- **Serialization:** `fromJson`, `toJson`

### `NsChatMessage`
Represents a real-time message in the Durable Objects chat.
- **Fields:** `id` (String), `userId` (String), `userName` (String), `content` (String), `timestamp` (DateTime)
- **Serialization:** `fromJson`, `toJson`

## 3. Services (Headless APIs)

### `NsAuthService`
Manages user authentication, OTP flows, and session tokens.
- **Methods:**
  - `Future<bool> requestOtp(String email)`
  - `Future<NsUser?> verifyOtp(String email, String code)`
  - `Future<NsUser?> getCurrentUser()`
  - `Future<void> logout()`

### `NsCourseService`
Handles fetching course data for students and administrators.
- **Methods:**
  - `Future<List<NsCourse>> getActiveCourses()`
  - `Future<List<NsCourse>> getAdminCourses()`

### `NsChatService`
Manages WebSocket connections to Cloudflare Durable Objects for real-time messaging.
- **Properties:**
  - `Stream<List<NsChatMessage>> messagesStream`
- **Methods:**
  - `void connect(String roomId)`
  - `void sendMessage(String userId, String userName, String content)`
  - `void disconnect()`
  - `void dispose()`

## 4. UI Components

### `NsTheme`
Provides a default, highly professional color scheme and `ThemeData` optimized for LMS applications.

### `NsLoginScreen`
A complete, plug-and-play screen for Email + OTP authentication.
- **Parameters:**
  - `Function(NsUser) onSuccess`
  - `Widget? logo`
  - `String title`
