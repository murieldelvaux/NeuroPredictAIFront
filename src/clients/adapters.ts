/**
 * Adapters: snake_case (backend) → camelCase (frontend)
 * Extraídos do antigo apiClient.ts.
 */

import { AIAnalysisResult, Patient, PredictionResponse } from "../types";

export function adaptPatientOut(p: Patient): Patient {
  const score = p.riskScore ?? 0;
  const rawCategory = p.riskCategory ?? '';

  const normalize = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  const category = (['High', 'Moderate', 'Low'] as const).includes(
    normalize(rawCategory) as 'High' | 'Moderate' | 'Low',
  )
    ? (normalize(rawCategory) as 'High' | 'Moderate' | 'Low')
    : score >= 0.6
      ? 'High'
      : score >= 0.3
        ? 'Moderate'
        : 'Low';

  return {
    id: p.id,
    name: p.name,
    age: p.age,
    sex: p.sex,
    mrn: p.mrn ?? '—',
    riskScore: Math.round(score * 100),
    riskCategory: category,
    lastEvaluated: p.lastEvaluated ?? '—',
    status: p.status ?? 'Pending Interpretation',
  };
}

export function adaptPredictionOut(p: PredictionResponse): AIAnalysisResult {
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