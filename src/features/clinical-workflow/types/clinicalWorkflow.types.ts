import type { PatientDemographics, ClinicalHistory } from '../../../types';

export interface CreatePatientVariables {
  demographics: Omit<PatientDemographics, 'id'>;
  history: ClinicalHistory;
  cognitive: { mmse: number; moca: number; cdr: number; cdrtot: number };
  imaging?: {
    scanType: string;
    scanDate: string;
    radiologistNotes: string;
    fileUploaded?: string;
  };
}

export interface UseClinicalEvaluationVariables {
  patientId: string;
  cognitive: { mmse: number; moca: number; cdr: number; cdrtot: number };
  historyUpdate?: Partial<ClinicalHistory>;
}
