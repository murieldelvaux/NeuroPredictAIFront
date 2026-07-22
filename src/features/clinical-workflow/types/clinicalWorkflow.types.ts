import type { PatientCreatePayload } from '../../../types';

export type ClinicalWorkflowProps = {
  onSave: (payload: PatientCreatePayload, mriFile?: File | null) => void;
  isSaving: boolean;
  onCancel: () => void;
};
