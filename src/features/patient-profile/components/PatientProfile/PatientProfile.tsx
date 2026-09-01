import React from 'react';
import { Alert, Box, Tabs, Tab, Paper, Typography, useTheme } from '@mui/material';
import { Assignment as FileTextIcon, Psychology as BrainIcon, AutoFixHigh as CpuIcon } from '@mui/icons-material';
import { PatientProfileProps } from '../../types';
import { usePatientProfile } from '../../hooks/usePatientProfile';
import ExamViewer from '../../../../components/ExamViewer/ExamViewer';
import PatientHeader from '../PatientHeader/PatientHeader';
import DiagnosticValidationBar from '../DiagnosticValidationBar/DiagnosticValidationBar';
import PatientSummaryPanel from '../PatientSummaryPanel/PatientSummaryPanel';
import PredictionPanel from '../PredictionPanel/PredictionPanel';
import PredictionProbabilityChart from '../PredictionProbabilityChart/PredictionProbabilityChart';
import FeatureImportanceChart from '../FeatureImportanceChart/FeatureImportanceChart';
import ClinicalDataPanel from '../ClinicalDataPanel/ClinicalDataPanel';

export default function PatientProfile({ patientRecord, onBack }: PatientProfileProps) {
  const theme = useTheme();
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';
  const patient = patientRecord?.patient;

  const {
    activeTab,
    setActiveTab,
    currentPrediction,
    initialExamSources,
    displayRecordId,
    uploadMriAndPredict,
    mriUploading,
    uploadError,
    selectedExamId,
    setSelectedExamId,
    selectedExam,
  } = usePatientProfile(patientRecord, apiBaseUrl);

  if (!patientRecord || !patient) {
    return null;
  }

  const prediction = currentPrediction ?? patient.last_prediction ?? null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="patient-profile-root">
      {/* Top Header Bar */}
      <PatientHeader patient={patient} displayRecordId={displayRecordId} onBack={onBack} />

      {/* 1. Diagnostic Validation Bar (Ground-Truth confirmation) */}
      <DiagnosticValidationBar patient={patient} />

      {/* Consolidated Patient Summary Cards */}
      <PatientSummaryPanel
        patient={patient}
        displayRecordId={displayRecordId}
        prediction={prediction}
        examCount={initialExamSources.length}
      />

      {/* Tabs Section */}
      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.02)',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              label="Avaliações cognitivas"
              value="clinical"
              icon={<FileTextIcon fontSize="small" />}
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '13px', py: 1.75 }}
            />
            <Tab
              label="Neuroimagem (Ressonância 3T)"
              value="imaging"
              icon={<BrainIcon fontSize="small" />}
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '13px', py: 1.75 }}
            />
            <Tab
              label="IA explicável"
              value="ai"
              icon={<CpuIcon fontSize="small" />}
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '13px', py: 1.75 }}
            />
          </Tabs>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {activeTab === 'clinical' && (
            <ClinicalDataPanel patient={patient} predictions={patientRecord.predictions} />
          )}

          {activeTab === 'imaging' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {uploadError && <Alert severity="error">{uploadError}</Alert>}
              {mriUploading && <Alert severity="info">Enviando a nova imagem e gerando a predição...</Alert>}
              <ExamViewer
                title="Visualizador NiiVue do exame"
                description="Abra o exame salvo do paciente e carregue novos arquivos localmente no mesmo canvas."
                initialExams={initialExamSources}
                selectedExamId={selectedExamId}
                onExamChange={(exam) => {
                  if (exam) {
                    setSelectedExamId(exam.id);
                  }
                }}
                emptyStateTitle="Nenhum exame estruturado disponível"
                emptyStateDescription="Se o backend ainda não expôs o arquivo NIfTI do paciente, use o upload para carregar um `.nii` ou `.nii.gz`."
                height={620}
                uploadButtonLabel="Enviar nova imagem e gerar predição"
                onFilesSelected={(files) => {
                  const nextFile = files[files.length - 1];
                  if (nextFile) {
                    return uploadMriAndPredict(nextFile);
                  }
                }}
              />
            </Box>
          )}

          {activeTab === 'ai' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {initialExamSources.length > 0 && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.04)',
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BrainIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Exame selecionado para explicabilidade:
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {initialExamSources.map((exam, idx) => {
                      const isSelected = selectedExamId
                        ? exam.id === selectedExamId
                        : idx === initialExamSources.length - 1;
                      return (
                        <Box
                          key={exam.id}
                          component="button"
                          onClick={() => setSelectedExamId(exam.id)}
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1.5,
                            border: '1px solid',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.75,
                            bgcolor: isSelected
                              ? 'primary.main'
                              : theme.palette.mode === 'dark'
                              ? 'rgba(255,255,255,0.05)'
                              : '#ffffff',
                            color: isSelected ? '#ffffff' : 'text.primary',
                            borderColor: isSelected ? 'primary.main' : 'divider',
                            transition: 'all 0.15s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
                            },
                          }}
                        >
                          {exam.label}
                        </Box>
                      );
                    })}
                  </Box>
                </Paper>
              )}

              <PredictionPanel prediction={prediction} />
              <PredictionProbabilityChart prediction={currentPrediction} />
              <FeatureImportanceChart explanation={currentPrediction?.explanation} />
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
