import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { createPatient } from '../requests/createPatient';
import { adaptPatientOut } from '../../dashboard/utils/adaptPatientOut';
import type { CreatePatientVariables } from '../types/clinicalWorkflow.types';
import type { Patient } from '../../../types';
import { patientsQueryKey } from '../../dashboard/react-queries/usePatients';

export const useCreatePatient = (
  options: UseMutationOptions<Patient, unknown, CreatePatientVariables> = {},
) => {
  const queryClient = useQueryClient();

  return useMutation<Patient, unknown, CreatePatientVariables>({
    ...options,
    mutationFn: (variables: CreatePatientVariables): Promise<Patient> => {
      const genderMap: Record<string, 'M' | 'F' | 'O'> = {
        Male: 'M',
        Female: 'F',
        Other: 'O',
      };

      const dob = variables.demographics.dob
        ?? new Date(
            new Date().getFullYear() - variables.demographics.age,
            0,
            1,
          )
            .toISOString()
            .split('T')[0];

      return createPatient({
        name: variables.demographics.name,
        age: variables.demographics.age,
        sex: genderMap[variables.demographics.sex] ?? 'O',
        date_of_birth: dob,
        clinical_data: {
          mmse: variables.cognitive.mmse,
          moca: variables.cognitive.moca,
          cdr: variables.cognitive.cdr,
          cdrtot: variables.cognitive.cdr,
          comorbidities: variables.history.comorbidities ?? [],
          family_history: (variables.history.familyHistory?.dementiaCount ?? 0) > 0,
          education_years: variables.demographics.educationYears ?? 12,
        },
      }).then(adaptPatientOut);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: [patientsQueryKey] });
      options.onSuccess?.(...args);
    },
  });
};
