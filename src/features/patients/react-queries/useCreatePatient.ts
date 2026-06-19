import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPatient, type CreatePatientVariables } from '../requests/createPatient';
import { adaptPatientOut } from '@/clients/adapters';
import { getPatientsQueryKey } from './useGetPatients';

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: CreatePatientVariables) =>
      createPatient(vars).then(adaptPatientOut),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getPatientsQueryKey] });
    },
  });
};
