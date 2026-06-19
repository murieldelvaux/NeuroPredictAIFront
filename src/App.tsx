/**
 * NeuroPredict AI - Clinical Workspace Root
 */
import React, { useState, useMemo } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Alert,
  IconButton,
  CircularProgress,
  Typography,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query/react-query';

// Feature-local imports (new pattern)
import Layout from './features/components/Layout/Layout';
import DoctorDashboard from './features/dashboard/components/DoctorDashboard/DoctorDashboard';
import PatientProfile from './features/patient-profile/components/PatientProfile/PatientProfile';
import ClinicalWorkflow from './features/clinical-workflow/components/ClinicalWorkflow/ClinicalWorkflow';
import { usePatients } from './features/dashboard/react-queries/usePatients';
import { usePatient } from './features/patient-profile/react-queries/usePatient';
import { useCreatePatient } from './features/clinical-workflow/react-queries/useCreatePatient';
import { predictionApiService } from './services/apiClient';

function WorkspaceRoot({
  isDarkMode,
  onToggleTheme,
}: {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}) {
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'workflow'>(
    'dashboard',
  );
  // FIX: start as null so usePatient does not fire before a patient is selected
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  const { data: patients = [], isLoading: listLoading } = usePatients();
  // FIX: pass empty string when null so the query is disabled (enabled: !!id)
  const { data: activeDetail, isLoading: detailLoading } = usePatient(selectedPatientId ?? '');
  const createPatientMutation = useCreatePatient();

  // FIX: set selectedPatientId then navigate to profile
  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    setActiveView('profile');
  };

  console.log(selectedPatientId, activeDetail, patients);
  const handleCreatePatientSubmit = (variables: any) => {
    createPatientMutation.mutate(variables, {
      onSuccess: (newPatient) => {
        // Navigate to profile immediately after creation
        setSelectedPatientId(newPatient.id);
        setActiveView('profile');

        // Fire prediction with the newly created patient data
        predictionApiService
          .predict({
            patient_id: newPatient.id,
            age:    variables.demographics?.age    ?? newPatient.age,
            mmse:   variables.cognitive?.mmse,
            cdr:    variables.cognitive?.cdr,
            cdrtot: variables.cognitive?.cdr,
            mri_file: null,
          })
          .then(() => {
            setToastMessage({
              text: `Patient ${newPatient.name} committed and prediction generated successfully.`,
              type: 'success',
            });
          })
          .catch((predErr: any) => {
            setToastMessage({
              text: `Patient saved, but prediction failed: ${predErr.message}`,
              type: 'info',
            });
          })
          .finally(() => {
            setTimeout(() => setToastMessage(null), 6000);
          });
      },
      onError: (err: any) => {
        setToastMessage({
          text: `Calibration error during acquisition: ${err.message}`,
          type: 'error',
        });
        setTimeout(() => setToastMessage(null), 5000);
      },
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
      {toastMessage && (
        <Alert
          severity={toastMessage.type}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setToastMessage(null)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 3 }}
        >
          {toastMessage.text}
        </Alert>
      )}

      <Box sx={{ transition: 'all 0.3s' }}>
        {activeView === 'dashboard' && (
          <DoctorDashboard
            patients={patients}
            isLoading={listLoading}
            onSelectPatient={handleSelectPatient}
            onStartWorkflow={() => setActiveView('workflow')}
          />
        )}

        {activeView === 'workflow' && (
          <ClinicalWorkflow
            onSave={handleCreatePatientSubmit}
            isSaving={createPatientMutation.isPending}
            onCancel={() => {
              setToastMessage({ text: 'Interim clinical registration file scrapped.', type: 'info' });
              setTimeout(() => setToastMessage(null), 3000);
              setActiveView('dashboard');
            }}
          />
        )}

        {activeView === 'profile' && (
          <Box>
            {/* FIX: redirect to dashboard if no patient selected */}
            {!selectedPatientId ? (
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Please select an active patient from the workspace queue first.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setActiveView('dashboard')}
                  sx={{ mt: 2, fontSize: '11px', fontWeight: 'bold' }}
                >
                  Return to Dashboard
                </Button>
              </Box>
            ) : detailLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 10,
                  gap: 2,
                }}
              >
                <CircularProgress color="primary" />
                <Typography
                  variant="caption"
                  sx={{ fontFamily: 'monospace', color: 'text.secondary', fontWeight: 'bold' }}
                >
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
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Patient data could not be loaded. Please try again.
                </Typography>
                <Button
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

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: { main: '#0284c7' },
          secondary: { main: '#1e293b' },
          background: {
            default: isDarkMode ? '#0a0f1d' : '#f8fafc',
            paper: isDarkMode ? '#111827' : '#ffffff',
          },
          divider: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          button: { textTransform: 'none', fontWeight: 600 },
        },
        shape: { borderRadius: 8 },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: 'none',
                backgroundImage: 'none',
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              outlined: {
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              },
            },
          },
        },
      }),
    [isDarkMode],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WorkspaceRoot isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode((p) => !p)} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
