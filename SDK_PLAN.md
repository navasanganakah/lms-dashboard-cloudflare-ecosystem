# ns_lms_os_sdk - Professional Flutter SDK Plan

## 1. Project Identity
- **Package Name:** `ns_lms_os_sdk` (NavaSanganakah LMS Open Source SDK)
- **Company:** NavaSanganakah Multiventures
- **Lead Developer:** Dheerendra Tripathi (Acharya Pandit Dheerendra Tripathi)
- **Objective:** Provide a highly professional, open-source Flutter SDK to seamlessly connect any Flutter application with the Cloudflare-backed LMS server. It will offer both headless data layers and customizable UI components.

## 2. SDK Architecture (Professional Grade)
The SDK will follow a modular architecture, separating the core logic from the UI components so developers have full freedom (Headless API + Pre-built UI).

### Folder Structure
```text
ns_lms_os_sdk/
├── lib/
│   ├── src/
│   │   ├── core/               # API Client, Config, Interceptors, Error Handling
│   │   ├── auth/               # Email OTP Login, Token Management, Secure Storage
│   │   ├── courses/            # Course Models, Repositories, Progress Tracking
│   │   ├── chat/               # WebSocket Client for Durable Objects Chat
│   │   └── ui/                 # Highly Customizable Widgets (Theming Support)
│   │       ├── auth_views/
│   │       ├── course_views/
│   │       └── theme/          # Default Themes and styling properties
│   └── ns_lms_os_sdk.dart      # Main export file
├── pubspec.yaml
├── README.md                   # Professional documentation with examples
└── CHANGELOG.md                # Version tracking
```

## 3. Core Features & Capabilities
1. **Configurable Base URL:** Easily point the SDK to any self-hosted Cloudflare Worker URL.
2. **Headless Data Layer:** Direct access to `NsAuthRepository`, `NsCourseRepository`, and `NsChatService` for custom UI building.
3. **Plug-and-Play UI Components:** 
   - `NsLoginScreen(onSuccess: ...)`
   - `NsCourseList(theme: ...)`
   - `NsChatView(roomId: ...)`
4. **WebSocket Management:** Auto-reconnect and state management for real-time Durable Object chat.
5. **Secure Local Storage:** Token and session caching securely.

## 4. GitHub Actions Workflow (Automated pub.dev Publishing)
We will use a manual trigger (`workflow_dispatch`) to publish the SDK to `pub.dev`. This ensures quality control by the Lead Developer.

```yaml
name: Publish to pub.dev

on:
  workflow_dispatch: # Manual Trigger

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          channel: 'stable'
      - run: flutter pub get
      - run: flutter format --set-exit-if-changed .
      - run: flutter analyze
      - name: Publish Package
        uses: dart-lang/setup-dart/publish@v1
        with:
          credentialJson: ${{ secrets.PUB_CREDENTIALS }}
```

## 5. Development Roadmap
- **Phase 1:** Setup Dart package, define standard Models (User, Course, OTP), and API Network Client.
- **Phase 2:** Implement Auth APIs (OTP Request/Verify) and Course APIs.
- **Phase 3:** Implement WebSocket Client for Cloudflare Durable Objects.
- **Phase 4:** Build customizable UI Widgets (`NsLmsThemeProvider`).
- **Phase 5:** Write professional `README.md`, set up GitHub Actions, and prepare for pub.dev launch.
