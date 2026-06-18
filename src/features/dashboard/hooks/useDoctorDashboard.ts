import { useState, useMemo } from 'react';
import type { Patient } from '../../../types';
import type {
  RiskFilter,
  StatusFilter,
  UseDoctorDashboardReturn,
} from '../types/dashboard.types';

export function useDoctorDashboard(patients: Patient[]): UseDoctorDashboardReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const stats = useMemo(() => {
    const total = patients.length;
    const highRisk = patients.filter((p) => p.riskCategory === 'High').length;
    const awaitingMRI = patients.filter((p) => p.status === 'Awaiting MRI').length;
    const avgRisk = Math.round(
      patients.reduce((sum, p) => sum + p.riskScore, 0) / (total || 1),
    );
    return { total, highRisk, awaitingMRI, avgRisk };
  }, [patients]);

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'ALL' || p.riskCategory === riskFilter;
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [patients, searchTerm, riskFilter, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    riskFilter,
    setRiskFilter,
    statusFilter,
    setStatusFilter,
    filteredPatients,
    ...stats,
  };
}
