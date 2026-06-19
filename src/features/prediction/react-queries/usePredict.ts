import { useMutation } from '@tanstack/react-query';
import { predict } from '../requests/predict';
import { adaptPredictionOut } from '@/clients/adapters';
import type { PredictPayload } from '@/types/api';

export const usePredict = () =>
  useMutation({
    mutationFn: (payload: PredictPayload) =>
      predict(payload).then(adaptPredictionOut),
  });
