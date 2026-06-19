/**
 * Adapters: snake_case (backend) → camelCase (frontend)
 * Extraídos do antigo apiClient.ts.
 */

import type { PatientOut, PredictionOut } from '../types/api';
import type { Patient, AIAnalysisResult } from '../types';

export function adaptPatientOut(p: PatientOut): Patient {
  const score = p.risk_score ?? 0;
  const rawCategory = p.risk_category ?? '';

  const normalize = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  const category = ['High', 'Moderate', 'Low'].includes(normalize(rawCategory))
    ? (normalize(rawCategory) as 'High' | 'Moderate' | 'Low')
    : score >= 0.6
    ? 'High'
    : score >= 0.3
    ? 'Moderate'
    : 'Low';

  const sex =
    p.sex === 'Male' || p.sex === 'Female' || p.sex === 'Other' ? p.sex : 'Other';

  return {
    id: p.id,
    name: p.name,
    age: p.age,
    sex,
    mrn: p.mrn ?? '—',
    riskScore: Math.round(score * 100),
    riskCategory: category,
    lastEvaluated: p.last_evaluated ?? '—',
    status: p.status ?? 'Pending Interpretation',
  };
}

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
