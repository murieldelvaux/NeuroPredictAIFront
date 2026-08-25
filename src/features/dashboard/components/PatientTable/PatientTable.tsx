import {
  Box,
  ButtonGroup,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  Paper,
  CircularProgress,
  useTheme,
} from '@mui/material';
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
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Paper variant="outlined" id="dashboard-queue-container" sx={{ overflow: 'hidden', borderRadius: 3 }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: { xs: 'column', xl: 'row' },
          gap: 2,
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', xl: 'center' },
          bgcolor: isDark ? '#111a2e' : '#ffffff',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <TextField
          id="patients-search-input"
          variant="outlined"
          size="small"
          placeholder="Buscar por nome ou referência..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          sx={{
            maxWidth: { xs: '100%', xl: 420 },
            width: '100%',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: isDark ? '#94a3b8' : 'text.secondary' }} />
                </InputAdornment>
              ),
              style: { fontSize: '13px' },
            },
          }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
          {/* Risk Filters */}
          <ButtonGroup
            size="small"
            variant="outlined"
            sx={{
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
              borderColor: 'divider',
            }}
          >
            {(['ALL', 'High', 'Moderate', 'Low'] as const).map((value) => {
              const isActive = riskFilter === value;
              let activeBg = 'primary.main';
              if (value === 'High') activeBg = 'error.main';
              if (value === 'Moderate') activeBg = 'warning.main';
              if (value === 'Low') activeBg = 'success.main';

              return (
                <Button
                  key={value}
                  onClick={() => onRiskFilterChange(value)}
                  sx={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'none',
                    bgcolor: isActive ? activeBg : 'transparent',
                    color: isActive ? '#ffffff' : isDark ? '#cbd5e1' : 'text.primary',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                    '&:hover': {
                      bgcolor: isActive ? activeBg : isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                    },
                  }}
                >
                  {value === 'ALL' ? 'Todos os riscos' : `${value === 'High' ? 'Alto' : value === 'Moderate' ? 'Moderado' : 'Baixo'} risco`}
                </Button>
              );
            })}
          </ButtonGroup>

          {/* Status Filters */}
          <ButtonGroup
            size="small"
            variant="outlined"
            sx={{
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
              borderColor: 'divider',
            }}
          >
            <Button
              onClick={() => onStatusFilterChange('ALL')}
              sx={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: statusFilter === 'ALL' ? 'primary.main' : 'transparent',
                color: statusFilter === 'ALL' ? '#ffffff' : isDark ? '#cbd5e1' : 'text.primary',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                '&:hover': {
                  bgcolor: statusFilter === 'ALL' ? 'primary.main' : isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              Todos os status
            </Button>
            <Button
              onClick={() => onStatusFilterChange('Pending Interpretation')}
              sx={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: statusFilter === 'Pending Interpretation' ? 'primary.main' : 'transparent',
                color: statusFilter === 'Pending Interpretation' ? '#ffffff' : isDark ? '#cbd5e1' : 'text.primary',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                '&:hover': {
                  bgcolor: statusFilter === 'Pending Interpretation' ? 'primary.main' : isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              Pendente de IA
            </Button>
            <Button
              onClick={() => onStatusFilterChange('Completed')}
              sx={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: statusFilter === 'Completed' ? 'success.main' : 'transparent',
                color: statusFilter === 'Completed' ? '#ffffff' : isDark ? '#cbd5e1' : 'text.primary',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                '&:hover': {
                  bgcolor: statusFilter === 'Completed' ? 'success.main' : isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              Concluído
            </Button>
          </ButtonGroup>
        </Box>
      </Box>

      <TableContainer id="queue-table-frame">
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', py: 8, alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <CircularProgress size={32} />
            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
              Sincronizando com os bancos centrais...
            </Typography>
          </Box>
        ) : rows.length === 0 ? (
          <EmptyPatientState />
        ) : (
          <Table size="small" id="queue-patients-table">
            <TableHead>
              <TableRow sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                {['ID e MRN', 'Nome do paciente', 'Idade / sexo', 'Última avaliação', 'Fator de risco prognóstico', 'Status do serviço', 'Operação'].map((heading, index) => (
                  <TableCell key={heading} sx={{ py: 1.5 }} align={index >= 4 ? (index === 6 ? 'right' : 'center') : 'left'}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                      {heading}
                    </Typography>
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