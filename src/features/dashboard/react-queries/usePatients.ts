import { useQuery } from '@tanstack/react-query';
import type { QueryFnOptions } from '../../../lib/react-query/react-query';
import type { Patient } from '../../../types';
import { getPatients } from '../requests/getPatients';
import { mapPatientFromApi } from '../../../lib/mappers/patient.mappers';

export const patientsQueryKey = 'patients';

type UsePatientsOptions<TData = Patient[]> = {
  options?: QueryFnOptions<Patient[], TData>;
};

export const usePatients = <TData = Patient[]>(
  { options = {} }: UsePatientsOptions<TData> = {},
) =>
  useQuery({
    ...options,
    queryKey: [patientsQueryKey],
    queryFn: async () => {
      const list = await getPatients();
      return list.map(mapPatientFromApi);
    },
    staleTime: 5000,
  });
