// Component-level prop types shared across features

export interface NavigationProps {
  activeView: 'dashboard' | 'profile' | 'workflow';
  onNavigate: (view: 'dashboard' | 'profile' | 'workflow') => void;
  selectedPatientName?: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}
