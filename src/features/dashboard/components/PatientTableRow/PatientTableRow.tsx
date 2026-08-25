import { Box, Button, Chip, TableCell, TableRow, Typography, useTheme } from '@mui/material';
import { ArrowForward as ArrowRightIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material';
import type { PatientResponse } from '../../../../types';
import { capitalizeName, formatDate } from '../../../../lib/utils/formatters';

type PatientTableRowProps = {
  patient: PatientResponse;
  displayMrn: string;
  riskLabel: string;
  riskColor: 'error' | 'warning' | 'success' | 'default';
  status: 'Completed' | 'Pending Interpretation';
  statusColor: 'success' | 'primary';
  onSelectPatient: (id: string) => void;
};

export default function PatientTableRow({
  patient,
  displayMrn,
  riskLabel,
  riskColor,
  status,
  statusColor,
  onSelectPatient,
}: PatientTableRowProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const formattedName = capitalizeName(patient.name);
  const formattedSex = patient.sex === 'M' || patient.sex === 'Male' ? 'Masculino' : 'Feminino';
  const formattedDate = formatDate(patient.last_prediction?.prediction_date);

  return (
    <TableRow
      key={patient.id}
      hover
      id={`cohort-row-${patient.id}`}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
        '&:hover': {
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.04) !important' : 'rgba(0, 0, 0, 0.02) !important',
        },
      }}
      onClick={() => onSelectPatient(patient.id)}
    >
      <TableCell sx={{ py: 1.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', fontWeight: 800 }}>
            {patient.id.toUpperCase()}
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main', fontSize: '10px' }}>
            {displayMrn}
          </Typography>
        </Box>
      </TableCell>

      <TableCell sx={{ py: 1.5 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          {formattedName}
        </Typography>
      </TableCell>

      <TableCell sx={{ py: 1.5 }}>
        <Typography variant="body2" sx={{ color: isDark ? '#cbd5e1' : 'text.secondary' }}>
          {patient.age} anos • {formattedSex}
        </Typography>
      </TableCell>

      <TableCell sx={{ py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: isDark ? '#cbd5e1' : 'text.secondary' }}>
          <CalendarIcon sx={{ fontSize: 14, color: 'primary.main' }} />
          <Typography variant="body2">{formattedDate}</Typography>
        </Box>
      </TableCell>

      <TableCell sx={{ py: 1.5 }} align="center">
        <Chip
          label={riskLabel}
          color={riskColor}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 800, fontSize: '11px', height: 22 }}
        />
      </TableCell>

      <TableCell sx={{ py: 1.5 }} align="center">
        <Chip
          label={status === 'Completed' ? 'Concluído' : 'Pendente de IA'}
          color={statusColor}
          size="small"
          sx={{ fontWeight: 800, fontSize: '10px', height: 20 }}
        />
      </TableCell>

      <TableCell sx={{ py: 1.5 }} align="right">
        <Button
          variant="outlined"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onSelectPatient(patient.id);
          }}
          endIcon={<ArrowRightIcon fontSize="inherit" />}
          id={`btn-review-file-${patient.id}`}
          sx={{
            fontSize: '11px',
            py: 0.5,
            px: 1.5,
            fontWeight: 700,
            textTransform: 'none',
            color: isDark ? '#f1f5f9' : 'text.primary',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            '&:hover': {
              bgcolor: 'primary.main',
              color: '#ffffff',
              borderColor: 'primary.main',
            },
          }}
        >
          Ver prontuário
        </Button>
      </TableCell>
    </TableRow>
  );
}