// Barrel de re-exports — importe sempre daqui
// API types only - no UI-only abstractions

export type { AppView, PatientSex, PatientStatus, RiskCategory, ToastMessage } from './ui.types';
export type { MedicalWorkflowSession, WorkflowStep } from './workflow.types';
export type {
  PatientCreatePayload,
  ClinicalDataPayload,
  MRIFileMetadata,
  PatientResponse,
  PatientDetailResponse,
  PatientLastPrediction,
  HealthResponse,
} from './api/patient.api.types';
export type { PredictionResponse, PredictPayload, FeatureImportanceResponse } from './api/prediction.api.types';
