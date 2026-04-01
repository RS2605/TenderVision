import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiConstants {
  // Key successfully sourced from your local .env file
  static String get geminiApiKey => dotenv.env['GEMINI_API_KEY'] ?? 'KEY_NOT_FOUND';
}
