import { useQuery } from '@tanstack/react-query';
import type { QueryFnOptions } from '../../../lib/react-query/react-query';
import type { PatientDetailOut } from '../../../types/api';
import type { Patient, AIAnalysisResult } from '../../../types';
import { getPatient } from '../requests/getPatient';
import { adaptPatientOut } from '../../dashboard/utils/adaptPatientOut';

export const patientQueryKey = 'patient';

type PatientDetail = { patient: Patient; aiAnalysis: AIAnalysisResult | null };

type UsePatientOptions<TData = PatientDetail> = {
  options?: QueryFnOptions<PatientDetail, TData>;
};

export const usePatient = <TData = PatientDetail>(
  id: string,
  { options = {} }: UsePatientOptions<TData> = {},
) => {
  return useQuery({
    ...options,
    queryKey: [patientQueryKey, id],
    queryFn: async () => {
      const detail = await getPatient(id);
      return {
        patient: adaptPatientOut(detail),
        aiAnalysis: null,
      };
    },
    enabled: !!id,
    staleTime: 5000,
  });
};
