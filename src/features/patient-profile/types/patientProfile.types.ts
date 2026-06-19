import type { PatientRecord, AIAnalysisResult } from '../../../types';

export type PatientProfileProps = {
  patientId: string;
  onBack?: () => void;
};

export type PatientProfileState = {
  record: PatientRecord | null;
  analysis: AIAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
};
