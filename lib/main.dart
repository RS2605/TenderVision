import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'features/tenders/presentation/analysis_view.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Load the environment variables from the .env file
  await dotenv.load(fileName: ".env");

  // Since Firebase isn't initialized yet per instructions, we just start the app
  runApp(
    const ProviderScope(
      child: TenderVisionApp(),
    ),
  );
}

class TenderVisionApp extends StatelessWidget {
  const TenderVisionApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TenderVision MVP',
      theme: AppTheme.darkTheme,
      home: const AnalysisView(), // Starting at the Analysis View
      debugShowCheckedModeBanner: false,
    );
  }
}
