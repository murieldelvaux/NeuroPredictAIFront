import { useMutation, useQueryClient } from '@tanstack/react-query';
import { validateDiagnosis } from '../requests/validateDiagnosis';
import { getPatientQueryKey } from './useGetPatient';
import type { ValidateDiagnosisPayload } from '@/src/types';

export const useValidateDiagnosis = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ValidateDiagnosisPayload) => validateDiagnosis(patientId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getPatientQueryKey, patientId] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};
