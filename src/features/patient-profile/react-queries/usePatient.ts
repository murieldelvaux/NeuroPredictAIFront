import { useQuery } from '@tanstack/react-query';
import type { QueryFnOptions } from '../../../lib/react-query/react-query';
import type { PatientRecord } from '../../../types';
import { getPatient } from '../requests/getPatient';
import { mapPatientFromApi, mapDemographics, mapHistory, mapCognitive, mapExam, mapImagingAnalysis, mapAIAnalysis } from '../../../lib/mappers/patient.mappers';

export const patientQueryKey = 'patient';

type UsePatientOptions<TData = PatientRecord> = {
  options?: QueryFnOptions<PatientRecord, TData>;
};

export const usePatient = <TData = PatientRecord>(
  id: string,
  { options = {} }: UsePatientOptions<TData> = {},
) =>
  useQuery({
    ...options,
    queryKey: [patientQueryKey, id],
    queryFn: async (): Promise<PatientRecord> => {
      const detail = await getPatient(id);
      return {
        patient:        mapPatientFromApi(detail.patient as Parameters<typeof mapPatientFromApi>[0]),
        demographics:   mapDemographics(detail),
        history:        mapHistory(detail),
        cognitive:      mapCognitive(detail),
        exam:           mapExam(detail),
        imagingAnalysis: mapImagingAnalysis(detail),
        aiAnalysis:     mapAIAnalysis(detail),
      };
    },
    enabled: typeof id === 'string' && id.trim().length > 0,
    staleTime: 5000,
  });
