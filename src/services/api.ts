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

  createPatient(demographics: any, history: any, cognitive: any, imaging?: any) {
    return patientApiService.createPatient({
      name: demographics.name,
      age: demographics.age,
      gender: demographics.gender,
      mrn: demographics.mrn,
      education_years: demographics.educationYears ?? 12,
      symptoms: history.symptoms ?? [],
      family_history: history.familyHistory ?? false,
      risk_factors: history.riskFactors ?? [],
      comorbidities: history.comorbidities ?? [],
      medications: history.medications ?? [],
      mmse: cognitive.mmse,
      moca: cognitive.moca,
      cdr: cognitive.cdr,
      scan_type: imaging?.scanType,
      scan_date: imaging?.scanDate,
      radiologist_notes: imaging?.radiologistNotes,
    }).then(adaptPatientOut);
  },
};

export const predictionService = {
  predict(patientId: string, payload: any) {
    return predictionApiService.predict({
      patient_id: patientId,
      ...payload,
    }).then(adaptPredictionOut);
  },
};
