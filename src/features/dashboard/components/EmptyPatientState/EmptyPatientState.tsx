import { Box, Typography } from '@mui/material';

export default function EmptyPatientState() {
  return (
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Nenhum arquivo clínico corresponde à pesquisa atual.</Typography>
      <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }} color="text.secondary">Ajuste os filtros ou inicie um novo fluxo diagnóstico.</Typography>
    </Box>
  );
}