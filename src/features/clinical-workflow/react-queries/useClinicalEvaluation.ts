import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateClinicalEvaluation } from '../requests/updateClinicalEvaluation';
import type { UseClinicalEvaluationVariables } from '../types/clinicalWorkflow.types';
import { getPatientsQueryKey } from '../../dashboard/react-queries/useGetPatients';
import { getPatientQueryKey } from '../../patient-profile/react-queries/useGetPatient';

export const useClinicalEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UseClinicalEvaluationVariables) =>
      updateClinicalEvaluation(variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [getPatientsQueryKey] });
      queryClient.invalidateQueries({
        queryKey: [getPatientQueryKey, variables.patientId],
      });
    },
  });
};
