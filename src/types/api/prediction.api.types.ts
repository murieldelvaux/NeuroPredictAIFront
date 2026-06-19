// Espelha PredictionOutput do backend (prediction.py)

export type FeatureImportanceResponse = {
  feature: string;
  impact: number;
  direction: 'risk' | 'protective';
};

export type PredictionResponse = {
  patient_id: string;
  risk_score: number;           // 0.0 – 1.0
  classification: string;       // 'CN' | 'MCI' | 'AD'
  confidence: number;           // 0.0 – 1.0
  probabilities: Record<string, number>;
  explanation?: FeatureImportanceResponse[] | null;
  model_version: string;
};

export type PredictPayload = {
  patient_id: string;
  mri_file?: File | null;
  age?: number | null;
  mmse?: number | null;
  cdr?: number | null;
  cdrtot?: number | null;
};
