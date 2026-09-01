import { Box, Chip, Paper, Typography } from '@mui/material';
import type { PatientLastPrediction, PredictionResponse } from '../../../../types';
import { formatDate } from '../../../../lib/utils/formatters';

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
  const predictionDate = 'prediction_date' in prediction ? prediction.prediction_date : undefined;

  const classification = prediction.classification ?? '—';
  const getChipColor = (cls: string) => {
    switch (cls.toUpperCase()) {
      case 'AD':
      case 'DEM':
        return 'error' as const;
      case 'MCI':
        return 'warning' as const;
      default:
        return 'success' as const;
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          Predição da IA para o exame selecionado
        </Typography>
        {predictionDate && (
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Data da inferência: {formatDate(predictionDate)}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Classificação:</Typography>
          <Chip
            label={classification}
            size="small"
            color={getChipColor(classification)}
            sx={{ fontWeight: 800 }}
          />
        </Box>
        <Typography variant="body2">
          <strong>Confiança:</strong> {((confidence ?? 0) * 100).toFixed(1)}%
        </Typography>
        <Typography variant="body2">
          <strong>Risco:</strong> {Math.round((riskScore ?? 0) * 100)}%
        </Typography>
        {modelVersion && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            Modelo: {modelVersion}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}