import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateClinicalEvaluation } from '../requests/updateClinicalEvaluation';
import type { UseClinicalEvaluationVariables } from '../types/clinicalWorkflow.types';
import { patientsQueryKey } from '../../dashboard/react-queries/usePatients';
import { patientQueryKey } from '../../patient-profile/react-queries/usePatient';

export const useClinicalEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UseClinicalEvaluationVariables) =>
      updateClinicalEvaluation(variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [patientsQueryKey] });
      queryClient.invalidateQueries({
        queryKey: [patientQueryKey, variables.patientId],
      });
    },
  });
};
