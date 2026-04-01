class MatchingEngine {
  /// Compares the Tender criteria against User Profile
  /// Returns a Match Score (0 - 100)
  int calculateMatchScore(Map<String, dynamic> userProfile, Map<String, dynamic> extractedTenderData) {
    int score = 0;
    int totalChecks = 0;
    
    // Check eligibility
    if (extractedTenderData.containsKey('eligibility')) {
      List<dynamic> criteria = extractedTenderData['eligibility'];
      for (var condition in criteria) {
        totalChecks++;
        // Very rudimentary keyword matching algorithm for MVP
        if (userProfile['_keywords']?.any((k) => condition.toString().toLowerCase().contains(k)) ?? false) {
          score += 20; 
        }
      }
    }
    
    // Cap score at 100
    if (totalChecks == 0) return 50; // default unknown score
    
    double finalScore = (score / (totalChecks * 20)) * 100;
    return finalScore.clamp(0, 100).toInt();
  }
}
