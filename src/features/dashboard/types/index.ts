import type { PatientResponse } from '../../../types';

export interface DoctorDashboardProps {
  patients: PatientResponse[];
  isLoading: boolean;
  onSelectPatient: (id: string) => void;
  onStartWorkflow: () => void;
}
