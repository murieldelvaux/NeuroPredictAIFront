import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateClinicalEvaluation } from '../requests/updateClinicalEvaluation';
import { getPatientsQueryKey } from '../../dashboard/react-queries/useGetPatients';
import { getPatientQueryKey } from '../../patient-profile/react-queries/useGetPatient';

export const useClinicalEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation<Awaited<ReturnType<typeof updateClinicalEvaluation>>, Error, Parameters<typeof updateClinicalEvaluation>[0]>({
    mutationFn: (variables) => updateClinicalEvaluation(variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [getPatientsQueryKey] });
      queryClient.invalidateQueries({
        queryKey: [getPatientQueryKey, variables.patientId],
      });
    },
  });
};
