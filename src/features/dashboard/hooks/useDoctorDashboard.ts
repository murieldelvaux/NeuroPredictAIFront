import { useState, useMemo } from 'react';
import type { PatientResponse } from '../../../types';

const normalizeRiskCategory = (classification?: string | null, score = 0): 'High' | 'Moderate' | 'Low' => {
  const normalized = String(classification ?? '').trim().toLowerCase();
  if (normalized === 'ad') return 'High';
  if (normalized === 'mci') return 'Moderate';
  if (normalized === 'cn') return 'Low';
  if (score >= 0.6) return 'High';
  if (score >= 0.3) return 'Moderate';
  return 'Low';
};

const getPatientRiskScore = (patient: PatientResponse) => patient.last_prediction?.risk_score ?? 0;

const getPatientRiskCategory = (patient: PatientResponse) =>
  normalizeRiskCategory(patient.last_prediction?.classification, getPatientRiskScore(patient));

const getPatientStatus = (patient: PatientResponse): 'Completed' | 'Pending Interpretation' =>
  patient.last_prediction ? 'Completed' : 'Pending Interpretation';

export function useDoctorDashboard(patients: PatientResponse[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'High' | 'Moderate' | 'Low'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Completed' | 'Pending Interpretation'>('ALL');

  const stats = useMemo(() => {
    const total = patients.length;
    const highRisk = patients.filter((p) => getPatientRiskCategory(p) === 'High').length;
    const awaitingMRI = patients.filter((p) => getPatientStatus(p) === 'Pending Interpretation').length;
    const avgRisk = Math.round(
      patients.reduce((sum, p) => sum + getPatientRiskScore(p) * 100, 0) / (total || 1)
    );
    return { total, highRisk, awaitingMRI, avgRisk };
  }, [patients]);

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const category = getPatientRiskCategory(p);
      const status = getPatientStatus(p);
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.mrn ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'ALL' || category === riskFilter;
      const matchesStatus = statusFilter === 'ALL' || status === statusFilter;
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
