import type { PatientResponse, PredictionResponse } from '../types';

export function adaptPatientOut(p: PatientResponse): PatientResponse {
  return p;
}

export function adaptPredictionOut(p: PredictionResponse): PredictionResponse {
  return p;
}