import { getPatient } from '../../patient-profile/requests/getPatient';
import type { PatientResponse } from '../../../types';

type UpdateClinicalEvaluationVariables = {
  patientId: string;
  cognitive: {
    mmse: number;
    moca: number;
    cdr: number;
    cdrtot?: number;
  };
  historyUpdate?: Partial<{
    symptoms: string[];
    medications: string[];
    comorbidities: string[];
  }>;
};

/**
 * Writes cognitive evaluation updates to localStorage.
 * Will be replaced by a real PATCH /patients/:id endpoint.
 */
export const updateClinicalEvaluation = async (
  variables: UpdateClinicalEvaluationVariables,
): Promise<PatientResponse> => {
  const detail = await getPatient(variables.patientId);

  const rawCognitive = localStorage.getItem('np_cognitive');
  if (rawCognitive) {
    const cogObj = JSON.parse(rawCognitive);
    if (cogObj[variables.patientId]) {
      cogObj[variables.patientId].mmse.score = variables.cognitive.mmse;
      cogObj[variables.patientId].moca.score = variables.cognitive.moca;
      cogObj[variables.patientId].cdr.score = variables.cognitive.cdr;
      cogObj[variables.patientId].cdr.status =
        variables.cognitive.cdr === 0
          ? 'Normal'
          : variables.cognitive.cdr === 0.5
            ? 'Prodromal / Very Mild'
            : 'Mild Dementia';
      cogObj[variables.patientId].history.push({
        date:
          new Date().getFullYear().toString() +
          '-' +
          String(new Date().getMonth() + 1).padStart(2, '0'),
        mmse: variables.cognitive.mmse,
        moca: variables.cognitive.moca,
        cdr: variables.cognitive.cdr,
      });
      localStorage.setItem('np_cognitive', JSON.stringify(cogObj));
    }
  }

  if (variables.historyUpdate) {
    const rawHist = localStorage.getItem('np_histories');
    if (rawHist) {
      const histObj = JSON.parse(rawHist);
      if (histObj[variables.patientId]) {
        histObj[variables.patientId] = {
          ...histObj[variables.patientId],
          ...variables.historyUpdate,
        };
        localStorage.setItem('np_histories', JSON.stringify(histObj));
      }
    }
  }

  return {
    id: detail.patient.id,
    name: detail.patient.name,
    age: detail.patient.age,
    sex: detail.patient.sex,
    mrn: detail.patient.mrn ?? null,
    date_of_birth: detail.patient.date_of_birth ?? null,
    created_at: detail.patient.created_at,
    last_prediction: detail.patient.last_prediction ?? null,
    clinical_data: detail.patient.clinical_data ?? null,
  };
};
