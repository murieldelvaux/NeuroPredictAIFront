import type { PatientSex, ClinicalHistory } from '../../../types';

export type ClinicalWorkflowProps = {
  onPatientSaved?: (patientId: string) => void;
};

export type WorkflowDemographicsForm = {
  name: string;
  age: number;
  sex: PatientSex;
  date_of_birth?: string | null;
  educationYears: number;
  mrn?: string;
  phone?: string;
  email?: string;
};

export type WorkflowClinicalForm = {
  mmse: number;
  moca: number;
  cdr: number;
  cdrtot: number;
  comorbidities: string[];
  family_history: boolean;
};

/** Variáveis passadas ao mutationFn de useCreatePatient */
export type CreatePatientVariables = {
  demographics: WorkflowDemographicsForm;
  history: Pick<ClinicalHistory, 'comorbidities' | 'familyHistory'>;
  cognitive: WorkflowClinicalForm;
};

/** Variáveis passadas ao mutationFn de useClinicalEvaluation */
export type UseClinicalEvaluationVariables = {
  patientId: string;
  cognitive: {
    mmse: number;
    moca: number;
    cdr: number;
  };
  historyUpdate?: Partial<Pick<ClinicalHistory, 'symptoms' | 'medications' | 'comorbidities'>>;
};
