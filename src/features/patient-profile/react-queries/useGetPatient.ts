import { useQuery } from '@tanstack/react-query';
import type { PatientRecord } from '@/src/types';
import {
  mapCognitive,
  mapDemographics,
  mapExam,
  mapHistory,
  mapImagingAnalysis,
  mapRiskCategory,
  mapSexFromApi,
} from '@/src/lib/mappers/patient.mappers';
import { getPatient } from '../requests/getPatient';

export const getPatientQueryKey = 'patient';

export const useGetPatient = (id: string) =>
  useQuery<PatientRecord>({
    queryKey: [getPatientQueryKey, id],
    queryFn: async () => {
      const detail = await getPatient(id);
      const patient = detail.patient;
      const demographics = mapDemographics(detail);
      const history = mapHistory(detail);
      const cognitive = mapCognitive(detail);
      const exam = mapExam(detail);
      const imagingAnalysis = mapImagingAnalysis(detail);
      const lastPrediction = patient.last_prediction;
      const riskScore = lastPrediction?.risk_score ?? 0;

      const record: PatientRecord = {
        patient: {
          id: patient.id,
          name: patient.name,
          age: patient.age,
          sex: mapSexFromApi(patient.sex),
          mrn: demographics.mrn,
          riskScore: Math.round(riskScore * 100),
          riskCategory: mapRiskCategory(
            lastPrediction?.classification ?? '',
            riskScore,
          ),
          lastEvaluated: patient.created_at ?? '',
          status: lastPrediction ? 'Completed' : 'Pending Interpretation',
        },
        demographics,
        history,
        cognitive,
        exam,
        imagingAnalysis,
      };

      return record;
    },
    enabled: !!id,
    staleTime: 5_000,
  });
