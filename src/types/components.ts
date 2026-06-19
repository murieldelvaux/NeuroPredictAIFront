import type { ReactNode } from 'react';

export type LayoutProps = {
  children?: ReactNode;
  activeView: 'dashboard' | 'workflow' | 'profile';
  onNavigate: (view: 'dashboard' | 'workflow' | 'profile') => void;
  selectedPatientName?: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
};

export type { DoctorDashboardProps } from '../features/dashboard/types/dashboard.types';
export type { PatientProfileProps } from '../features/patient-profile/types/patientProfile.types';
export type { ClinicalWorkflowProps } from '../features/clinical-workflow/types/clinicalWorkflow.types';
