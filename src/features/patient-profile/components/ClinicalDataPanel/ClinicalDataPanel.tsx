import { Box, Card, CardContent, Paper, Typography } from '@mui/material';
import type { ClinicalDataPayload } from '../../../../types';

type ClinicalDataPanelProps = {
  clinicalData: ClinicalDataPayload | null | undefined;
};

export default function ClinicalDataPanel({ clinicalData }: ClinicalDataPanelProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
        <Card variant="outlined"><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}><Typography variant="caption" sx={{ fontWeight: 'bold' }} color="text.secondary">MMSE</Typography><Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>{clinicalData?.mmse ?? 0} / 30</Typography></CardContent></Card>
        <Card variant="outlined"><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}><Typography variant="caption" sx={{ fontWeight: 'bold' }} color="text.secondary">MoCA</Typography><Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>{clinicalData?.moca ?? 0} / 30</Typography></CardContent></Card>
        <Card variant="outlined"><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}><Typography variant="caption" sx={{ fontWeight: 'bold' }} color="text.secondary">CDR</Typography><Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>{clinicalData?.cdr ?? 0} / 3.0</Typography></CardContent></Card>
      </Box>
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Resumo cognitivo</Typography>
        <Typography variant="body2" color="text.secondary">Esta aba mantém a visão geral clínica do paciente e os indicadores históricos disponíveis.</Typography>
      </Paper>
    </Box>
  );
}