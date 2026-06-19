import type { PatientListItem } from '../../../types';

export type DoctorDashboardProps = {
  onSelectPatient: (patientId: string) => void;
};

export type DashboardStats = {
  totalPatients: number;
  highRisk: number;
  pendingReview: number;
  completedToday: number;
};

export type DashboardState = {
  patients: PatientListItem[];
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
};
