import type { PatientListItem } from '../../../types';

export interface DoctorDashboardProps {
  patients: PatientListItem[];
  isLoading: boolean;
  onSelectPatient: (id: string) => void;
  onStartWorkflow: () => void;
}
