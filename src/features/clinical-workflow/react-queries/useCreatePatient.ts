import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationFnOptions } from '../../../lib/react-query/react-query';
import { createPatient } from '../requests/createPatient';
import { adaptPatientOut } from '../../dashboard/utils/adaptPatientOut';
import type { CreatePatientVariables } from '../types/clinicalWorkflow.types';
import type { Patient } from '../../../types';
import { patientsQueryKey } from '../../dashboard/react-queries/usePatients';

export const useCreatePatient = (
  options: MutationFnOptions<typeof createPatient> = {},
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (variables: CreatePatientVariables): Promise<Patient> =>
      createPatient({
        name: variables.demographics.name,
        age: variables.demographics.age,
        gender: variables.demographics.gender,
        mrn: variables.demographics.mrn,
        education_years: variables.demographics.educationYears ?? 12,
        symptoms: variables.history.symptoms ?? [],
        family_history:
          (variables.history.familyHistory?.dementiaCount ?? 0) > 0,
        risk_factors: variables.history.riskFactors ?? [],
        comorbidities: variables.history.comorbidities ?? [],
        medications: variables.history.medications ?? [],
        mmse: variables.cognitive.mmse,
        moca: variables.cognitive.moca,
        cdr: variables.cognitive.cdr,
        scan_type: variables.imaging?.scanType,
        scan_date: variables.imaging?.scanDate,
        radiologist_notes: variables.imaging?.radiologistNotes,
      }).then(adaptPatientOut),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: [patientsQueryKey] });
      options.onSuccess?.(...args);
    },
  });
};
