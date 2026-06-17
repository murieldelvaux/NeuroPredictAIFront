import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../services/api';
import { PatientDemographics, ClinicalHistory, } from '../types';

export function usePatients() {
  return useQuery({
    queryKey: ['patients'],
    queryFn: () => patientService.getPatients(),
    staleTime: 5000,
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getPatient(id),
    enabled: !!id,
    staleTime: 5000,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: {
      demographics: Omit<PatientDemographics, 'id'>,
      history: ClinicalHistory,
      cognitive: { mmse: number; moca: number; cdr: number },
      imaging?: { scanType: string; scanDate: string; radiologistNotes: string; fileUploaded?: string }
    }) => patientService.createPatient(
      variables.demographics,
      variables.history,
      variables.cognitive,
      variables.imaging
    ),
    onSuccess: () => {
      // Invalidate both lists and detail records to trigger automatic reactivity
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    }
  });
}

/**
 * Custom mutation to update clinical metrics or register cognitive results
 */
export function useClinicalEvaluation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: {
      patientId: string;
      cognitive: { mmse: number; moca: number; cdr: number };
      historyUpdate?: Partial<ClinicalHistory>;
    }) => {
      // Direct write simulation: we request the patient record, append cognitive assessment, and write back
      const state = await patientService.getPatient(variables.patientId);
      
      // We retrieve from localStorage, patch it, and save
      const rawCognitive = localStorage.getItem('np_cognitive');
      if (rawCognitive) {
        const cogObj = JSON.parse(rawCognitive);
        if (cogObj[variables.patientId]) {
          cogObj[variables.patientId].mmse.score = variables.cognitive.mmse;
          cogObj[variables.patientId].moca.score = variables.cognitive.moca;
          cogObj[variables.patientId].cdr.score = variables.cognitive.cdr;
          cogObj[variables.patientId].cdr.status = variables.cognitive.cdr === 0 ? "Normal" : variables.cognitive.cdr === 0.5 ? "Prodromal / Very Mild" : "Mild Dementia";
          
          // Push to history
          cogObj[variables.patientId].history.push({
            date: new Date().getFullYear().toString() + "-" + String(new Date().getMonth() + 1).padStart(2, '0'),
            mmse: variables.cognitive.mmse,
            moca: variables.cognitive.moca,
            cdr: variables.cognitive.cdr
          });
          localStorage.setItem('np_cognitive', JSON.stringify(cogObj));
        }
      }

      // If clinical history updates exist, record those as well
      if (variables.historyUpdate) {
        const rawHist = localStorage.getItem('np_histories');
        if (rawHist) {
          const histObj = JSON.parse(rawHist);
          if (histObj[variables.patientId]) {
            histObj[variables.patientId] = {
              ...histObj[variables.patientId],
              ...variables.historyUpdate
            };
            localStorage.setItem('np_histories', JSON.stringify(histObj));
          }
        }
      }

      return state.patient;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', variables.patientId] });
    }
  });
}

export function useAIAnalysis(patientId: string) {
  return useQuery({
    queryKey: ['aiAnalysis', patientId],
    queryFn: async () => {
      const state = await patientService.getPatient(patientId);
      return state.aiAnalysis;
    },
    enabled: !!patientId,
    staleTime: 5000,
  });
}

export function useImagingAnalysis(scanId: string) {
  return useQuery({
    queryKey: ['imagingAnalysis', scanId],
    queryFn: async () => {
      const raw = localStorage.getItem('np_img_analysis');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed[scanId] || null;
      }
      return null;
    },
    enabled: !!scanId,
    staleTime: 5000,
  });
}
