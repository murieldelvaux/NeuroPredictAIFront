import type { PatientDetailResponse } from '../../../types';

export interface PatientProfileProps {
  patientRecord: PatientDetailResponse | null;
  onBack: () => void;
}
