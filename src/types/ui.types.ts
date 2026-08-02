export type PatientSex = 'M' | 'F';

export type PatientStatus = 'Completed' | 'Pending Interpretation';

export type RiskCategory = 'High' | 'Moderate' | 'Low';

export type AppView = 'dashboard' | 'profile' | 'workflow';

export type ToastMessage = {
  text: string;
  type: 'success' | 'info' | 'error';
};