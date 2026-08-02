import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import PatientProfile from '../components/PatientProfile/PatientProfile';
import { useGetPatient } from '../react-queries/useGetPatient';

export default function PatientProfilePage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { data: activeDetail, isLoading } = useGetPatient(patientId ?? '');

  if (!patientId) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Nenhum paciente selecionado.</Typography>
        <Button onClick={() => navigate('/dashboard')}>Voltar ao painel</Button>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
        <CircularProgress color="primary" />
        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontWeight: 'bold' }}>
          Recalculando gradientes de importância das variáveis...
        </Typography>
      </Box>
    );
  }

  if (!activeDetail) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Dados do paciente não encontrados.</Typography>
        <Button onClick={() => navigate('/dashboard')}>Voltar ao painel</Button>
      </Box>
    );
  }

  return <PatientProfile patientRecord={activeDetail} onBack={() => navigate('/dashboard')} />;
}