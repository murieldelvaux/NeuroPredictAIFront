import { neuroPredictServiceFetch } from '@/clients/neuroPredictServiceFetch';
import type { PatientCreatePayload, PatientOut } from '@/types/api';
import type { PatientDemographics, ClinicalHistory } from '@/types';

const SEX_MAP: Record<'Male' | 'Female' | 'Other', 'M' | 'F' | 'O'> = {
  Male: 'M',
  Female: 'F',
  Other: 'O',
};

export interface CreatePatientInput {
  demographics: Omit<PatientDemographics, 'id'>;
  history: ClinicalHistory;
  cognitive: { mmse: number; moca: number; cdr: number; cdrtot: number };
}

export const createPatient = (input: CreatePatientInput): Promise<PatientOut> => {
  const { demographics, history, cognitive } = input;

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

  return neuroPredictServiceFetch<PatientOut>('/patients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
