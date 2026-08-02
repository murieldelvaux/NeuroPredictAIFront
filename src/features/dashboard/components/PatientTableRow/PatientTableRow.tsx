import { Box, Button, Chip, TableCell, TableRow, Typography } from '@mui/material';
import { ArrowForward as ArrowRightIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material';
import type { PatientResponse } from '../../../../types';

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
  return (
    <TableRow key={patient.id} hover id={`cohort-row-${patient.id}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell sx={{ py: 1.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontWeight: 'bold' }}>{patient.id.toUpperCase()}</Typography>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main', fontSize: '9px' }}>{displayMrn}</Typography>
        </Box>
      </TableCell>
      <TableCell sx={{ py: 1.5 }}>
        <Typography variant="body2" onClick={() => onSelectPatient(patient.id)} sx={{ fontWeight: 'bold', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{patient.name}</Typography>
      </TableCell>
      <TableCell sx={{ py: 1.5 }}><Typography variant="body2" color="text.secondary">{patient.age} anos • {patient.sex}</Typography></TableCell>
      <TableCell sx={{ py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
          <CalendarIcon sx={{ fontSize: 13 }} />
          <Typography variant="body2">{patient.last_prediction?.prediction_date ?? '—'}</Typography>
        </Box>
      </TableCell>
      <TableCell sx={{ py: 1.5 }} align="center"><Chip label={riskLabel} color={riskColor} size="small" variant="outlined" sx={{ fontWeight: 'bold', fontSize: '10px', height: 20 }} /></TableCell>
      <TableCell sx={{ py: 1.5 }} align="center"><Chip label={status} color={statusColor} size="small" sx={{ fontWeight: 'bold', fontSize: '9px', height: 18 }} /></TableCell>
      <TableCell sx={{ py: 1.5 }} align="right">
        <Button variant="outlined" size="small" onClick={() => onSelectPatient(patient.id)} endIcon={<ArrowRightIcon fontSize="inherit" />} id={`btn-review-file-${patient.id}`} sx={{ fontSize: '10px', py: 0.25, px: 1, fontWeight: 'bold', color: 'text.secondary', borderColor: 'divider', '&:hover': { bgcolor: 'primary.main', color: '#ffffff', borderColor: 'primary.main' } }}>Ver prontuário</Button>
      </TableCell>
    </TableRow>
  );
}