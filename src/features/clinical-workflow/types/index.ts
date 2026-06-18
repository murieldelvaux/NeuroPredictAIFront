import type { PatientDemographics, ClinicalHistory } from '../../../types';

export interface ClinicalWorkflowProps {
  onSave: (data: {
    demographics: Omit<PatientDemographics, 'id'>;
    history: ClinicalHistory;
    cognitive: { mmse: number; moca: number; cdr: number };
    imaging?: { scanType: string; scanDate: string; radiologistNotes: string; fileUploaded?: string };
  }) => void;
  isSaving: boolean;
  onCancel: () => void;
}
