class NsConfig {
  static String baseUrl = '';

  /// Initialize the SDK with your Cloudflare Worker / Server URL
  static void initialize({required String url}) {
    // Remove trailing slash if present
    if (url.endsWith('/')) {
      baseUrl = url.substring(0, url.length - 1);
    } else {
      baseUrl = url;
    }
  }
}
