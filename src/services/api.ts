import {
  patientApiService,
  predictionApiService,
  adaptPatientOut,
  adaptPredictionOut,
} from './apiClient';
import type { Patient } from '../types';

export const patientService = {
  getPatients(): Promise<Patient[]> {
    return patientApiService.getPatients().then(list => list.map(adaptPatientOut));
  },

  getPatient(id: string) {
    return patientApiService.getPatient(id).then(detail => ({
      patient: adaptPatientOut(detail.patient),
      aiAnalysis: null,
    }));
  },

  /**
   * Creates a new patient.
   * Maps camelCase front-end shape → snake_case backend payload.
   * history.familyHistory is a nested object in the UI; the API expects
   * a flat boolean `family_history` (true if any relation is listed).
   */
  createPatient(
    demographics: any,
    history: any,
    cognitive: any,
    imaging?: any,
  ) {
    const hasFamilyHistory =
      Array.isArray(history?.familyHistory?.alzheimersRelation)
        ? history.familyHistory.alzheimersRelation.length > 0
        : Boolean(history?.familyHistory);

    return patientApiService
      .createPatient({
        name: demographics.name,
        age: demographics.age,
        sex: demographics.sex,
        clinical_data:{
          education_years: demographics.educationYears ?? 12,
          mmse: cognitive.mmse,
          moca: cognitive.moca,
          cdr: cognitive.cdr,
          family_history: hasFamilyHistory,
          cdrtot: cognitive.cdrtot,
          comorbidities: history.comorbidities ?? [],
        },
        date_of_birth: demographics.dob,
      })
      .then(adaptPatientOut);
  },
};

export const predictionService = {
  predict(patientId: string, payload: any) {
    return predictionApiService
      .predict({
        patient_id: patientId,
        ...payload,
      })
      .then(adaptPredictionOut);
  },
};
