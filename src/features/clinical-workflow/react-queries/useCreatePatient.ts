import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { createPatient } from '../requests/createPatient';
import type { PatientResponse } from '../../../types';
import type { CreatePatientVariables } from '../types/clinicalWorkflow.types';
import { mapSexToApi } from '../../../lib/mappers/patient.mappers';
import { patientsQueryKey } from '../../dashboard/react-queries/usePatients';

export const useCreatePatient = (
  options: UseMutationOptions<PatientResponse, unknown, CreatePatientVariables> = {},
) => {
  const queryClient = useQueryClient();

  return useMutation<PatientResponse, unknown, CreatePatientVariables>({
    ...options,
    mutationFn: (variables: CreatePatientVariables) => {
      const dob =
        variables.demographics.date_of_birth ??
        new Date(new Date().getFullYear() - variables.demographics.age, 0, 1)
          .toISOString()
          .split('T')[0];

      return createPatient({
        name:          variables.demographics.name,
        age:           variables.demographics.age,
        sex:           mapSexToApi(variables.demographics.sex),
        date_of_birth: dob,
        clinical_data: {
          mmse:            variables.cognitive.mmse,
          moca:            variables.cognitive.moca,
          cdr:             variables.cognitive.cdr,
          cdrtot:          variables.cognitive.cdrtot,
          comorbidities:   variables.history.comorbidities ?? [],
          family_history:  (variables.history.familyHistory?.dementiaCount ?? 0) > 0,
          education_years: variables.demographics.educationYears ?? 12,
        },
      });
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: [patientsQueryKey] });
      options.onSuccess?.(...args);
    },
  });
};
