import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPatient } from '../requests/createPatient';
import { getPatientsQueryKey } from '../../dashboard/react-queries/useGetPatients';
import type { PatientResponse } from '@/src/types';

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation<PatientResponse, Error, Parameters<typeof createPatient>[0]>({
    mutationFn: (vars) => createPatient(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getPatientsQueryKey] });
    },
  });
};
