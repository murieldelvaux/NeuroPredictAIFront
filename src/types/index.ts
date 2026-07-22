// Barrel de re-exports — importe sempre daqui
// API types only - no UI-only abstractions

export type { PatientSex } from './patient.types';
export type { MedicalWorkflowSession, WorkflowStep } from './workflow.types';
export type {
  PatientCreatePayload,
  ClinicalDataPayload,
  MRIFileMetadata,
  PatientResponse,
  PatientDetailResponse,
  PatientLastPrediction,
  PatientDemographicsResponse,
  PatientHistoryResponse,
  PatientExamResponse,
  PatientImagingAnalysisResponse,
  PatientAIAnalysisResponse,
  HealthResponse,
  PatientResponseWithClinical,
} from './api/patient.api.types';
export type { PredictionResponse, PredictPayload, FeatureImportanceResponse } from './api/prediction.api.types';
