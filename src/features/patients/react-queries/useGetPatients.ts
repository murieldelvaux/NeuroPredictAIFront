import { useQuery } from '@tanstack/react-query';
import { getPatients } from '../requests/getPatients';
import { adaptPatientOut } from '@/clients/adapters';

export const getPatientsQueryKey = 'patients';

export const useGetPatients = () =>
  useQuery({
    queryKey: [getPatientsQueryKey],
    queryFn: () => getPatients().then((list) => list.map(adaptPatientOut)),
    staleTime: 5_000,
  });
