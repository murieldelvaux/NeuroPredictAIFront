import { Box, Paper, Typography } from '@mui/material';
import type { FeatureImportanceResponse } from '../../../../types';

type FeatureImportanceChartProps = {
  explanation: FeatureImportanceResponse[] | null | undefined;
};

export default function FeatureImportanceChart({ explanation }: FeatureImportanceChartProps) {
  if (!explanation || explanation.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">Nenhuma explicação disponível para esta predição.</Typography>
      </Paper>
    );
  }

  const maxImpact = Math.max(...explanation.map((item) => Math.abs(item.impact)), 1);

  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>Importância das variáveis</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {explanation.map((item) => (
          <Box key={item.feature}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{item.feature}</Typography>
              <Typography variant="caption" color={item.direction === 'risk' ? 'error.main' : 'success.main'}>
                {item.direction} • {item.impact.toFixed(3)}
              </Typography>
            </Box>
            <Box sx={{ mt: 0.75, height: 8, borderRadius: 999, bgcolor: 'action.hover', overflow: 'hidden' }}>
              <Box sx={{ width: `${(Math.abs(item.impact) / maxImpact) * 100}%`, height: '100%', bgcolor: item.direction === 'risk' ? 'error.main' : 'success.main' }} />
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}