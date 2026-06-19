import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPatient, type CreatePatientInput } from '../requests/createPatient';
import { adaptPatientOut } from '../requests/adaptPatientOut';
import { getPatientsQueryKey } from './useGetPatients';

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePatientInput) =>
      createPatient(input).then(adaptPatientOut),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getPatientsQueryKey] });
    },
  });
};
