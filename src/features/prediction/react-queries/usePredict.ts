import { useMutation } from '@tanstack/react-query';
import { predict } from '../requests/predict';
import type { PredictPayload } from '@/src/types/api';
import { adaptPredictionOut } from '@/src/clients/adapters';

export const usePredict = () =>
  useMutation({
    mutationFn: (payload: PredictPayload) =>
      predict(payload).then(adaptPredictionOut),
  });
