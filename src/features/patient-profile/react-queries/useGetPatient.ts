import { useQuery } from '@tanstack/react-query';
import { getPatient } from '../requests/getPatient';
import { adaptPatientOut } from '../../patients/requests/adaptPatientOut';

export const getPatientQueryKey = 'getPatient';

export const useGetPatient = (id: string) =>
  useQuery({
    queryKey: [getPatientQueryKey, id],
    queryFn: () => getPatient(id).then((detail) => adaptPatientOut(detail.patient)),
    enabled: !!id,
    staleTime: 5_000,
  });
