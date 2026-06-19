import { neuroPredictServiceFetch } from '@/src/clients/neuroPredictServiceFetch';
import type {
  PatientCreatePayload
} from '@/src/types/api';
import type { PatientDemographics, ClinicalHistory, Patient } from '@/src/types';

const SEX_MAP: Record<string, 'M' | 'F'> = {
  Male: 'M',
  Female: 'F',
};

export interface CreatePatientVariables {
  demographics: Omit<PatientDemographics, 'id'>;
  history: ClinicalHistory;
  cognitive: { mmse: number; moca: number; cdr: number; cdrtot: number };
}

export const createPatient = (vars: CreatePatientVariables): Promise<Patient> => {
  const { demographics, history, cognitive } = vars;

  const hasFamilyHistory = Array.isArray(history.familyHistory?.alzheimersRelation)
    ? history.familyHistory.alzheimersRelation.length > 0
    : Boolean(history.familyHistory);

  const payload: PatientCreatePayload = {
    name: demographics.name,
    age: demographics.age,
    sex: SEX_MAP[demographics.sex],
    date_of_birth: demographics.date_of_birth,
    clinical_data: {
      mmse: cognitive.mmse,
      moca: cognitive.moca,
      cdr: cognitive.cdr,
      cdrtot: cognitive.cdrtot,
      comorbidities: history.comorbidities ?? [],
      family_history: hasFamilyHistory,
      education_years: demographics.educationYears ?? 12,
    },
  };

  return neuroPredictServiceFetch<Patient>('/patients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
