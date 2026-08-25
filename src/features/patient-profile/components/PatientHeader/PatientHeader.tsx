import { Box, Button, Chip, Typography, useTheme } from '@mui/material';
import { ArrowBack as ArrowLeftIcon } from '@mui/icons-material';
import type { PatientResponse } from '../../../../types';
import { capitalizeName } from '../../../../lib/utils/formatters';

type PatientHeaderProps = {
  patient: PatientResponse;
  displayRecordId: string;
  onBack: () => void;
};

export default function PatientHeader({ patient, displayRecordId, onBack }: PatientHeaderProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
        pb: 1.5,
        flexWrap: 'wrap',
        gap: 1.5,
      }}
    >
      <Button
        variant="outlined"
        size="small"
        onClick={onBack}
        startIcon={<ArrowLeftIcon />}
        sx={{
          fontWeight: 700,
          textTransform: 'none',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
          color: isDark ? '#cbd5e1' : 'text.primary',
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
          '&:hover': {
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            borderColor: 'primary.main',
          },
        }}
      >
        Voltar à lista da coorte
      </Button>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Chip
          label="SEGURANÇA HIPAA"
          size="small"
          variant="outlined"
          color="primary"
          sx={{ height: 22, fontSize: '10px', fontWeight: 800 }}
        />
        <Chip
          label="ACELERAÇÃO POR GPU ATIVA"
          size="small"
          variant="outlined"
          color="success"
          sx={{ height: 22, fontSize: '10px', fontWeight: 800 }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '13px' }}>
          {capitalizeName(patient.name)}
        </Typography>
        <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : 'text.secondary', fontSize: '11px' }}>
          Registro: {displayRecordId}
        </Typography>
      </Box>
    </Box>
  );
}