import { Patient } from '../../../types';

export interface DoctorDashboardProps {
  patients: Patient[];
  isLoading: boolean;
  onSelectPatient: (id: string) => void;
  onStartWorkflow: () => void;
}
