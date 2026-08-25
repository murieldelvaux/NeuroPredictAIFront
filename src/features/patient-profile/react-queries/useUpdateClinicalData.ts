import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateClinicalData } from '../requests/updateClinicalData';
import { getPatientQueryKey } from './useGetPatient';
import type { UpdateClinicalDataPayload } from '@/src/types';

export const useUpdateClinicalData = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateClinicalDataPayload) => updateClinicalData(patientId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getPatientQueryKey, patientId] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};
