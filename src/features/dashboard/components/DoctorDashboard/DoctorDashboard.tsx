import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { PersonAdd as UserIcon } from '@mui/icons-material';
import { DoctorDashboardProps } from '../../types';
import { useDoctorDashboard } from '../../hooks/useDoctorDashboard';
import DashboardStats from '../DashboardStats/DashboardStats';
import PatientTable from '../PatientTable/PatientTable';

export default function DoctorDashboard({ patients, isLoading, onSelectPatient, onStartWorkflow }: DoctorDashboardProps) {
  const {
    searchTerm,
    setSearchTerm,
    riskFilter,
    setRiskFilter,
    statusFilter,
    setStatusFilter,
    tableRows,
    total,
    highRisk,
    awaitingMRI,
    avgRisk,
  } = useDoctorDashboard(patients);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="doctor-dashboard-root">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2,
          gap: 2,
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

      <DashboardStats
        isLoading={isLoading}
        total={total}
        highRisk={highRisk}
        awaitingMRI={awaitingMRI}
        avgRisk={avgRisk}
      />

      <PatientTable
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        riskFilter={riskFilter}
        onRiskFilterChange={setRiskFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        rows={tableRows}
        onSelectPatient={onSelectPatient}
      />
    </Box>
  );
}