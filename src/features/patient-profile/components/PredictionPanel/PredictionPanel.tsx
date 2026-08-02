import { Box, Paper, Typography } from '@mui/material';
import type { PatientLastPrediction, PredictionResponse } from '../../../../types';

type PredictionLike = PredictionResponse | PatientLastPrediction | null;

type PredictionPanelProps = {
  prediction: PredictionLike;
};

export default function PredictionPanel({ prediction }: PredictionPanelProps) {
  if (!prediction) {
    return (
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">Nenhuma predição de IA foi gerada para este paciente.</Typography>
      </Paper>
    );
  }

  const confidence = 'confidence' in prediction ? prediction.confidence : 0;
  const riskScore = 'risk_score' in prediction ? prediction.risk_score : 0;
  const modelVersion = 'model_version' in prediction ? prediction.model_version : undefined;

  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Predição mais recente</Typography>
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2">Classificação: {prediction.classification ?? '—'}</Typography>
        <Typography variant="body2">Confiança: {((confidence ?? 0) * 100).toFixed(1)}%</Typography>
        <Typography variant="body2">Risco: {Math.round((riskScore ?? 0) * 100)}%</Typography>
        {modelVersion && <Typography variant="caption" color="text.secondary">Modelo: {modelVersion}</Typography>}
      </Box>
    </Paper>
  );
}