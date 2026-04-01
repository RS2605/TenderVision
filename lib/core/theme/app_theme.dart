import 'package:flutter/material.dart';

class AppTheme {
  static const Color deepNavy = Color(0xFF0A192F);
  static const Color gold = Color(0xFFD4AF37);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: deepNavy,
      primaryColor: gold,
      colorScheme: const ColorScheme.dark(
        primary: gold,
        surface: Color(0xFF112240), // slightly lighter navy for surfaces
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: gold, // Primary brand color
          foregroundColor: deepNavy,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
      ),
    );
  }

  /// Reusable styling for glassmorphism
  static BoxDecoration glassDecoration = BoxDecoration(
    color: Colors.white.withOpacity(0.05),
    borderRadius: BorderRadius.circular(20),
    border: Border.all(
      color: Colors.white.withOpacity(0.1),
      width: 1.5,
    ),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.2),
        blurRadius: 10,
        spreadRadius: 2,
      ),
    ],
  );
}
