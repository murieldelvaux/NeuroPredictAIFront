import type { PredictionOut } from '@/types/api';
import type { AIAnalysisResult } from '@/types';

export function adaptPredictionOut(p: PredictionOut): AIAnalysisResult {
  return {
    patientId: p.patient_id,
    predictionDate: new Date().toISOString().split('T')[0],
    probability: p.risk_score,
    riskCategory:
      p.risk_score >= 0.6 ? 'High' : p.risk_score >= 0.3 ? 'Moderate' : 'Low',
    confidenceScore: p.confidence,
    explainability: {
      shapAttributions: (p.explanation ?? []).map((f) => ({
        featureName: f.feature,
        attributionValue: f.direction === 'risk' ? f.impact : -f.impact,
        category: 'Clinical' as const,
      })),
      aiReasoningSummary: `Classification: ${p.classification} — confidence ${(p.confidence * 100).toFixed(0)}%`,
      keyRiskDrivers: (p.explanation ?? [])
        .filter((f) => f.direction === 'risk')
        .map((f) => f.feature),
      protectiveFactors: (p.explanation ?? [])
        .filter((f) => f.direction === 'protective')
        .map((f) => f.feature),
    },
  };
}
