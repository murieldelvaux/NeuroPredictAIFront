import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { TrendingUp as ActivityIcon, ErrorOutlined as AlertIcon, Psychology as BrainIcon, BlurOn as CircuitIcon } from '@mui/icons-material';

type DashboardStatsProps = {
  isLoading: boolean;
  total: number;
  highRisk: number;
  awaitingMRI: number;
  avgRisk: number;
};

export default function DashboardStats({ isLoading, total, highRisk, awaitingMRI, avgRisk }: DashboardStatsProps) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2.5 }}>
      <Card variant="outlined">
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.05em', color: 'text.secondary', textTransform: 'uppercase' }}>Registro clínico</Typography>
            <Box sx={{ p: 0.8, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 1.5, display: 'flex' }}><ActivityIcon fontSize="small" /></Box>
          </Box>
          <Box sx={{ mt: 1.5 }}>
            <Typography variant="h4" sx={{ fontWeight: '900' }}>{isLoading ? <CircularProgress size={20} thickness={5} /> : total}</Typography>
            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'bold', mt: 0.5, display: 'block' }}>Perfis ativos de pacientes</Typography>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.05em', color: 'text.secondary', textTransform: 'uppercase' }}>Prioridade crítica</Typography>
            <Box sx={{ p: 0.8, bgcolor: 'error.main', color: '#ffffff', borderRadius: 1.5, display: 'flex' }}><AlertIcon fontSize="small" /></Box>
          </Box>
          <Box sx={{ mt: 1.5 }}>
            <Typography variant="h4" sx={{ fontWeight: '900', color: 'error.main' }}>{isLoading ? <CircularProgress size={20} /> : highRisk}</Typography>
            <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 'bold', display: 'block' }}>Pacientes com alto risco de atrofia</Typography>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.05em', color: 'text.secondary', textTransform: 'uppercase' }}>Fator médio de prognóstico</Typography>
            <Box sx={{ p: 0.8, bgcolor: 'warning.light', color: 'warning.contrastText', borderRadius: 1.5, display: 'flex' }}><CircuitIcon fontSize="small" /></Box>
          </Box>
          <Box sx={{ mt: 1.5 }}>
            <Typography variant="h4" sx={{ fontWeight: '900' }}>{isLoading ? <CircularProgress size={20} /> : `${avgRisk}%`}</Typography>
            <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">Confiança diagnóstica composta</Typography>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.05em', color: 'text.secondary', textTransform: 'uppercase' }}>Pipeline de imagem</Typography>
            <Box sx={{ p: 0.8, bgcolor: 'info.main', color: '#ffffff', borderRadius: 1.5, display: 'flex' }}><BrainIcon fontSize="small" /></Box>
          </Box>
          <Box sx={{ mt: 1.5 }}>
            <Typography variant="h4" sx={{ fontWeight: '900' }}>{isLoading ? <CircularProgress size={20} /> : awaitingMRI}</Typography>
            <Typography variant="caption" sx={{ color: 'info.main', fontWeight: 'bold', display: 'block' }}>Aguardando envio de ressonância 3T padrão</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}