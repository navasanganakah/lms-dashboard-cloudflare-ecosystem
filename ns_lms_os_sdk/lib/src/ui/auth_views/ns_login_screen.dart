import 'package:flutter/material.dart';
import '../../auth/auth_service.dart';
import '../../models/user_model.dart';
import '../theme/ns_theme.dart';

class NsLoginScreen extends StatefulWidget {
  final Function(NsUser) onSuccess;
  final Widget? logo;
  final String title;

  const NsLoginScreen({
    Key? key,
    required this.onSuccess,
    this.logo,
    this.title = 'Welcome Back',
  }) : super(key: key);

  @override
  State<NsLoginScreen> createState() => _NsLoginScreenState();
}

class _NsLoginScreenState extends State<NsLoginScreen> {
  final _authService = NsAuthService();
  final _emailController = TextEditingController();
  final _otpController = TextEditingController();
  
  bool _isLoading = false;
  int _step = 1;
  String _error = '';

  Future<void> _requestOtp() async {
    final email = _emailController.text.trim();
    if (email.isEmpty) {
      setState(() => _error = 'Please enter your email address.');
      return;
    }

    setState(() { _isLoading = true; _error = ''; });
    final success = await _authService.requestOtp(email);
    if (!mounted) return;
    setState(() {
      _isLoading = false;
      if (success) {
        _step = 2;
      } else {
        _error = 'Failed to request OTP. Please check your email or try again.';
      }
    });
  }

  Future<void> _verifyOtp() async {
    final code = _otpController.text.trim();
    if (code.length != 6) {
      setState(() => _error = 'Please enter a valid 6-digit OTP.');
      return;
    }

    setState(() { _isLoading = true; _error = ''; });
    final user = await _authService.verifyOtp(
      _emailController.text.trim(),
      code,
    );
    if (!mounted) return;
    setState(() { _isLoading = false; });
    
    if (user != null) {
      widget.onSuccess(user);
    } else {
      setState(() { _error = 'Invalid or expired OTP. Please try again.'; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: NsTheme.background,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Container(
            constraints: const BoxConstraints(maxWidth: 400),
            padding: const EdgeInsets.all(32.0),
            decoration: BoxDecoration(
              color: NsTheme.surface,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                if (widget.logo != null) widget.logo!,
                if (widget.logo == null)
                  const Icon(Icons.security, size: 48, color: NsTheme.primaryColor),
                const SizedBox(height: 24),
                Text(
                  widget.title,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: NsTheme.textPrimary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  _step == 1 ? 'Sign in with your email to continue' : 'Enter the OTP sent to your email',
                  style: const TextStyle(color: NsTheme.textSecondary),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                
                if (_error.isNotEmpty)
                  Container(
                    padding: const EdgeInsets.all(12),
                    margin: const EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(
                      color: Colors.red.shade50,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      _error,
                      style: TextStyle(color: Colors.red.shade700, fontSize: 14),
                      textAlign: TextAlign.center,
                    ),
                  ),

                if (_step == 1) ...[
                  TextField(
                    controller: _emailController,
                    decoration: const InputDecoration(labelText: 'Email Address'),
                    keyboardType: TextInputType.emailAddress,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _isLoading ? null : _requestOtp,
                    child: _isLoading
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Text('Continue with Email'),
                  ),
                ] else ...[
                  TextField(
                    controller: _otpController,
                    decoration: const InputDecoration(labelText: 'Enter OTP'),
                    keyboardType: TextInputType.number,
                    textAlign: TextAlign.center,
                    maxLength: 6,
                    style: const TextStyle(letterSpacing: 8, fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: NsTheme.primaryColor),
                    onPressed: _isLoading ? null : _verifyOtp,
                    child: _isLoading
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Text('Verify & Sign In'),
                  ),
                  TextButton(
                    onPressed: () => setState(() { _step = 1; _error = ''; }),
                    child: const Text('Back to Email', style: TextStyle(color: NsTheme.textSecondary)),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _otpController.dispose();
    super.dispose();
  }
}
