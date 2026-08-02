import { Box, Button, Chip, Typography } from '@mui/material';
import { ArrowBack as ArrowLeftIcon } from '@mui/icons-material';
import type { PatientResponse } from '../../../../types';

type PatientHeaderProps = {
  patient: PatientResponse;
  displayMrn: string;
  onBack: () => void;
};

export default function PatientHeader({ patient, displayMrn, onBack }: PatientHeaderProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', pb: 1.5 }}>
      <Button variant="outlined" size="small" onClick={onBack} startIcon={<ArrowLeftIcon />} sx={{ fontWeight: 'bold', textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}>
        Voltar à lista da coorte
      </Button>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Chip label="SEGURANÇA HIPAA" size="small" variant="outlined" color="primary" sx={{ height: 20, fontSize: '9px', fontWeight: 'bold' }} />
        <Chip label="ACELERAÇÃO POR GPU ATIVA" size="small" variant="outlined" color="success" sx={{ height: 20, fontSize: '9px', fontWeight: 'bold' }} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>{patient.name}</Typography>
        <Typography variant="caption" color="text.secondary">Registro: {displayMrn}</Typography>
      </Box>
    </Box>
  );
}