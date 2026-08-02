import { Box, Card, CardContent, Chip, TextField, Typography } from '@mui/material';

type ClinicalDataStepProps = {
  educationYears: number;
  mmseScore: number;
  mocaScore: number;
  cdrScore: number;
  cdrtotScore: number;
  onEducationYearsChange: (value: number) => void;
  onMmseChange: (value: number) => void;
  onMocaChange: (value: number) => void;
  onCdrChange: (value: number) => void;
  onCdrtotChange: (value: number) => void;
};

export default function ClinicalDataStep({
  educationYears,
  mmseScore,
  mocaScore,
  cdrScore,
  cdrtotScore,
  onEducationYearsChange,
  onMmseChange,
  onMocaChange,
  onCdrChange,
  onCdrtotChange,
}: ClinicalDataStepProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="workflow-step-two">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3.5 }}>
        <Card variant="outlined"><CardContent sx={{ p: 2.5 }}><Typography variant="caption" sx={{ fontWeight: 'bold' }}>PONTUAÇÃO MMSE</Typography><Chip label="Escala: 0-30" size="small" sx={{ height: 18, fontSize: '9px', fontWeight: 'bold', ml: 1 }} /><TextField type="number" fullWidth size="small" sx={{ mt: 2 }} value={mmseScore} onChange={(e) => onMmseChange(Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))} slotProps={{ htmlInput: { min: 0, max: 30 } }} /></CardContent></Card>
        <Card variant="outlined"><CardContent sx={{ p: 2.5 }}><Typography variant="caption" sx={{ fontWeight: 'bold' }}>PONTUAÇÃO MOCA</Typography><Chip label="Escala: 0-30" size="small" sx={{ height: 18, fontSize: '9px', fontWeight: 'bold', ml: 1 }} /><TextField type="number" fullWidth size="small" sx={{ mt: 2 }} value={mocaScore} onChange={(e) => onMocaChange(Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))} slotProps={{ htmlInput: { min: 0, max: 30 } }} /></CardContent></Card>
        <Card variant="outlined"><CardContent sx={{ p: 2.5 }}><Typography variant="caption" sx={{ fontWeight: 'bold' }}>ÍNDICE CDR</Typography><Chip label="Escala: 0-3" size="small" sx={{ height: 18, fontSize: '9px', fontWeight: 'bold', ml: 1 }} /><TextField type="number" fullWidth size="small" sx={{ mt: 2 }} value={cdrScore} onChange={(e) => onCdrChange(Math.min(3, Math.max(0, parseFloat(e.target.value) || 0)))} slotProps={{ htmlInput: { min: 0, max: 3, step: 0.5 } }} /></CardContent></Card>
        <Card variant="outlined"><CardContent sx={{ p: 2.5 }}><Typography variant="caption" sx={{ fontWeight: 'bold' }}>CDR TOT</Typography><Chip label="Escala: 0-3" size="small" sx={{ height: 18, fontSize: '9px', fontWeight: 'bold', ml: 1 }} /><TextField type="number" fullWidth size="small" sx={{ mt: 2 }} value={cdrtotScore} onChange={(e) => onCdrtotChange(Math.min(3, Math.max(0, parseFloat(e.target.value) || 0)))} slotProps={{ htmlInput: { min: 0, max: 3, step: 0.5 } }} /></CardContent></Card>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Anos de estudo</Typography>
      </Box>
      <TextField label="ANOS DE ESTUDO" type="number" fullWidth size="small" value={educationYears} onChange={(e) => onEducationYearsChange(Math.max(0, parseInt(e.target.value) || 0))} slotProps={{ inputLabel: { shrink: true } }} />
    </Box>
  );
}