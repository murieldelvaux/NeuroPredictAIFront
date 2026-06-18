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
            Clinical Diagnostic Queue
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary" id="dashboard-sub-heading">
            Alzheimer's disease prognostic forecasting & explainable clinical indicators.
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
          New Acquisition Workflow
        </Button>
      </Box>

      {/* Metric Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2.5 }} id="dashboard-metric-grid">
        <Box id="card-metric-total">
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.05em', color: 'text.secondary', textTransform: 'uppercase' }}>Clinical Registry</Typography>
                <Box sx={{ p: 0.8, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 1.5, display: 'flex' }}><ActivityIcon fontSize="small" /></Box>
              </Box>
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="h4" sx={{ fontWeight: '900' }}>{isLoading ? <CircularProgress size={20} thickness={5} /> : total}</Typography>
                <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'bold', mt: 0.5, display: 'block' }}>Active Patient Profiles</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box id="card-metric-critical">
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.05em', color: 'text.secondary', textTransform: 'uppercase' }}>Critical Priority</Typography>
                <Box sx={{ p: 0.8, bgcolor: 'error.main', color: '#ffffff', borderRadius: 1.5, display: 'flex' }}><AlertIcon fontSize="small" /></Box>
              </Box>
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="h4" sx={{ fontWeight: '900', color: 'error.main' }}>{isLoading ? <CircularProgress size={20} /> : highRisk}</Typography>
                <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 'bold', display: 'block' }}>Patients with High Atrophy Risk</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box id="card-metric-average">
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.05em', color: 'text.secondary', textTransform: 'uppercase' }}>Avg Prognosis Factor</Typography>
                <Box sx={{ p: 0.8, bgcolor: 'warning.light', color: 'warning.contrastText', borderRadius: 1.5, display: 'flex' }}><CircuitIcon fontSize="small" /></Box>
              </Box>
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="h4" sx={{ fontWeight: '900' }}>{isLoading ? <CircularProgress size={20} /> : `${avgRisk}%`}</Typography>
                <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">Composite diagnostic confidence</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box id="card-metric-imaging">
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.05em', color: 'text.secondary', textTransform: 'uppercase' }}>Imaging Pipeline</Typography>
                <Box sx={{ p: 0.8, bgcolor: 'info.main', color: '#ffffff', borderRadius: 1.5, display: 'flex' }}><BrainIcon fontSize="small" /></Box>
              </Box>
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="h4" sx={{ fontWeight: '900' }}>{isLoading ? <CircularProgress size={20} /> : awaitingMRI}</Typography>
                <Typography variant="caption" sx={{ color: 'info.main', fontWeight: 'bold', display: 'block' }}>Awaiting standard 3T MRI upload</Typography>
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
            placeholder="Search by Patient name, MRN, or Ref..."
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
                  {v === 'ALL' ? 'All Risks' : `${v} Risk`}
                </Button>
              ))}
            </ButtonGroup>
            <ButtonGroup size="small" variant="outlined" color="inherit" id="filter-wrapper-status" sx={{ bgcolor: 'background.paper' }}>
              <Button onClick={() => setStatusFilter('ALL')} sx={{ fontSize: '10px', fontWeight: 'bold', bgcolor: statusFilter === 'ALL' ? 'action.active' : 'transparent', color: statusFilter === 'ALL' ? 'background.paper' : 'text.primary' }}>All Statuses</Button>
              <Button onClick={() => setStatusFilter('Pending Interpretation')} sx={{ fontSize: '10px', fontWeight: 'bold', bgcolor: statusFilter === 'Pending Interpretation' ? 'primary.main' : 'transparent', color: statusFilter === 'Pending Interpretation' ? '#ffffff' : 'text.primary' }}>Pending AI</Button>
            </ButtonGroup>
          </Box>
        </Box>

        <TableContainer id="queue-table-frame">
          {isLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', py: 8, alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <CircularProgress size={32} />
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>Syncing securely with central databases...</Typography>
            </Box>
          ) : filteredPatients.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>No clinical files match the active filtration query.</Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }} color="text.secondary">Adjust search parameters or initiate a new diagnostic flow.</Typography>
            </Box>
          ) : (
            <Table size="small" id="queue-patients-table">
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.01)' }}>
                  {['ID & MRN', 'Patient Name', 'Age / Sex', 'Last Evaluation', 'Prognosis Risk Factor', 'Service Status', 'Operation'].map((h, i) => (
                    <TableCell key={h} sx={{ py: 1.5 }} align={i >= 4 ? (i === 6 ? 'right' : 'center') : 'left'}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{h}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map(p => {
                  const riskConfig = ({ High: { color: 'error' as const, label: `High (${p.riskScore}%)` }, Moderate: { color: 'warning' as const, label: `Moderate (${p.riskScore}%)` }, Low: { color: 'success' as const, label: `Low (${p.riskScore}%)` } } as Record<string, { color: 'error' | 'warning' | 'success'; label: string }>)[p.riskCategory] ?? { color: 'default' as const, label: `Unknown (${p.riskScore ?? 0}%)` };
                  const statusColor = ({ Completed: 'success' as const, 'Pending Interpretation': 'primary' as const, 'Awaiting MRI': 'default' as const } as Record<string, 'success' | 'primary' | 'default'>)[p.status] ?? 'default' as const;
                  return (
                    <TableRow key={p.id} hover id={`cohort-row-${p.id}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontWeight: 'bold' }}>{p.id.toUpperCase()}</Typography>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main', fontSize: '9px' }}>{p.mrn}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography variant="body2" onClick={() => onSelectPatient(p.id)} sx={{ fontWeight: 'bold', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{p.name}</Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}><Typography variant="body2" color="text.secondary">{p.age} y/o • {p.sex}</Typography></TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                          <CalendarIcon sx={{ fontSize: 13 }} />
                          <Typography variant="body2">{p.lastEvaluated}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }} align="center"><Chip label={riskConfig.label} color={riskConfig.color} size="small" variant="outlined" sx={{ fontWeight: 'bold', fontSize: '10px', height: 20 }} /></TableCell>
                      <TableCell sx={{ py: 1.5 }} align="center"><Chip label={p.status} color={statusColor} size="small" sx={{ fontWeight: 'bold', fontSize: '9px', height: 18 }} /></TableCell>
                      <TableCell sx={{ py: 1.5 }} align="right">
                        <Button variant="outlined" size="small" onClick={() => onSelectPatient(p.id)} endIcon={<ArrowRightIcon fontSize="inherit" />} id={`btn-review-file-${p.id}`} sx={{ fontSize: '10px', py: 0.25, px: 1, fontWeight: 'bold', color: 'text.secondary', borderColor: 'divider', '&:hover': { bgcolor: 'primary.main', color: '#ffffff', borderColor: 'primary.main' } }}>Review File</Button>
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
