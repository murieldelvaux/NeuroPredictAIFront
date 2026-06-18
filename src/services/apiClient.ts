import type {
  HealthResponse,
  PatientOut,
  PatientDetailOut,
  PatientCreatePayload,
  PredictPayload,
  PredictionOut,
} from '../types/api';

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://127.0.0.1:8000';

// ─── Core fetch helper ───────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
    const message =
      typeof err.detail === 'string'
        ? err.detail
        : Array.isArray(err.detail)
        ? err.detail.map((e: any) => e.msg).join(', ')
        : `HTTP ${res.status}`;
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// ─── Health ────────────────────────────────────────────────────────────

export const healthService = {
  check(): Promise<HealthResponse> {
    return apiFetch<HealthResponse>('/health');
  },
};

// ─── Patients ───────────────────────────────────────────────────────────

export const patientApiService = {
  /** GET /patients — returns list of all patients */
  getPatients(): Promise<PatientOut[]> {
    return apiFetch<PatientOut[]>('/patients');
  },

  /** GET /patients/{patient_id} — returns full patient detail */
  getPatient(id: string): Promise<PatientDetailOut> {
    return apiFetch<PatientDetailOut>(`/patients/${id}`);
  },

  /** POST /patients — creates a new patient record */
  createPatient(payload: PatientCreatePayload): Promise<PatientOut> {
    return apiFetch<PatientOut>('/patients', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// ─── Prediction ──────────────────────────────────────────────────────────

export const predictionApiService = {
  /** POST /predict — runs AI prediction for a patient */
  predict(payload: PredictPayload): Promise<PredictionOut> {
    return apiFetch<PredictionOut>('/predict', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// ─── camelCase adapters (backend uses snake_case) ────────────────────────
// Use these to map API responses to the existing front-end types (index.ts)

import type { Patient, AIAnalysisResult } from '../types';

export function adaptPatientOut(p: PatientOut): Patient {
  const score = p.risk_score ?? 0;
  const rawCategory = p.risk_category ?? '';
  
  // Normaliza capitalização: "low" → "Low", "HIGH" → "High"
  const normalize = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  
  const category = ['High', 'Moderate', 'Low'].includes(normalize(rawCategory))
    ? normalize(rawCategory) as 'High' | 'Moderate' | 'Low'
    : score >= 0.6 ? 'High' : score >= 0.3 ? 'Moderate' : 'Low';

  return {
    id: p.id,
    name: p.name,
    age: p.age,
    gender: p.gender ?? '—',
    mrn: p.mrn ?? '—',
    riskScore: Math.round(score * 100),   // converte 0.72 → 72 se o backend manda float 0-1
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
      shapAttributions: p.explanation.map((f) => ({
        featureName: f.feature,
        attributionValue: f.direction === 'risk' ? f.impact : -f.impact,
        category: 'Clinical' as const,
      })),
      aiReasoningSummary: `Classification: ${p.classification} — confidence ${(p.confidence * 100).toFixed(0)}%`,
      keyRiskDrivers: p.explanation
        .filter((f) => f.direction === 'risk')
        .map((f) => f.feature),
      protectiveFactors: p.explanation
        .filter((f) => f.direction === 'protective')
        .map((f) => f.feature),
    },
  };
}
