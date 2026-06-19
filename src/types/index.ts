// Barrel de re-exports — importe sempre daqui

export type { Patient, PatientDemographics, ClinicalHistory, CognitiveEvaluation,
  ImagingExam, ImagingAnalysisResult, PatientRecord, PatientSex, PatientStatus,
  RiskCategory, CognitiveScoreRange } from './patient.types';

export type { AIAnalysisResult, FeatureImportance } from './prediction.types';

export type { MedicalWorkflowSession, WorkflowStep } from './workflow.types';

export type { PatientCreatePayload, ClinicalDataPayload, PatientResponse,
  PatientListItem, PatientDetailResponse, PatientLastPrediction,
  HealthResponse } from './api/patient.api.types';

export type { PredictionResponse, PredictPayload, FeatureImportanceResponse } from './api/prediction.api.types';
