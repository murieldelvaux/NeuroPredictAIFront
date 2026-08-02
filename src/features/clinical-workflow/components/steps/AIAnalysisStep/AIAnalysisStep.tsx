import { Box, CircularProgress, LinearProgress, Paper, Typography } from '@mui/material';
import { Memory as ProcessorIcon, Terminal as TerminalIcon } from '@mui/icons-material';

type AIAnalysisStepProps = {
  simulationRunning: boolean;
  simulationPercentage: number;
  terminalLogs: string[];
};

export default function AIAnalysisStep({ simulationRunning, simulationPercentage, terminalLogs }: AIAnalysisStepProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="workflow-step-five">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
        <ProcessorIcon sx={{ color: 'primary.main' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Etapa 5: Gatilho do pipeline de IA explicável</Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
        {simulationRunning ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, maxWidth: 360, mx: 'auto' }}>
            <CircularProgress color="primary" />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Processando camadas de voxels e pesos clínicos...</Typography>
            <Box sx={{ width: '100%' }}>
              <LinearProgress variant="determinate" value={simulationPercentage} sx={{ height: 6, borderRadius: 2 }} />
              <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block', mt: 1, fontWeight: 'bold' }}>{simulationPercentage}% compilado</Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: '50%', display: 'flex' }}><ProcessorIcon fontSize="large" /></Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'extrabold' }}>Solicitar alinhamento prognóstico para Alzheimer</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
              Ao confirmar esta etapa, o arquivo multimodal e os dados clínicos são enviados para a execução do pipeline explicável.
            </Typography>
          </Box>
        )}

        {terminalLogs.length > 0 && (
          <Paper variant="elevation" elevation={3} sx={{ mt: 4, bgcolor: '#020617', color: '#94a3b8', p: 2.5, borderRadius: 2, textAlign: 'left', border: '1.5px solid #1e293b' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #1e293b', pb: 1, mb: 1, color: '#38bdf8' }}>
              <TerminalIcon fontSize="small" />
              <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>PYTORCH INTERMEDIARY TERMINAL</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {terminalLogs.map((log, index) => (
                <Typography key={log + index} variant="caption" sx={{ fontFamily: 'sans-serif', fontSize: '10px', color: '#cbd5e1' }}>{log}</Typography>
              ))}
            </Box>
          </Paper>
        )}
      </Paper>
    </Box>
  );
}