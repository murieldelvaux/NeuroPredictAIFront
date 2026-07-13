import { useState, useMemo } from 'react';
import type { PatientListItem } from '../../../types';

const normalizeRiskCategory = (value?: string | null, score = 0): 'High' | 'Moderate' | 'Low' => {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (normalized.includes('high')) return 'High';
  if (normalized.includes('moderate') || normalized.includes('mci')) return 'Moderate';
  if (normalized.includes('low') || normalized.includes('cn')) return 'Low';
  if (score >= 0.6) return 'High';
  if (score >= 0.3) return 'Moderate';
  return 'Low';
};

export function useDoctorDashboard(patients: PatientListItem[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'High' | 'Moderate' | 'Low'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Completed' | 'Pending Interpretation' | 'Awaiting MRI'>('ALL');

  const stats = useMemo(() => {
    const total = patients.length;
    const highRisk = patients.filter(p => normalizeRiskCategory(p.risk_category, p.risk_score ?? 0) === 'High').length;
    const awaitingMRI = patients.filter(p => p.status === 'Awaiting MRI').length;
    const avgRisk = Math.round(
      patients.reduce((sum, p) => sum + (p.risk_score ?? 0) * 100, 0) / (total || 1)
    );
    return { total, highRisk, awaitingMRI, avgRisk };
  }, [patients]);

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const category = normalizeRiskCategory(p.risk_category, p.risk_score ?? 0);
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.mrn ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'ALL' || category === riskFilter;
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
