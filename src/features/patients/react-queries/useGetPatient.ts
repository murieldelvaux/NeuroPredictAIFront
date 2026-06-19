import { useQuery } from '@tanstack/react-query';
import { getPatient } from '../requests/getPatient';
import { adaptPatientOut } from '@/clients/adapters';

export const getPatientQueryKey = 'patient';

export const useGetPatient = (id: string) =>
  useQuery({
    queryKey: [getPatientQueryKey, id],
    queryFn: () => getPatient(id).then((detail) => adaptPatientOut(detail.patient)),
    enabled: !!id,
    staleTime: 5_000,
  });
