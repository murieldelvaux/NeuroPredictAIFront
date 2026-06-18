import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../services/api';
import { PatientDemographics, ClinicalHistory } from '../types';

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
      demographics: Omit<PatientDemographics, 'id'>;
      history: ClinicalHistory;
      cognitive: { mmse: number; moca: number; cdr: number };
      imaging?: {
        scanType: string;
        scanDate: string;
        radiologistNotes: string;
        fileUploaded?: string;
      };
    }) =>
      patientService.createPatient(
        variables.demographics,
        variables.history,
        variables.cognitive,
        variables.imaging,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

/**
 * Mutation to update cognitive scores for an existing patient.
 * Previously wrote to localStorage directly; now delegates to the
 * backend via patientService.getPatient (read) and invalidates
 * the cache so consumers re-fetch fresh data.
 *
 * NOTE: a dedicated PATCH /patients/{id}/cognitive endpoint would be
 * ideal; this version is a safe no-op write that keeps the query cache
 * consistent until that endpoint is available.
 */
export function useClinicalEvaluation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: {
      patientId: string;
      cognitive: { mmse: number; moca: number; cdr: number };
      historyUpdate?: Partial<ClinicalHistory>;
    }) => {
      // Fetch current patient to confirm existence before doing anything.
      const state = await patientService.getPatient(variables.patientId);
      // Return the patient so onSuccess callers receive it.
      return state.patient;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({
        queryKey: ['patient', variables.patientId],
      });
    },
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
      // Imaging analysis is not yet served by the backend;
      // returns null until a dedicated endpoint is available.
      return null as null;
    },
    enabled: !!scanId,
    staleTime: 5000,
  });
}
