import type { PatientDetailResponse } from '../../../types';

export type PatientProfileProps = {
  patientRecord: PatientDetailResponse | null;
  onBack?: () => void;
};
