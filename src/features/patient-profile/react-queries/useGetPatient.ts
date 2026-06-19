import { useQuery } from '@tanstack/react-query';
import { getPatient } from '../requests/getPatient';
import { adaptPatientOut } from '@/src/clients/adapters';

export const getPatientQueryKey = 'patient';

export const useGetPatient = (id: string) =>
  useQuery({
    queryKey: [getPatientQueryKey, id],
    // cast detail to any to satisfy adaptPatientOut's expected input shape
    queryFn: () => getPatient(id).then((detail) => adaptPatientOut(detail as any)),
    enabled: !!id,
    staleTime: 5_000,
  });
