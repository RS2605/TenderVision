import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../../core/theme/app_theme.dart';

class AnalysisView extends StatelessWidget {
  final int matchScore;
  final Map<String, dynamic> analysisData;

  const AnalysisView({
    super.key,
    this.matchScore = 85,
    this.analysisData = const {
      'eligibility': ['Must have 3 years experience', 'Turnover > \$1M'],
      'financial_barriers': ['EMD Amount: \$5000'],
      'compliance_checklist': ['ISO 9001 Certification required'],
    },
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.deepNavy,
      appBar: AppBar(
        title: const Text('Tender Analysis'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            FadeInDown(
              child: _buildcircularScore(),
            ),
            const SizedBox(height: 32),
            FadeInUp(
              delay: const Duration(milliseconds: 300),
              child: _buildChecklistSection('Eligibility Criteria', analysisData['eligibility']),
            ),
            const SizedBox(height: 16),
            FadeInUp(
              delay: const Duration(milliseconds: 500),
              child: _buildChecklistSection('Financial Barriers', analysisData['financial_barriers']),
            ),
            const SizedBox(height: 16),
            FadeInUp(
              delay: const Duration(milliseconds: 700),
              child: _buildChecklistSection('Compliance Checklist', analysisData['compliance_checklist']),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildcircularScore() {
    return Container(
      decoration: AppTheme.glassDecoration,
      padding: const EdgeInsets.all(32),
      child: Column(
        children: [
          const Text(
            'Match Score',
            style: TextStyle(color: Colors.white70, fontSize: 18, letterSpacing: 1.2),
          ),
          const SizedBox(height: 16),
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                height: 120,
                width: 120,
                child: CircularProgressIndicator(
                  value: matchScore / 100,
                  strokeWidth: 8,
                  backgroundColor: Colors.white12,
                  valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.gold),
                  strokeCap: StrokeCap.round,
                ),
              ),
              Text(
                '\$matchScore%',
                style: const TextStyle(
                  color: AppTheme.gold,
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildChecklistSection(String title, List<dynamic> items) {
    return Container(
      width: double.infinity,
      decoration: AppTheme.glassDecoration,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(color: AppTheme.gold, fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          ...items.map((item) => Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.check_circle_outline, color: Colors.greenAccent, size: 20),
                const SizedBox(width: 12),
                Expanded(child: Text(item.toString(), style: const TextStyle(color: Colors.white70, fontSize: 15))),
              ],
            ),
          )).toList(),
        ],
      ),
    );
  }
}
