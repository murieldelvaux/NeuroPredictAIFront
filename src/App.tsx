/**
 * NeuroPredict AI - Clinical Workspace Root
 */
import React, { useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline, Box, Alert, IconButton, CircularProgress, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Layout from './components/Layout';
import DoctorDashboard from './components/DoctorDashboard';
import PatientProfile from './components/PatientProfile';
import ClinicalWorkflow from './components/ClinicalWorkflow';
import { usePatients, usePatient, useCreatePatient } from './hooks/useMedicalQueries';

// Create solid react-query orchestrator
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  }
});

function WorkspaceRoot({ isDarkMode, onToggleTheme }: { isDarkMode: boolean; onToggleTheme: () => void }) {
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'workflow'>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat-01');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Unified Query hooks fetching
  const { data: patients = [], isLoading: listLoading } = usePatients();
  const { data: activeDetail, isLoading: detailLoading } = usePatient(selectedPatientId);
  const createPatientMutation = useCreatePatient();

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    setActiveView('profile');
  };

  const handleCreatePatientSubmit = (variables: any) => {
    createPatientMutation.mutate(variables, {
      onSuccess: (newPatient) => {
        setToastMessage({
          text: `Patient profile for ${newPatient.name} successfully committed and synchronized with PYTORCH cloud registries.`,
          type: 'success'
        });
        setSelectedPatientId(newPatient.id);
        setActiveView('profile');
        
        // Clear toast automatically after 5 sec
        setTimeout(() => setToastMessage(null), 5000);
      },
      onError: (err: any) => {
        setToastMessage({
          text: `Calibration error during acquisition: ${err.message}`,
          type: 'error'
        });
        setTimeout(() => setToastMessage(null), 5000);
      }
    });
  };

  return (
    <Layout 
      activeView={activeView} 
      onNavigate={(view) => setActiveView(view)}
      selectedPatientName={activeDetail?.patient?.name}
      isDarkMode={isDarkMode}
      onToggleTheme={onToggleTheme}
    >
      {/* Toast Alert popups bar using Material-UI Alert component */}
      {toastMessage && (
        <Alert 
          severity={toastMessage.type}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setToastMessage(null)}
              id="btn-close-toast"
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 3 }}
          id="toast-notifications-banner"
        >
          {toastMessage.text}
        </Alert>
      )}

      {/* RENDER VIEW SCREEN */}
      <Box sx={{ transition: 'all 0.3s' }} id="main-view-container">
        
        {/* DOCTOR DASHBOARD */}
        {activeView === 'dashboard' && (
          <DoctorDashboard 
            patients={patients} 
            isLoading={listLoading}
            onSelectPatient={handleSelectPatient}
            onStartWorkflow={() => setActiveView('workflow')}
          />
        )}

        {/* CLINICAL EVALUATION WORKFLOW STEPPER */}
        {activeView === 'workflow' && (
          <ClinicalWorkflow 
            onSave={handleCreatePatientSubmit}
            isSaving={createPatientMutation.isPending}
            onCancel={() => {
              setToastMessage({
                text: "Interim clinical registration file scrapped.",
                type: 'info'
              });
              setTimeout(() => setToastMessage(null), 3000);
              setActiveView('dashboard');
            }}
          />
        )}

        {/* COMPREHENSIVE PATIENT VIEW ANALYSIS */}
        {activeView === 'profile' && (
          <Box>
            {detailLoading ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  py: 10, 
                  gap: 2 
                }} 
                id="profile-detailed-loading"
              >
                <CircularProgress color="primary" />
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontWeight: 'bold' }}>
                  Recalculating feature importance gradients...
                </Typography>
              </Box>
            ) : activeDetail ? (
              <PatientProfile 
                patientRecord={activeDetail} 
                onBack={() => setActiveView('dashboard')}
              />
            ) : (
              <Box 
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  border: 1, 
                  borderColor: 'divider', 
                  bgcolor: 'background.paper', 
                  borderRadius: 2 
                }} 
                id="profile-not-found"
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Please select an active patient from the workspace queue first.
                </Typography>
                <Button
                  id="btn-trigger-redirect-dashboard"
                  variant="contained"
                  onClick={() => setActiveView('dashboard')}
                  sx={{ mt: 2, fontSize: '11px', fontWeight: 'bold' }}
                >
                  Return to Dashboard
                </Button>
              </Box>
            )}
          </Box>
        )}

      </Box>
    </Layout>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Generate our custom MUI theme dynamically depending on dark mode state
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: isDarkMode ? 'dark' : 'light',
        primary: {
          main: '#0284c7', // Sky blue
        },
        secondary: {
          main: '#1e293b', // Slate gray
        },
        background: {
          default: isDarkMode ? '#0a0f1d' : '#f8fafc',
          paper: isDarkMode ? '#111827' : '#ffffff',
        },
        divider: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        button: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: 'none',
              backgroundImage: 'none',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            outlined: {
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
            },
          },
        },
      },
    });
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WorkspaceRoot isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
