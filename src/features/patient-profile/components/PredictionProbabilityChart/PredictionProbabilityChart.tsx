import { Box, Paper, Typography, useTheme } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { PredictionResponse } from '../../../../types';

type PredictionProbabilityChartProps = {
  prediction: PredictionResponse | null;
};

const getBarColor = (label: string) => {
  switch (label.toUpperCase()) {
    case 'AD':
      return '#ef4444';
    case 'MCI':
      return '#f59e0b';
    default:
      return '#10b981';
  }
};

export default function PredictionProbabilityChart({ prediction }: PredictionProbabilityChartProps) {
  const theme = useTheme();

  if (!prediction || !prediction.probabilities || Object.keys(prediction.probabilities).length === 0) {
    return null;
  }

  const data = Object.entries(prediction.probabilities)
    .map(([label, value]) => ({ label, value: Number((value * 100).toFixed(1)) }))
    .sort((a, b) => b.value - a.value);

  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Distribuição de probabilidade</Typography>
          <Typography variant="body2" color="text.secondary">
            Visualização da confiança do modelo por classe diagnóstica para a inferência mais recente.
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main' }}>{Math.round(prediction.risk_score * 100)}%</Typography>
      </Box>

      <Box sx={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap={18}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} width={44} />
            <Tooltip formatter={(value: number) => `${value}%`} cursor={{ fill: 'rgba(15,23,42,0.04)' }} />
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.label} fill={getBarColor(entry.label)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}