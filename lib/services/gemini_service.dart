import 'dart:convert';
import 'package:google_generative_ai/google_generative_ai.dart';
import '../core/constants/api_constants.dart';

class GeminiService {
  late final GenerativeModel _model;

  GeminiService() {
    _model = GenerativeModel(
      model: 'gemini-1.5-flash',
      apiKey: ApiConstants.geminiApiKey,
    );
  }

  /// Implements "Chunking Strategy" to process 50+ page PDFs.
  /// Splits text into 3000 token (~12k characters) chunks.
  Future<Map<String, dynamic>> analyzeTenderDocument(String fullText) async {
    const int chunkSize = 12000; 
    List<String> chunks = [];
    
    for (int i = 0; i < fullText.length; i += chunkSize) {
      chunks.add(fullText.substring(i, i + chunkSize > fullText.length ? fullText.length : i + chunkSize));
    }

    String combinedInsights = "";

    // Process sequentially to keep memory usage low
    for (var chunk in chunks) {
      final prompt = '''
        Analyze the following tender document text chunk. Extract only:
        1. Direct Eligibility Criteria (e.g., "Must have 3 years experience").
        2. Financial Barriers (e.g., "EMD Amount required").
        3. Compliance Checklist (e.g., "ISO Certification required").
        
        Text:
        \$chunk
      ''';
      
      final content = [Content.text(prompt)];
      final response = await _model.generateContent(content);
      combinedInsights += "\${response.text}\n";
    }

    // Final pass to summarize all chunks
    final summaryPrompt = '''
      You are a specialized government tender analyst. Here are the insights extracted from a 50+ page PDF:
      \$combinedInsights
      
      Summarize everything into a clean JSON structure with these exact keys:
      {
        "eligibility": ["..."],
        "financial_barriers": ["..."],
        "compliance_checklist": ["..."]
      }
      Respond ONLY with valid JSON.
    ''';
    
    final finalResponse = await _model.generateContent([Content.text(summaryPrompt)]);
    return _parseJson(finalResponse.text);
  }

  Map<String, dynamic> _parseJson(String? text) {
    if (text == null) return {};
    // Strip markdown code blocks if any
    try {
      final jsonStr = text.replaceAll('```json', '').replaceAll('```', '').trim();
      return jsonDecode(jsonStr);
    } catch (e) {
      return {"error": "Failed to parse AI response"};
    }
  }
}
