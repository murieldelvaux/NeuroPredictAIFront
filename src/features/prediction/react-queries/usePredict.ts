import { useMutation } from '@tanstack/react-query';
import { predict } from '../requests/predict';
import type { PredictPayload, PredictionResponse } from '@/src/types/api';

export const usePredict = () =>
  useMutation<PredictionResponse, Error, PredictPayload>({
    mutationFn: (payload) => predict(payload),
  });
