import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPatient, type CreatePatientVariables } from '../requests/createPatient';
import { adaptPatientOut } from '@/src/clients/adapters';
import { getPatientsQueryKey } from '../../dashboard/react-queries/useGetPatients';

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
