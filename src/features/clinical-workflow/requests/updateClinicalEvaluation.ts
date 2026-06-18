import type { UseClinicalEvaluationVariables } from '../types/clinicalWorkflow.types';
import { getPatient } from '../../patient-profile/requests/getPatient';
import type { Patient } from '../../../types';
import { adaptPatientOut } from '../../dashboard/utils/adaptPatientOut';

/**
 * Writes cognitive evaluation updates to localStorage.
 * Will be replaced by a real PATCH /patients/:id endpoint.
 */
export const updateClinicalEvaluation = async (
  variables: UseClinicalEvaluationVariables,
): Promise<Patient> => {
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

  return adaptPatientOut(detail);
};
