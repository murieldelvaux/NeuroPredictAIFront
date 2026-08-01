export type ClinicalWorkflowProps = {
  onComplete: (patientId: string) => void;
  onError: (message: string) => void;
  onCancel: () => void;
};
