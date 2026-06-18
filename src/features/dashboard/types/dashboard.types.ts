import type { Patient } from '../../../types';

export type RiskFilter = 'ALL' | 'High' | 'Moderate' | 'Low';
export type StatusFilter = 'ALL' | 'Completed' | 'Pending Interpretation' | 'Awaiting MRI';

export interface DashboardStats {
  total: number;
  highRisk: number;
  awaitingMRI: number;
  avgRisk: number;
}

export interface UseDoctorDashboardReturn extends DashboardStats {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  riskFilter: RiskFilter;
  setRiskFilter: (v: RiskFilter) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (v: StatusFilter) => void;
  filteredPatients: Patient[];
}
