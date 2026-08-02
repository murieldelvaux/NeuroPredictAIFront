import { Box, Paper, Typography } from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';

type WorkflowReviewStepProps = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  sex: string;
  mrn: string;
  mmseScore: number;
  mocaScore: number;
  cdrScore: number;
};

export default function WorkflowReviewStep({
  firstName,
  lastName,
  dateOfBirth,
  age,
  sex,
  mrn,
  mmseScore,
  mocaScore,
  cdrScore,
}: WorkflowReviewStepProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="workflow-step-six">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
        <CheckIcon sx={{ color: 'success.main' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Etapa 6: Confirmar resultados e registrar dados demográficos</Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 4, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1.1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'text.secondary' }}>DADOS DEMOGRÁFICOS DO PACIENTE</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: '900', mt: 1 }}>{firstName} {lastName}</Typography>
            <Typography variant="body2" color="text.secondary">Nascido em {dateOfBirth} ({age} anos) • {sex}</Typography>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main', fontWeight: 'bold', display: 'block', mt: 0.5 }}>{mrn}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'text.secondary' }}>ÍNDICE COGNITIVO</Typography>
            <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
              <Box><Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>MMSE:</Typography><Typography variant="body2" sx={{ fontWeight: 'bold' }}>{mmseScore} / 30</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>MoCA:</Typography><Typography variant="body2" sx={{ fontWeight: 'bold' }}>{mocaScore} / 30</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>CDR Index:</Typography><Typography variant="body2" sx={{ fontWeight: 'bold' }}>{cdrScore} / 3.0</Typography></Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3, mt: 3 }}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 1.5 }}>VISÃO RESUMIDA DO RELATÓRIO CLÍNICO SIMULADO</Typography>
          <Paper variant="outlined" sx={{ p: 2, borderColor: 'success.light', bgcolor: 'rgba(16, 185, 129, 0.05)' }}>
            <Typography variant="body2" sx={{ fontWeight: '950', color: 'success.main' }}>Execução do pipeline concluída</Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, lineHeight: 1.4, color: 'text.primary' }}>
              Este perfil foi compilado corretamente seguindo todos os critérios do departamento. Clique em Salvar para registrar nos bancos centrais.
            </Typography>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
}