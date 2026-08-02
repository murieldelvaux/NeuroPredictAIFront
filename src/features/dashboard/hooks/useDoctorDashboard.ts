import { useState, useMemo } from 'react';
import type { PatientResponse, PatientStatus, RiskCategory } from '../../../types';

const normalizeRiskCategory = (classification?: string | null, score = 0): RiskCategory => {
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

const getPatientStatus = (patient: PatientResponse): PatientStatus =>
  patient.last_prediction ? 'Completed' : 'Pending Interpretation';

const getPatientDisplayMrn = (patient: PatientResponse) => {
  const mrn = (patient as any).mrn;
  return typeof mrn === 'string' && mrn.trim() ? mrn : '—';
};

export function useDoctorDashboard(patients: PatientResponse[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskCategory>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PatientStatus>('ALL');

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
        p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'ALL' || category === riskFilter;
      const matchesStatus = statusFilter === 'ALL' || status === statusFilter;
      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [patients, searchTerm, riskFilter, statusFilter]);

  const tableRows = useMemo(() => {
    return filteredPatients.map((patient) => {
      const classification = (patient.last_prediction?.classification ?? '').toLowerCase();
      const riskScore = Math.round((patient.last_prediction?.risk_score ?? 0) * 100);
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

      const riskConfig = ({
        High: { color: 'error' as const, label: `High (${riskScore}%)` },
        Moderate: { color: 'warning' as const, label: `Moderate (${riskScore}%)` },
        Low: { color: 'success' as const, label: `Low (${riskScore}%)` },
        Unknown: { color: 'default' as const, label: `Unknown (${riskScore}%)` },
      } as Record<string, { color: 'error' | 'warning' | 'success' | 'default'; label: string }>)[normalizedCategory];

      const status: PatientStatus = patient.last_prediction ? 'Completed' : 'Pending Interpretation';
      const statusColor = ({
        Completed: 'success' as const,
        'Pending Interpretation': 'primary' as const,
      } as Record<string, 'success' | 'primary'>)[status];

      return {
        patient,
        displayMrn: getPatientDisplayMrn(patient),
        riskLabel: riskConfig.label,
        riskColor: riskConfig.color,
        status,
        statusColor,
      };
    });
  }, [filteredPatients]);

  return {
    searchTerm,
    setSearchTerm,
    riskFilter,
    setRiskFilter,
    statusFilter,
    setStatusFilter,
    filteredPatients,
    tableRows,
    ...stats,
  };
}
