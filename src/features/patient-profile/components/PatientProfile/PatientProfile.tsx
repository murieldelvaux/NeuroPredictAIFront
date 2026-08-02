/**
 * NeuroPredict AI - Clinical Patient Profile Analyzer styled with Material-UI
 */
import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Chip,
  Tabs,
  Tab,
  Paper,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowLeftIcon,
  Fingerprint as DnaIcon,
  Assignment as FileTextIcon,
  Psychology as BrainIcon,
  ContactPage as UserIcon,
  AutoFixHigh as CpuIcon,
} from '@mui/icons-material';
import { PatientProfileProps } from '../../types';
import { usePatientProfile } from '../../hooks/usePatientProfile';
import ExamViewer from '../../../../components/ExamViewer/ExamViewer';

export default function PatientProfile({ patientRecord, onBack }: PatientProfileProps) {
  const theme = useTheme();
  const patient = patientRecord?.patient;
  const cognitive = patientRecord?.patient?.clinical_data;
  const exam = patientRecord?.exam;
  const imagingAnalysis = patientRecord?.imaging_analysis;

  const { activeTab, setActiveTab, predictedAiAnalysis } = usePatientProfile();

  if (!patientRecord || !patient) {
    return null;
  }

  const displayName = patient.name;
  const displayMrn = patient.mrn ?? '—';
  const displayDob = patient.date_of_birth ?? '—';
  const displayAge = patient.age;
  const displayEducation = cognitive?.education_years ?? 0;
  const displayMmse = cognitive?.mmse ?? 0;
  const displayMoca = cognitive?.moca ?? 0;
  const displayCdr = cognitive?.cdr ?? 0;
  const displayMriFile = cognitive?.mri_file;
  const aiAnalysis = (patientRecord.ai_analysis ?? null) as any;
  const mergedAiAnalysis = (predictedAiAnalysis ?? aiAnalysis) as any;

  const initialExamSources = useMemo(() => {
    if (!displayMriFile?.filename) {
      return [];
    }

    const apiOrigin = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';
    const resolvedUrl = displayMriFile.url ?? `/patients/${patient.id}/mri-file`;
    const url = resolvedUrl.startsWith('http://') || resolvedUrl.startsWith('https://')
      ? resolvedUrl
      : new URL(resolvedUrl, apiOrigin).toString();

    return [
      {
        id: displayMriFile.filename,
        label: displayMriFile.filename,
        description: `${displayMriFile.content_type} • ${displayMriFile.size} bytes`,
        source: { type: 'url' as const, url },
      },
    ];
  }, [displayMriFile, patient.id]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }} id="patient-profile-root">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          pb: 1.5,
        }}
        id="profile-back-panel"
      >
        <Button
          variant="outlined"
          size="small"
          onClick={onBack}
          startIcon={<ArrowLeftIcon />}
          id="btn-back-to-queue"
          sx={{ fontWeight: 'bold', textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}
        >
          Voltar à lista da coorte
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label="SEGURANÇA HIPAA" size="small" variant="outlined" color="primary" sx={{ height: 20, fontSize: '9px', fontWeight: 'bold' }} />
          <Chip label="ACELERAÇÃO POR GPU ATIVA" size="small" variant="outlined" color="success" sx={{ height: 20, fontSize: '9px', fontWeight: 'bold' }} />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '4.5fr 7.5fr' }, gap: 3.5 }} id="profile-detailed-panels">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="patient-demographic-column">
          <Card variant="outlined" id="summary-badge-identity" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', tracking: '-0.02em', mb: 0.5 }}>{displayName}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <UserIcon sx={{ fontSize: 13 }} /> MRN: <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'primary.main' }}>{displayMrn}</Box>
                  </Typography>
                </Box>
                <Chip
                  label={patient.last_prediction?.classification ?? 'Sem predição'}
                  color={patient.last_prediction?.risk_score && patient.last_prediction.risk_score >= 0.6 ? 'error' : patient.last_prediction?.risk_score && patient.last_prediction.risk_score >= 0.3 ? 'warning' : 'success'}
                  size="small"
                  sx={{ fontWeight: 'bold', height: 22 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 2, fontSize: '12px' }} id="patient-metrics-demographic-list">
                <Box><Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>SEXO</Typography><Typography variant="body2" sx={{ fontWeight: 'bold' }}>{patient.sex}</Typography></Box>
                <Box><Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>IDADE</Typography><Typography variant="body2" sx={{ fontWeight: 'bold' }}>{displayAge} anos</Typography></Box>
                <Box><Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>DATA DE NASCIMENTO</Typography><Typography variant="body2" sx={{ fontWeight: 'bold' }}>{displayDob}</Typography></Box>
                <Box><Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>HISTÓRICO ESCOLAR</Typography><Typography variant="body2" sx={{ fontWeight: 'bold' }}>{displayEducation} anos de estudo</Typography></Box>
                {displayMriFile && (
                  <Box sx={{ gridColumn: { xs: '1 / -1' } }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>ARQUIVO MRI ENVIADO</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{displayMriFile.filename}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{displayMriFile.content_type} • {displayMriFile.size} bytes</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box id="profile-assessment-tabs-container-wrapper">
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }} id="profile-assessment-tabs-container">
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.01)' }}>
              <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} variant="fullWidth" id="patient-tabs-navbar">
                <Tab label="Avaliações cognitivas" value="clinical" icon={<FileTextIcon fontSize="small" />} iconPosition="start" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '12px' }} />
                <Tab label="Neuroimagem (Ressonância 3T)" value="imaging" icon={<BrainIcon fontSize="small" />} iconPosition="start" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '12px' }} />
                <Tab label="IA explicável" value="ai" icon={<CpuIcon fontSize="small" />} iconPosition="start" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '12px' }} />
              </Tabs>
            </Box>

            <Box sx={{ p: { xs: 2, md: 3 } }}>
              {activeTab === 'clinical' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                    <Card variant="outlined"><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}><Typography variant="caption" sx={{ fontWeight: 'bold' }} color="text.secondary">MMSE</Typography><Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>{displayMmse} / 30</Typography></CardContent></Card>
                    <Card variant="outlined"><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}><Typography variant="caption" sx={{ fontWeight: 'bold' }} color="text.secondary">MoCA</Typography><Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>{displayMoca} / 30</Typography></CardContent></Card>
                    <Card variant="outlined"><CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}><Typography variant="caption" sx={{ fontWeight: 'bold' }} color="text.secondary">CDR</Typography><Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>{displayCdr} / 3.0</Typography></CardContent></Card>
                  </Box>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Resumo cognitivo</Typography>
                    <Typography variant="body2" color="text.secondary">Esta aba mantém a visão geral clínica do paciente e os indicadores históricos disponíveis.</Typography>
                  </Paper>
                </Box>
              )}

              {activeTab === 'imaging' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <ExamViewer
                    title="Visualizador NiiVue do exame"
                    description="Abra o exame salvo do paciente e carregue novos arquivos localmente no mesmo canvas."
                    initialExams={initialExamSources}
                    emptyStateTitle="Nenhum exame estruturado disponível"
                    emptyStateDescription="Se o backend ainda não expôs o arquivo NIfTI do paciente, use o upload para carregar um `.nii` ou `.nii.gz`."
                    height={620}
                  />

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
                    <Card variant="outlined">
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }} color="text.secondary">CONFIGURAÇÃO DA MODALIDADE</Typography>
                        <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>{exam?.scan_type ?? '—'} • {exam?.scan_date ?? '—'}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>Fatia: {exam?.slice_thickness ?? '—'} • Campo: {exam?.magnetic_strength || '3.0T Core'}</Typography>
                      </CardContent>
                    </Card>

                    {imagingAnalysis ? (
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1.5 }} color="text.secondary">VOLUMETRIAS REGIONAIS CALCULADAS POR IA</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Typography variant="body2">Hipocampo esquerdo: {imagingAnalysis.left_hippocampal_volume ?? imagingAnalysis.hippocampal_volume_left ?? '—'} cm³</Typography>
                          <Typography variant="body2">Hipocampo direito: {imagingAnalysis.right_hippocampal_volume ?? imagingAnalysis.hippocampal_volume_right ?? '—'} cm³</Typography>
                          <Typography variant="body2">Razão ventricular: {(imagingAnalysis.ventricle_enlargement_ratio ?? imagingAnalysis.ventricle_ratio ?? 0).toFixed(3)}</Typography>
                          <Typography variant="body2">Espessura cortical: {imagingAnalysis.cortical_thickness_avg ?? imagingAnalysis.cortical_thickness ?? '—'} mm</Typography>
                        </Box>
                      </Paper>
                    ) : (
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">Nenhuma análise volumétrica calculada ainda para este exame.</Typography>
                      </Paper>
                    )}
                  </Box>
                </Box>
              )}

              {activeTab === 'ai' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {mergedAiAnalysis ? (
                    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Predição mais recente</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>Classificação: {mergedAiAnalysis.classification ?? '—'}</Typography>
                      <Typography variant="body2">Confiança: {(((mergedAiAnalysis.confidence ?? 0) * 100).toFixed(1))}%</Typography>
                      <Typography variant="body2">Risco: {Math.round((mergedAiAnalysis.risk_score ?? mergedAiAnalysis.probability ?? 0) * 100)}%</Typography>
                    </Paper>
                  ) : (
                    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">Nenhuma predição de IA foi gerada para este paciente.</Typography>
                    </Paper>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
