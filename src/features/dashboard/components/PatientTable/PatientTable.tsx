import { Box, ButtonGroup, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, InputAdornment, Paper, CircularProgress } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import type { PatientResponse } from '../../../../types';
import PatientTableRow from '../PatientTableRow/PatientTableRow';
import EmptyPatientState from '../EmptyPatientState/EmptyPatientState';

type PatientTableRowData = {
  patient: PatientResponse;
  displayMrn: string;
  riskLabel: string;
  riskColor: 'error' | 'warning' | 'success' | 'default';
  status: 'Completed' | 'Pending Interpretation';
  statusColor: 'success' | 'primary';
};

type PatientTableProps = {
  isLoading: boolean;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  riskFilter: 'ALL' | 'High' | 'Moderate' | 'Low';
  onRiskFilterChange: (value: 'ALL' | 'High' | 'Moderate' | 'Low') => void;
  statusFilter: 'ALL' | 'Completed' | 'Pending Interpretation';
  onStatusFilterChange: (value: 'ALL' | 'Completed' | 'Pending Interpretation') => void;
  rows: PatientTableRowData[];
  onSelectPatient: (id: string) => void;
};

export default function PatientTable({
  isLoading,
  searchTerm,
  onSearchTermChange,
  riskFilter,
  onRiskFilterChange,
  statusFilter,
  onStatusFilterChange,
  rows,
  onSelectPatient,
}: PatientTableProps) {
  return (
    <Paper variant="outlined" id="dashboard-queue-container" sx={{ overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', xl: 'row' }, gap: 2, justifyContent: 'space-between', bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          id="patients-search-input"
          variant="outlined"
          size="small"
          placeholder="Buscar por nome ou referência..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          sx={{ maxWidth: 450, width: '100%', bgcolor: 'background.paper' }}
          slotProps={{ input: { startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>), style: { fontSize: '12px' } } }}
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
          <ButtonGroup size="small" variant="outlined" color="inherit" sx={{ bgcolor: 'background.paper' }}>
            {(['ALL', 'High', 'Moderate', 'Low'] as const).map((value) => (
              <Button
                key={value}
                onClick={() => onRiskFilterChange(value)}
                sx={{ fontSize: '10px', fontWeight: 'bold', bgcolor: riskFilter === value ? (value === 'High' ? 'error.main' : value === 'Moderate' ? 'warning.main' : value === 'Low' ? 'success.main' : 'action.active') : 'transparent', color: riskFilter === value ? '#ffffff' : 'text.primary' }}
              >
                {value === 'ALL' ? 'Todos os riscos' : `${value === 'High' ? 'Alto' : value === 'Moderate' ? 'Moderado' : 'Baixo'} risco`}
              </Button>
            ))}
          </ButtonGroup>
          <ButtonGroup size="small" variant="outlined" color="inherit" sx={{ bgcolor: 'background.paper' }}>
            <Button onClick={() => onStatusFilterChange('ALL')} sx={{ fontSize: '10px', fontWeight: 'bold', bgcolor: statusFilter === 'ALL' ? 'action.active' : 'transparent', color: statusFilter === 'ALL' ? 'background.paper' : 'text.primary' }}>Todos os status</Button>
            <Button onClick={() => onStatusFilterChange('Pending Interpretation')} sx={{ fontSize: '10px', fontWeight: 'bold', bgcolor: statusFilter === 'Pending Interpretation' ? 'primary.main' : 'transparent', color: statusFilter === 'Pending Interpretation' ? '#ffffff' : 'text.primary' }}>Pendente de IA</Button>
            <Button onClick={() => onStatusFilterChange('Completed')} sx={{ fontSize: '10px', fontWeight: 'bold', bgcolor: statusFilter === 'Completed' ? 'success.main' : 'transparent', color: statusFilter === 'Completed' ? '#ffffff' : 'text.primary' }}>Concluído</Button>
          </ButtonGroup>
        </Box>
      </Box>

      <TableContainer id="queue-table-frame">
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', py: 8, alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <CircularProgress size={32} />
            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>Sincronizando com os bancos centrais...</Typography>
          </Box>
        ) : rows.length === 0 ? (
          <EmptyPatientState />
        ) : (
          <Table size="small" id="queue-patients-table">
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.paper' }}>
                {['ID e MRN', 'Nome do paciente', 'Idade / sexo', 'Última avaliação', 'Fator de risco prognóstico', 'Status do serviço', 'Operação'].map((heading, index) => (
                  <TableCell key={heading} sx={{ py: 1.5 }} align={index >= 4 ? (index === 6 ? 'right' : 'center') : 'left'}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{heading}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <PatientTableRow key={row.patient.id} {...row} onSelectPatient={onSelectPatient} />
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Paper>
  );
}