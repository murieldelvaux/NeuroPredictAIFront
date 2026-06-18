import type { ReactNode } from 'react';

// Compatibility shim — re-exports feature-local prop types
export interface LayoutProps {
  children?: ReactNode;
  activeView: 'dashboard' | 'workflow' | 'profile';
  onNavigate: (view: 'dashboard' | 'workflow' | 'profile') => void;
  selectedPatientName?: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export type { DoctorDashboardProps } from '../features/dashboard/types';
export type { PatientProfileProps } from '../features/patient-profile/types';
export type { ClinicalWorkflowProps } from '../features/clinical-workflow/types';
