/**
 * NeuroPredict AI - Clinical Doctor Dashboard styled with Material-UI
 */
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Chip,
  ButtonGroup,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as UserIcon,
  TrendingUp as ActivityIcon,
  ErrorOutlined as AlertIcon,
  Psychology as BrainIcon,
  BlurOn as CircuitIcon,
  CalendarMonth as CalendarIcon,
  ArrowForward as ArrowRightIcon
} from '@mui/icons-material';
import { DoctorDashboardProps } from '../../types';
import { useDoctorDashboard } from '../../hooks/useDoctorDashboard';

export default function DoctorDashboard({
  patients,
  isLoading,
  onSelectPatient,
  onStartWorkflow
}: DoctorDashboardProps) {
  const theme = useTheme();

  const {
    searchTerm,
    setSearchTerm,
    riskFilter,
    setRiskFilter,
    statusFilter,
    setStatusFilter,
    filteredPatients,
    total,
    highRisk,
    awaitingMRI,
    avgRisk
  } = useDoctorDashboard(patients);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="doctor-dashboard-root">
      {/* Header section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2,
          gap: 2
        }}
        id="dashboard-header-block"
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: '-0.025em' }} color="text.primary" id="dashboard-main-heading">
            Fila de diagnóstico clínico
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary" id="dashboard-sub-heading">
            Previsão prognóstica da doença de Alzheimer e indicadores clínicos explicáveis.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={onStartWorkflow}
          startIcon={<UserIcon />}
          id="btn-trigger-new-evaluation"
          sx={{ fontWeight: 'bold' }}
        >
          Novo fluxo de aquisição
        </Button>
      </Box>

      {/* Metric Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2.5 }} id="dashboard-metric-grid">
        <Box id="card-metric-total">
          <Card style={{ height: "100%"  }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.05em', color: 'text.secondary', textTransform: 'uppercase' }}>Registro clínico</Typography>
                <Box sx={{ p: 0.8, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 1.5, display: 'flex' }}><ActivityIcon fontSize="small" /></Box>
              </Box>
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="h4" sx={{ fontWeight: '900' }}>{isLoading ? <CircularProgress size={20} thickness={5} /> : total}</Typography>
                <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'bold', mt: 0.5, display: 'block' }}>Perfis ativos de pacientes</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box id="card-metric-critical">
          <Card style={{ height: "100%"  }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.05em', color: 'text.secondary', textTransform: 'uppercase' }}>Prioridade crítica</Typography>
                <Box sx={{ p: 0.8, bgcolor: 'error.main', color: '#ffffff', borderRadius: 1.5, display: 'flex' }}><AlertIcon fontSize="small" /></Box>
              </Box>
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="h4" sx={{ fontWeight: '900', color: 'error.main' }}>{isLoading ? <CircularProgress size={20} /> : highRisk}</Typography>
                <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 'bold', display: 'block' }}>Pacientes com alto risco de atrofia</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box id="card-metric-average">
          <Card style={{ height: "100%"  }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.05em', color: 'text.secondary', textTransform: 'uppercase' }}>Fator médio de prognóstico</Typography>
                <Box sx={{ p: 0.8, bgcolor: 'warning.light', color: 'warning.contrastText', borderRadius: 1.5, display: 'flex' }}><CircuitIcon fontSize="small" /></Box>
              </Box>
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="h4" sx={{ fontWeight: '900' }}>{isLoading ? <CircularProgress size={20} /> : `${avgRisk}%`}</Typography>
                <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">Confiança diagnóstica composta</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box id="card-metric-imaging">
          <Card style={{ height: "100%"  }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.05em', color: 'text.secondary', textTransform: 'uppercase' }}>Pipeline de imagem</Typography>
                <Box sx={{ p: 0.8, bgcolor: 'info.main', color: '#ffffff', borderRadius: 1.5, display: 'flex' }}><BrainIcon fontSize="small" /></Box>
              </Box>
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="h4" sx={{ fontWeight: '900' }}>{isLoading ? <CircularProgress size={20} /> : awaitingMRI}</Typography>
                <Typography variant="caption" sx={{ color: 'info.main', fontWeight: 'bold', display: 'block' }}>Aguardando envio de ressonância 3T padrão</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Queue table */}
      <Paper variant="outlined" id="dashboard-queue-container" sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: { xs: 'column', xl: 'row' },
            gap: 2,
            justifyContent: 'space-between',
            bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.02)',
            borderBottom: 1,
            borderColor: 'divider'
          }}
          id="queue-filter-bar"
        >
          <TextField
            id="patients-search-input"
            variant="outlined"
            size="small"
            placeholder="Buscar por nome, MRN ou referência..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ maxWidth: 450, width: '100%', bgcolor: 'background.paper' }}
            slotProps={{
              input: {
                startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>),
                style: { fontSize: '12px' }
              }
            }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }} id="filters-container">
            <ButtonGroup size="small" variant="outlined" color="inherit" id="filter-wrapper-risk" sx={{ bgcolor: 'background.paper' }}>
              {(['ALL', 'High', 'Moderate', 'Low'] as const).map(v => (
                <Button
                  key={v}
                  onClick={() => setRiskFilter(v)}
                  sx={{
                    fontSize: '10px', fontWeight: 'bold',
                    bgcolor: riskFilter === v ? (v === 'High' ? 'error.main' : v === 'Moderate' ? 'warning.main' : v === 'Low' ? 'success.main' : 'action.active') : 'transparent',
                    color: riskFilter === v ? '#ffffff' : 'text.primary'
                  }}
                >
                  {v === 'ALL' ? 'Todos os riscos' : `${v === 'High' ? 'Alto' : v === 'Moderate' ? 'Moderado' : 'Baixo'} risco`}
                </Button>
              ))}
            </ButtonGroup>
            <ButtonGroup size="small" variant="outlined" color="inherit" id="filter-wrapper-status" sx={{ bgcolor: 'background.paper' }}>
              <Button onClick={() => setStatusFilter('ALL')} sx={{ fontSize: '10px', fontWeight: 'bold', bgcolor: statusFilter === 'ALL' ? 'action.active' : 'transparent', color: statusFilter === 'ALL' ? 'background.paper' : 'text.primary' }}>Todos os status</Button>
              <Button onClick={() => setStatusFilter('Pending Interpretation')} sx={{ fontSize: '10px', fontWeight: 'bold', bgcolor: statusFilter === 'Pending Interpretation' ? 'primary.main' : 'transparent', color: statusFilter === 'Pending Interpretation' ? '#ffffff' : 'text.primary' }}>Pendente de IA</Button>
              <Button onClick={() => setStatusFilter('Completed')} sx={{ fontSize: '10px', fontWeight: 'bold', bgcolor: statusFilter === 'Completed' ? 'success.main' : 'transparent', color: statusFilter === 'Completed' ? '#ffffff' : 'text.primary' }}>Concluído</Button>
            </ButtonGroup>
          </Box>
        </Box>

        <TableContainer id="queue-table-frame">
          {isLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', py: 8, alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <CircularProgress size={32} />
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>Sincronizando com os bancos centrais...</Typography>
            </Box>
          ) : filteredPatients.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Nenhum arquivo clínico corresponde à pesquisa atual.</Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }} color="text.secondary">Ajuste os filtros ou inicie um novo fluxo diagnóstico.</Typography>
            </Box>
          ) : (
            <Table size="small" id="queue-patients-table">
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.01)' }}>
                  {['ID e MRN', 'Nome do paciente', 'Idade / sexo', 'Última avaliação', 'Fator de risco prognóstico', 'Status do serviço', 'Operação'].map((h, i) => (
                    <TableCell key={h} sx={{ py: 1.5 }} align={i >= 4 ? (i === 6 ? 'right' : 'center') : 'left'}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{h}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map(p => {
                  const classification = (p.last_prediction?.classification ?? '').toLowerCase();
                  const riskScore = Math.round((p.last_prediction?.risk_score ?? 0) * 100);
                  const normalizedCategory = classification === 'ad'
                    ? 'High'
                    : classification === 'mci'
                      ? 'Moderate'
                      : classification === 'cn'
                        ? 'Low'
                        : riskScore >= 60
                          ? 'High'
                          : riskScore >= 30
                            ? 'Moderate'
                            : 'Unknown';
                  const riskConfig = ({ High: { color: 'error' as const, label: `High (${riskScore}%)` }, Moderate: { color: 'warning' as const, label: `Moderate (${riskScore}%)` }, Low: { color: 'success' as const, label: `Low (${riskScore}%)` }, Unknown: { color: 'default' as const, label: `Unknown (${riskScore}%)` } } as Record<string, { color: 'error' | 'warning' | 'success' | 'default'; label: string }>)[normalizedCategory];
                  const status = p.last_prediction ? 'Completed' : 'Pending Interpretation';
                  const statusColor = ({ Completed: 'success' as const, 'Pending Interpretation': 'primary' as const } as Record<string, 'success' | 'primary'>)[status];
                  return (
                    <TableRow key={p.id} hover id={`cohort-row-${p.id}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontWeight: 'bold' }}>{p.id.toUpperCase()}</Typography>
                          {/* TODO: campo não existe no backend; mantido para preservar a UI legada. */}
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main', fontSize: '9px' }}>{(p as any).mrn ?? '—'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography variant="body2" onClick={() => onSelectPatient(p.id)} sx={{ fontWeight: 'bold', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{p.name}</Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}><Typography variant="body2" color="text.secondary">{p.age} anos • {p.sex}</Typography></TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                          <CalendarIcon sx={{ fontSize: 13 }} />
                          <Typography variant="body2">{p.last_prediction?.prediction_date ?? '—'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }} align="center"><Chip label={riskConfig.label} color={riskConfig.color} size="small" variant="outlined" sx={{ fontWeight: 'bold', fontSize: '10px', height: 20 }} /></TableCell>
                      <TableCell sx={{ py: 1.5 }} align="center"><Chip label={status} color={statusColor} size="small" sx={{ fontWeight: 'bold', fontSize: '9px', height: 18 }} /></TableCell>
                      <TableCell sx={{ py: 1.5 }} align="right">
                        <Button variant="outlined" size="small" onClick={() => onSelectPatient(p.id)} endIcon={<ArrowRightIcon fontSize="inherit" />} id={`btn-review-file-${p.id}`} sx={{ fontSize: '10px', py: 0.25, px: 1, fontWeight: 'bold', color: 'text.secondary', borderColor: 'divider', '&:hover': { bgcolor: 'primary.main', color: '#ffffff', borderColor: 'primary.main' } }}>Ver prontuário</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>
    </Box>
  );
}
