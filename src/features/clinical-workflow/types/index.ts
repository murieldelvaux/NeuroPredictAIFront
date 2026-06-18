export interface ClinicalWorkflowProps {
  onComplete: (patientId: string) => void;
  onCancel: () => void;
}
