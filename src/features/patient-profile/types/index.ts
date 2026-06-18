import { PatientRecord } from '../../../types';

export interface PatientProfileProps {
  patientRecord: PatientRecord;
  onBack: () => void;
}
