import { useQuery } from '@tanstack/react-query';
import type { QueryFnOptions } from '../../../lib/react-query/react-query';
import type { PatientOut } from '../../../types/api';
import type { Patient } from '../../../types';
import { getPatients } from '../requests/getPatients';
import { adaptPatientOut } from '../utils/adaptPatientOut';

export const patientsQueryKey = 'patients';

type UsePatientsOptions<TData = Patient[]> = {
  options?: QueryFnOptions<Patient[], TData>;
};

export const usePatients = <TData = Patient[]>(
  { options = {} }: UsePatientsOptions<TData> = {},
) => {
  return useQuery({
    ...options,
    queryKey: [patientsQueryKey],
    queryFn: async () => {
      const list = await getPatients();
      return list.map(adaptPatientOut);
    },
    staleTime: 5000,
  });
};
