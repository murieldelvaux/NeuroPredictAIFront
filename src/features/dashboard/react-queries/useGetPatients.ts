import { useQuery } from '@tanstack/react-query';
import { getPatients } from '../requests/getPatients';

export const getPatientsQueryKey = 'getPatients';

export const useGetPatients = () =>
  useQuery({
    queryKey: [getPatientsQueryKey],
    queryFn: () => getPatients(),
    staleTime: 5_000,
  });
