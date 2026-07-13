import type { PatientCreatePayload } from '../../../types';

export type ClinicalWorkflowProps = {
  onSave: (payload: PatientCreatePayload) => void;
  isSaving: boolean;
  onCancel: () => void;
};
