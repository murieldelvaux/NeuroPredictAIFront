import { useQuery } from '@tanstack/react-query';
import { getPatients } from '../requests/getPatients';
import { adaptPatientOut } from '../requests/adaptPatientOut';

export const getPatientsQueryKey = 'getPatients';

export const useGetPatients = () =>
  useQuery({
    queryKey: [getPatientsQueryKey],
    queryFn: () => getPatients().then((list) => list.map(adaptPatientOut)),
    staleTime: 5_000,
  });
