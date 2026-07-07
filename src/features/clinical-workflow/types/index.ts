import type { PatientDemographics, ClinicalHistory, ClinicalDataPayload, ImagingExam } from '../../../types';

export interface ClinicalWorkflowProps {
  onSave: (data: {
    demographics: Omit<PatientDemographics, 'id'>;
    history: ClinicalHistory;
    cognitive: ClinicalDataPayload;
    imaging?: Pick<ImagingExam, 'scanType' | 'scanDate' | 'radiologistNotes'> & { fileUploaded?: string };
  }) => void;
  isSaving: boolean;
  onCancel: () => void;
}
