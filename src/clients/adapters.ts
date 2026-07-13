import type { PatientListItem, PredictionResponse } from '../types';

export function adaptPatientOut(p: PatientListItem): PatientListItem {
  return p;
}

export function adaptPredictionOut(p: PredictionResponse): PredictionResponse {
  return p;
}