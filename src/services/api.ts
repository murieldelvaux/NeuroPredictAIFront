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
      patient: adaptPatientOut(detail),
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
        gender: demographics.gender,
        mrn: demographics.mrn,
        education_years: demographics.educationYears ?? 12,
        symptoms: history.symptoms ?? [],
        family_history: hasFamilyHistory,
        risk_factors: history.riskFactors ?? [],
        comorbidities: history.comorbidities ?? [],
        medications: history.medications ?? [],
        mmse: cognitive.mmse,
        moca: cognitive.moca,
        cdr: cognitive.cdr,
        scan_type: imaging?.scanType,
        scan_date: imaging?.scanDate,
        radiologist_notes: imaging?.radiologistNotes,
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
