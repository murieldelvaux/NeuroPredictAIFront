import type { PatientSex } from './patient.types';

export type WorkflowStep = 1 | 2 | 3 | 4 | 5 | 6;

export type MedicalWorkflowSession = {
  currentStep: WorkflowStep;
  patientDemographics?: {
    name?: string;
    age?: number;
    sex?: PatientSex;
    mrn?: string;
    date_of_birth?: string;
    phone?: string;
    email?: string;
    educationYears?: number;
  };
  clinicalHistory?: {
    symptoms?: string[];
    familyHistory?: {
      alzheimersRelation: string[];
      dementiaCount: number;
    };
    riskFactors?: string[];
    comorbidities?: string[];
    medications?: string[];
  };
  cognitiveScores?: {
    mmse: number;
    moca: number;
    cdr: number;
    cdrtot: number;
  };
  imagingInfo?: {
    scanType: string;
    scanDate: string;
    radiologistNotes: string;
    fileUploaded?: string;
  };
};
