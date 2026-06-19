import type { PatientSex } from '../../../types';

export type ClinicalWorkflowProps = {
  onPatientSaved?: (patientId: string) => void;
};

export type WorkflowDemographicsForm = {
  name: string;
  age: number;
  sex: PatientSex;
  date_of_birth: string;
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
