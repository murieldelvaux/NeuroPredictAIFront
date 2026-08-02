import React from 'react';
import { Box, Tabs, Tab, Paper, Typography, useTheme } from '@mui/material';
import { Assignment as FileTextIcon, Psychology as BrainIcon, AutoFixHigh as CpuIcon } from '@mui/icons-material';
import { PatientProfileProps } from '../../types';
import { usePatientProfile } from '../../hooks/usePatientProfile';
import ExamViewer from '../../../../components/ExamViewer/ExamViewer';
import PatientHeader from '../PatientHeader/PatientHeader';
import PredictionPanel from '../PredictionPanel/PredictionPanel';
import FeatureImportanceChart from '../FeatureImportanceChart/FeatureImportanceChart';
import ClinicalDataPanel from '../ClinicalDataPanel/ClinicalDataPanel';

export default function PatientProfile({ patientRecord, onBack }: PatientProfileProps) {
  const theme = useTheme();
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';
  const patient = patientRecord?.patient;

  const { activeTab, setActiveTab, predictedAiAnalysis, initialExamSources, displayMrn } = usePatientProfile(patientRecord, apiBaseUrl);

  if (!patientRecord || !patient) {
    return null;
  }

  const displayName = patient.name;
  const displayDob = patient.date_of_birth ?? '—';
  const displayAge = patient.age;
  const clinicalData = patient.clinical_data;
  const prediction = predictedAiAnalysis ?? patient.last_prediction ?? null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }} id="patient-profile-root">
      <PatientHeader patient={patient} displayMrn={displayMrn} onBack={onBack} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '4.5fr 7.5fr' }, gap: 3.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper variant="outlined" sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Box component="div" sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 0.5 }}>{displayName}</Box>
                  <Box component="div" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    Sexo: {patient.sex} • Idade: {displayAge} anos • Nascimento: {displayDob}
                  </Box>
                  <Box component="div" sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>
                    Registro: {displayMrn}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.01)' }}>
            <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} variant="fullWidth">
              <Tab label="Avaliações cognitivas" value="clinical" icon={<FileTextIcon fontSize="small" />} iconPosition="start" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '12px' }} />
              <Tab label="Neuroimagem (Ressonância 3T)" value="imaging" icon={<BrainIcon fontSize="small" />} iconPosition="start" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '12px' }} />
              <Tab label="IA explicável" value="ai" icon={<CpuIcon fontSize="small" />} iconPosition="start" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '12px' }} />
            </Tabs>
          </Box>

          <Box sx={{ p: { xs: 2, md: 3 } }}>
            {activeTab === 'clinical' && <ClinicalDataPanel clinicalData={clinicalData} />}
            {activeTab === 'imaging' && <ExamViewer title="Visualizador NiiVue do exame" description="Abra o exame salvo do paciente e carregue novos arquivos localmente no mesmo canvas." initialExams={initialExamSources} emptyStateTitle="Nenhum exame estruturado disponível" emptyStateDescription="Se o backend ainda não expôs o arquivo NIfTI do paciente, use o upload para carregar um `.nii` ou `.nii.gz`." height={620} />}
            {activeTab === 'ai' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <PredictionPanel prediction={prediction} />
                <FeatureImportanceChart explanation={predictedAiAnalysis?.explanation} />
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
