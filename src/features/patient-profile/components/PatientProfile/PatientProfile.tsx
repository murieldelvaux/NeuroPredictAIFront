/**
 * NeuroPredict AI - Clinical Patient Profile Analyzer styled with Material-UI
 */
import React, { useRef } from 'react';
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
  Slider, 
  Switch, 
  FormControlLabel, 
  Paper, 
  LinearProgress, 
  CircularProgress,
  useTheme,
  Alert,
} from '@mui/material';
import { 
  ArrowBack as ArrowLeftIcon, 
  Fingerprint as DnaIcon, 
  Assignment as FileTextIcon, 
  Psychology as BrainIcon, 
  CloudUpload as UploadIcon, 
  ContactPage as UserIcon, 
  AutoFixHigh as CpuIcon 
} from '@mui/icons-material';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine,
  Cell
} from 'recharts';
import { PatientProfileProps } from '../../types';
import { usePatientProfile } from '../../hooks/usePatientProfile';

export default function PatientProfile({ patientRecord, onBack }: PatientProfileProps) {
  const theme = useTheme();
  const { patient, demographics, history, cognitive, exam, imagingAnalysis, aiAnalysis } = patientRecord;
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log(patient)
  // Utilize logic-less extraction hook
  const {
    activeTab,
    setActiveTab,
    sliceDepth,
    setSliceDepth,
    showHeatmap,
    setShowHeatmap,
    mriUploading,
    uploadedFile,
    predictedAiAnalysis,
    uploadError,
    uploadMriAndPredict,    
    } = usePatientProfile();
    
  const mergedAiAnalysis = predictedAiAnalysis ?? aiAnalysis;

  // Cognitive Score evolution helper for charts
  const historySeries = cognitive?.history.map(item => ({
    name: item.date,
    MMSE: item.mmse,
    MoCA: item.moca,
    CDR: item.cdr * 10 // scale CDR by 10 for better visualization on same axis
  }));

  // SHAP explanatory factor series helper for charts
  const shapData = mergedAiAnalysis?.explainability.shapAttributions.map(item => ({
    name: item.featureName,
    value: Math.round(item.attributionValue * 100),
    category: item.category
    })) || [];

  // MRI scan simulation visualizer
  const renderInteractiveScan = () => {
    // Generate a beautiful, clinical circular scan slice depending on slice depth and heatmap toggles
    const radius = 60 + sliceDepth * 0.4; // dynamic size based on slider
    const contrastValue = 0.8 + (sliceDepth / 200);

    return (
      <Box 
        sx={{ 
          position: 'relative', 
          width: '100%', 
          aspectRatio: '1', 
          maxWidth: 320, 
          mx: 'auto', 
          bgcolor: '#020617', 
          borderRadius: 4, 
          border: 1, 
          borderColor: 'divider', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          overflow: 'hidden', 
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)' 
        }}
        id="mri-interactive-console"
      >
        {/* Alignment concentric grids */}
        <Box sx={{ position: 'absolute', inset: 8, border: '1px solid rgba(255,255,255,0.03)', borderRadius: '50%', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', inset: 32, border: '1px dashed rgba(255,255,255,0.02)', borderRadius: '50%', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', inset: 64, border: '1px solid rgba(255,255,255,0.01)', borderRadius: '50%', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: 0.15 }}>
          <Box sx={{ width: '1px', height: '100%', bgcolor: 'text.secondary' }} />
          <Box sx={{ height: '1px', width: '100%', bgcolor: 'text.secondary' }} />
        </Box>

        {/* Digital display overlays */}
        <Typography 
          variant="caption" 
          sx={{ position: 'absolute', top: 12, left: 16, fontFamily: 'monospace', fontSize: '9px', color: '#14b8a6', fontWeight: 'bold' }}
          id="mri-param-left"
        >
          FLAIR_3D_CORONAL
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ position: 'absolute', top: 12, right: 16, fontFamily: 'monospace', fontSize: '9px', color: '#10b981' }}
          id="mri-param-right"
        >
          SLICE_POS_Z: {sliceDepth}%
        </Typography>
        <Typography variant="caption" sx={{ position: 'absolute', bottom: 12, left: 16, fontFamily: 'monospace', fontSize: '9px', color: 'text.secondary', opacity: 0.6 }}>
          CON: {contrastValue.toFixed(2)}x
        </Typography>
        <Typography variant="caption" sx={{ position: 'absolute', bottom: 12, right: 16, fontFamily: 'monospace', fontSize: '9px', color: 'text.secondary', opacity: 0.6 }}>
          VOX: 0.9 x 0.9 x 0.9 mm
        </Typography>

        {/* Brain structures vectors */}
        <Box 
          sx={{
            position: 'relative',
            borderRadius: '50%',
            bgcolor: 'rgba(30,41,59,0.1)',
            transition: 'width 0.1s, height 0.1s',
            width: radius * 2,
            height: radius * 2,
            border: `2px solid rgba(255,255,255,${0.1 * contrastValue})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          id="brain-contour-root"
        >
          {/* Inner temporal lobe shapes */}
          <Box 
            sx={{
              position: 'absolute',
              borderRadius: '50%',
              border: '1.5px solid rgba(255,255,255,0.03)',
              width: radius * 1.3,
              height: radius * 0.9 * (1.1 - sliceDepth / 250),
              transform: 'rotate(-12deg)',
              background: 'radial-gradient(ellipse at center, rgba(30,41,59,0.3) 0%, rgba(15,23,42,0.9) 100%)'
            }}
          />

          {/* Symmetrical left/right ventricles */}
          <Box 
            sx={{
              position: 'absolute',
              width: radius * 0.4,
              height: radius * 0.3 + (sliceDepth % 15) * 0.4,
              left: radius * 0.42,
              top: radius * 0.68,
              borderRadius: '60% 40% 41% 41% / 60% 40% 60% 40%',
              bgcolor: '#090d16',
              boxShadow: 'inset 0 0 10px rgba(255,255,255,0.04)',
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}
          />
          <Box 
            sx={{
              position: 'absolute',
              width: radius * 0.4,
              height: radius * 0.3 + (sliceDepth % 15) * 0.4,
              right: radius * 0.42,
              top: radius * 0.68,
              borderRadius: '40% 60% 41% 41% / 40% 60% 40% 60%',
              bgcolor: '#090d16',
              boxShadow: 'inset 0 0 10px rgba(255,255,255,0.04)',
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}
          />

          {/* Symmetrical Left/Right Hippocampus nodes with AI heatmaps */}
          <Box 
            sx={{
              position: 'absolute',
              borderRadius: '50%',
              bgcolor: showHeatmap ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.03)',
              border: '1.5px solid',
              borderColor: showHeatmap ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255,255,255,0.08)',
              width: radius * 0.23,
              height: radius * 0.38,
              left: radius * 0.66,
              top: radius * 1.08,
              transform: 'rotate(-20deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {showHeatmap && <Box sx={{ width: '60%', height: '60%', bgcolor: 'rgba(239,68,68,0.3)', borderRadius: '50%', animation: 'ping 1.5s infinite opacity' }} />}
          </Box>

          <Box 
            sx={{
              position: 'absolute',
              borderRadius: '50%',
              bgcolor: showHeatmap ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.03)',
              border: '1.5px solid',
              borderColor: showHeatmap ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255,255,255,0.08)',
              width: radius * 0.23,
              height: radius * 0.38,
              right: radius * 0.66,
              top: radius * 1.08,
              transform: 'rotate(20deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {showHeatmap && <Box sx={{ width: '60%', height: '60%', bgcolor: 'rgba(239,68,68,0.3)', borderRadius: '50%', animation: 'ping 1.5s infinite opacity' }} />}
          </Box>

          {/* AI Volumetric heat map overlay */}
          {showHeatmap && (
            <Box 
              sx={{
                position: 'absolute',
                bgcolor: 'rgba(20,184,166,0.08)',
                border: '1px solid rgba(20,184,166,0.2)',
                borderRadius: 2,
                width: radius * 1.05,
                height: radius * 0.24,
                top: radius * 1.25,
                display: 'flex',
                boxShadow: '0 0 10px rgba(20,184,166,0.1)'
              }}
            />
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }} id="patient-profile-root">
      {/* Back Header panel */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: 1, 
          borderColor: 'divider',
          pb: 1.5 
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
          Back to Cohort List
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label="HIPAA COMPLIANT SECURE" size="small" variant="outlined" color="primary" sx={{ height: 20, fontSize: '9px', fontWeight: 'bold' }} />
          <Chip label="GPU ACCELERATION ACTIVE" size="small" variant="outlined" color="success" sx={{ height: 20, fontSize: '9px', fontWeight: 'bold' }} />
        </Box>
      </Box>

      {/* Main Container: Left Side demographic cards, Right Side Analyser Tabs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '4.5fr 7.5fr' }, gap: 3.5 }} id="profile-detailed-panels">
        
        {/* Left Side Demographics card column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="patient-demographic-column">
          {/* Demographic basic cards */}
          <Card variant="outlined" id="summary-badge-identity" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', tracking: '-0.02em', mb: 0.5 }}>
                    {demographics?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <UserIcon sx={{ fontSize: 13 }} />
                    MRN: <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'primary.main' }}>{demographics?.mrn}</Box>
                  </Typography>
                </Box>
                <Chip 
                  label={patient.riskCategory} 
                  color={patient.riskCategory === 'High' ? 'error' : patient.riskCategory === 'Moderate' ? 'warning' : 'success'} 
                  size="small" 
                  sx={{ fontWeight: 'bold', height: 22 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 2, fontSize: '12px' }} id="patient-metrics-demographic-list">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>SEX / GENDER</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{demographics?.sex}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>AGE</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{demographics?.age} Years</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>DATE OF BIRTH</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{demographics?.date_of_birth}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>EDUCATIONAL HISTORY</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{demographics?.educationYears} Formal Academic Years</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>TELEPHONE ENCRYPT</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '11px', fontFamily: 'monospace' }}>{demographics?.phone}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>SECURE SYSTEM EMAIL</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '11px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{demographics?.email}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Clinical history cards */}
          <Card variant="outlined" id="summary-badge-history" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1.5 }}>
                Clinical History & Symptoms
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }} id="clinical-history-bullet-panel">
                {/* Presenting symptoms */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.8, fontWeight: 'bold' }}>Active Presenting Symptoms</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }} id="symptom-tag-chips-pile">
                    {history?.symptoms.map((s, idx) => (
                      <Chip key={idx} label={s} size="small" variant="filled" sx={{ height: 20, fontSize: '10px', fontWeight: 'bold' }} />
                    ))}
                  </Box>
                </Box>

                {/* Hereditary family context */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 'bold' }}>Family Hereditary Dementia</Typography>
                  {history?.familyHistory?.dementiaCount && history.familyHistory.dementiaCount > 0 ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} id="family-relation-line">
                      <DnaIcon sx={{ fontSize: 13, color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {history?.familyHistory?.dementiaCount} diagnosed relatives ({history?.familyHistory?.alzheimersRelation?.join(', ')})
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">No family history reported</Typography>
                  )}
                </Box>

                {/* ApoE biomarker panel */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.8, fontWeight: 'bold' }}>ApoE Biomarkers & Risk Vectors</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }} id="risks-tag-chips-pile">
                    {history?.riskFactors.map((r, idx) => (
                      <Chip key={idx} label={r} size="small" variant="outlined" color="error" sx={{ height: 20, fontSize: '10px', fontWeight: 'bold' }} />
                    ))}
                  </Box>
                </Box>

                {/* Comorbidities */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.8, fontWeight: 'bold' }}>Registered Comorbidities</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }} id="comorbidities-tag-chips-pile">
                    {history?.comorbidities.map((c, idx) => (
                      <Chip key={idx} label={c} size="small" variant="outlined" sx={{ height: 20, fontSize: '10px', fontWeight: 'bold' }} />
                    ))}
                  </Box>
                </Box>

                {/* Active medications */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 'bold' }}>Admitted Medications</Typography>
                  <Box sx={{ pl: 1, borderLeft: 2, borderColor: 'primary.light' }} id="medications-review-list">
                    {history?.medications.map((m, idx) => (
                      <Typography key={idx} variant="caption" sx={{ display: 'block', fontWeight: 'bold', color: 'text.secondary' }}>
                        • {m}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right Side In-Depth Tab Panels */}
        <Box id="profile-assessment-tabs-container-wrapper">
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }} id="profile-assessment-tabs-container">
            {/* Tabs selector */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.01)' }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, val) => setActiveTab(val)} 
                variant="fullWidth"
                id="patient-tabs-navbar"
              >
                <Tab 
                  label="Cognitive assessments" 
                  value="clinical" 
                  icon={<FileTextIcon fontSize="small" />} 
                  iconPosition="start"
                  sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '12px' }}
                />
                <Tab 
                  label="Neuroimaging (MRI 3T)" 
                  value="imaging" 
                  icon={<BrainIcon fontSize="small" />} 
                  iconPosition="start"
                  sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '12px' }}
                />
                <Tab 
                  label="Explainable AI" 
                  value="ai" 
                  icon={<CpuIcon fontSize="small" />} 
                  iconPosition="start"
                  sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '12px' }}
                />
              </Tabs>
            </Box>

            {/* TAB CONTENTS CONTAINER */}
            <Box sx={{ p: { xs: 2, md: 3 } }}>

              {/* TAB 1: Cognitive Assessments */}
              {activeTab === 'clinical' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }} id="panel-clinical-cognitive-root">
                  {/* Cognitive Score Summary Cards */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }} id="clinical-scores-grid">
                    <Card variant="outlined" sx={{ bgcolor: theme.palette.mode === 'light' ? '#fcfcfc' : 'rgba(255,255,255,0.005)' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }} color="text.secondary">MMSE SCORE</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>{cognitive?.mmse.score} / 30</Typography>
                        <Chip 
                          label={cognitive?.mmse.status} 
                          color={cognitive?.mmse.status === 'Severe' ? 'error' : cognitive?.mmse.status === 'Mild Cognitive Impairment' ? 'warning' : 'success'} 
                          size="small" 
                          sx={{ mt: 1, height: 18, fontSize: '9px', fontWeight: 'bold' }}
                        />
                      </CardContent>
                    </Card>

                    <Card variant="outlined" sx={{ bgcolor: theme.palette.mode === 'light' ? '#fcfcfc' : 'rgba(255,255,255,0.005)' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }} color="text.secondary">MOCA SCORE</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>{cognitive?.moca.score} / 30</Typography>
                        <Chip 
                          label={cognitive?.moca.status} 
                          color={cognitive?.moca.status === 'Severe' ? 'error' : cognitive?.moca.status === 'Mild Cognitive Impairment' ? 'warning' : 'success'} 
                          size="small" 
                          sx={{ mt: 1, height: 18, fontSize: '9px', fontWeight: 'bold' }}
                        />
                      </CardContent>
                    </Card>

                    <Card variant="outlined" sx={{ bgcolor: theme.palette.mode === 'light' ? '#fcfcfc' : 'rgba(255,255,255,0.005)' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }} color="text.secondary">CDR CLINICAL RATING</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>{cognitive?.cdr.score} / 3.0</Typography>
                        <Chip 
                          label={cognitive?.cdr.status} 
                          color="info" 
                          size="small" 
                          sx={{ mt: 1, height: 18, fontSize: '9px', fontWeight: 'bold' }}
                        />
                      </CardContent>
                    </Card>
                  </Box>

                  {/* Cognitive score evolution line-chart */}
                  <Paper variant="outlined" id="historical-eval-trends-card" sx={{ p: 2.5, borderRadius: 2 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Historical Cognitive Trends</Typography>
                      <Typography variant="caption" color="text.secondary">Retrospective timeline mapping cognitive score evaluations (last 4 visits).</Typography>
                    </Box>

                    {/* Integrated Recharts Line chart */}
                    <Box sx={{ height: 260, width: '100%' }} id="cognitive-chart-inner">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={historySeries}
                          margin={{ top: 5, right: 15, left: -20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                          <XAxis dataKey="name" fontSize={10} stroke={theme.palette.text.secondary} />
                          <YAxis domain={[0, 30]} fontSize={10} stroke={theme.palette.text.secondary} />
                          <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: '6px', border: `1px solid ${theme.palette.divider}` }} />
                          <Legend wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} />
                          <Line type="monotone" dataKey="MMSE" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="MoCA" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="CDR" stroke="#f43f5e" strokeWidth={2.5} strokeDasharray="5 5" name="CDR Scale (x10)" dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Box>
              )}

              {/* TAB 2: Neuroimaging Modality Ingestion & Interactive Slices */}
              {activeTab === 'imaging' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }} id="panel-imaging-biomarkers-root">
                  {exam ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3.5 }} id="structural-imaging-inner-grid">
                      {/* Left: Interactive Slice slider structure */}
                      <Box>
                        <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }} id="interactive-slice-controller-card">
                          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Coronal Plane Reconstruction</Typography>
                          
                          {/* Inner interactive canvas */}
                          {renderInteractiveScan()}

                          {/* Depth slider controls */}
                          <Box sx={{ width: '100%', px: 1, mt: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }} color="text.secondary">
                              Positional Z-Slice: {sliceDepth}%
                            </Typography>
                            <Slider 
                              value={sliceDepth} 
                              onChange={(e, val) => setSliceDepth(val as number)}
                              size="small"
                              valueLabelDisplay="off"
                              min={10}
                              max={90}
                              sx={{ py: 1 }}
                              id="mri-slice-slider-field"
                            />
                            
                            <Box sx={{ mt: 1 }}>
                              <FormControlLabel
                                control={
                                  <Switch 
                                    checked={showHeatmap} 
                                    onChange={(e) => setShowHeatmap(e.target.checked)} 
                                    size="small" 
                                    id="mri-heatmap-toggle"
                                  />
                                }
                                label={<Typography variant="caption" sx={{ fontWeight: 'bold' }}>AI Volumetric Highlight Overlay (MONAI)</Typography>}
                              />
                            </Box>
                          </Box>
                        </Paper>
                      </Box>

                      {/* Right: Numerical brain volume findings columns */}
                      <Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }} id="imaging-calculations-columns">
                          {/* Biomarker details card */}
                          <Card variant="outlined" id="scan-raw-metrics">
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                              <Typography variant="caption" sx={{ fontWeight: 'bold' }} color="text.secondary">IMAGING MODALITY CONFIG</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'extrabold', mt: 1 }}>{exam.scanType} • {exam.scanDate}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                Slice: {exam.metadata.sliceThickness} • Field: {exam.metadata.magneticStrength || "3.0T Core"}
                              </Typography>
                            </CardContent>
                          </Card>

                          {/* Processing findings lists */}
                          {imagingAnalysis && (
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }} id="calculated-volumetrics-card">
                              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1.5 }} color="text.secondary">
                                AI CALCULATED REGIONAL VOLUMETRICS
                              </Typography>
                              
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }} id="volume-factors-list">
                                {/* Left Hippocampal Volume */}
                                <Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Left Hippocampal Volume</Typography>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{imagingAnalysis.hippocampalVolumeLeft} cm³</Typography>
                                  </Box>
                                  <LinearProgress variant="determinate" value={Math.min(100, (imagingAnalysis.hippocampalVolumeLeft / 4.5) * 100)} sx={{ height: 4, borderRadius: 1 }} color="primary" />
                                </Box>

                                {/* Right Hippocampal Volume */}
                                <Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Right Hippocampal Volume</Typography>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{imagingAnalysis.hippocampalVolumeRight} cm³</Typography>
                                  </Box>
                                  <LinearProgress variant="determinate" value={Math.min(100, (imagingAnalysis.hippocampalVolumeRight / 4.5) * 100)} sx={{ height: 4, borderRadius: 1 }} color="primary" />
                                </Box>

                                {/* Ventricular ratio */}
                                <Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Ventricular Enlargement Ratio</Typography>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{imagingAnalysis.ventricleEnlargementRatio.toFixed(3)}</Typography>
                                  </Box>
                                  <LinearProgress variant="determinate" value={Math.min(100, (imagingAnalysis.ventricleEnlargementRatio / 0.1) * 100)} sx={{ height: 4, borderRadius: 1 }} color="warning" />
                                </Box>

                                {/* Cortical depth average */}
                                <Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Avg Cortical Thickness</Typography>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{imagingAnalysis.corticalThicknessAvg} mm</Typography>
                                  </Box>
                                  <LinearProgress variant="determinate" value={Math.min(100, (imagingAnalysis.corticalThicknessAvg / 3) * 100)} sx={{ height: 4, borderRadius: 1 }} color="success" />
                                </Box>
                              </Box>
                            </Paper>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    /* In case there is no imaging, provide standard simulator / upload box */
                    <Paper 
                      variant="outlined" 
                      id="card-imaging-backlogs-uploader"
                      sx={{ 
                        p: 4, 
                        textAlign: 'center', 
                        bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.01)',
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 2
                      }}
                    >
                      {mriUploading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, maxWidth: 280, mx: 'auto' }} id="mri-uploader-running">
                          <CircularProgress />
                          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Simulating coronal structural slicing...</Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }} id="mri-uploader-idle">
                          <Box sx={{ p: 1.5, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: '50%', display: 'flex' }}>
                            <UploadIcon fontSize="large" />
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>MRI Scan Missing for this Patient Profile</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                            Upload high-field 3T coronal T1-weighted structural voxel sets (.nii or .nii.gz format) to initiate hippocampus volumetrics.
                          </Typography>
                          <Box sx={{ position: 'relative', mt: 1 }}>
                            <input
                              id="file-input-mri-upload"
                              type="file"
                              accept=".nii,.nii.gz"
                              ref={fileInputRef}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                await uploadMriAndPredict({
                                    patientId: patient.id,
                                    file,
                                    age: demographics?.age ?? patient.age,
                                    mmse: cognitive?.mmse.score ?? null,
                                    cdr: cognitive?.cdr.score ?? null,
                                    cdrtot: cognitive?.cdr.score ?? null,
                                });

                                e.target.value = '';
                             }}
                              style={{
                                position: 'absolute',
                                top: 0, right: 0, bottom: 0, left: 0,
                                opacity: 0,
                                cursor: 'pointer'
                              }}
                            />
                            
                            <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Choose Voxel Dataset
                            </Button>
                            {uploadError && (
                                <Alert severity="error" sx={{ maxWidth: 420 }}>
                                    {uploadError}
                                </Alert>
                                )}

                                {uploadedFile && !uploadError && (
                                <Alert severity="success" sx={{ maxWidth: 420 }}>
                                    MRI enviada com sucesso: {uploadedFile}. A aba AI Predictor foi atualizada com a prediction mais recente.
                                </Alert>
                            )}

                          </Box>
                          {uploadedFile && (
                            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                              ✓ Simulation Upload Successful: {uploadedFile}. Refresh page to re-run metrics.
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Paper>
                  )}
                </Box>
              )}

              {/* TAB 3: Explainable AI Analytics Panel */}
              {activeTab === 'ai' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }} id="panel-ai-explainability-root">
                  {/* Dynamic predictor gauge */}
                  {mergedAiAnalysis && (
                    <Paper 
                      variant="outlined" 
                      id="card-ai-risk-gauge"
                      sx={{ 
                        p: 2.5, 
                        borderRadius: 2, 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' }, 
                        alignItems: 'center', 
                        gap: 3,
                        borderColor: mergedAiAnalysis.riskCategory === 'High' ? 'error.light' : mergedAiAnalysis.riskCategory === 'Moderate' ? 'warning.light' : 'success.light',
                        bgcolor: mergedAiAnalysis.riskCategory === 'High' ? 'rgba(239, 68, 68, 0.02)' : mergedAiAnalysis.riskCategory === 'Moderate' ? 'rgba(245, 158, 11, 0.02)' : 'rgba(16, 185, 129, 0.02)'
                      }}
                    >
                      {/* Percent badge */}
                      <Box sx={{ position: 'relative', display: 'flex', shrink: 0 }}>
                        <CircularProgress 
                          variant="determinate" 
                          value={Math.round(mergedAiAnalysis.probability * 100)} 
                          size={72} 
                          thickness={5} 
                          color={mergedAiAnalysis.riskCategory === 'High' ? 'error' : mergedAiAnalysis.riskCategory === 'Moderate' ? 'warning' : 'success'} 
                        />
                        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'black' }}>
                            {Math.round(mergedAiAnalysis.probability * 100)}%
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'black', textTransform: 'uppercase', color: mergedAiAnalysis.riskCategory === 'High' ? 'error.main' : mergedAiAnalysis.riskCategory === 'Moderate' ? 'warning.main' : 'success.main' }}>
                          Prognosis Prediction: {mergedAiAnalysis.riskCategory} Risk AD
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, lineHeight: 1.4 }} color="text.secondary">
                          {mergedAiAnalysis.explainability.aiReasoningSummary}
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main', display: 'block', mt: 1, fontWeight: 'bold' }}>
                          Confidence Quotient: {(mergedAiAnalysis.confidenceScore * 100).toFixed(1)}% (PyTorch Attributions Calibrated)
                        </Typography>
                      </Box>
                    </Paper>
                  )}

                  {/* SHAP attributions bar chart and risk descriptors columns */}
                  {mergedAiAnalysis && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 1.1fr' }, gap: 3.5 }} id="ai-detailed-scoring-grid">
                      {/* SHAP Bar Chart */}
                      <Box>
                        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: '100%' }} id="shap-bar-chart-card">
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }} color="text.secondary">
                              VARIABLES INFLUENCE ATTRIBUTES
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }} color="text.secondary">
                              Primary variables pulling predicted risk up (+) or keeping risk levels baseline (-)
                            </Typography>
                          </Box>

                          <Box sx={{ height: 240, width: '100%', mt: 2 }} id="shap-chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={shapData}
                                layout="vertical"
                                margin={{ top: 2, right: 10, left: 10, bottom: 2 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke={theme.palette.divider} />
                                <XAxis type="number" stroke={theme.palette.text.secondary} fontSize={9} domain={[-20, 40]} />
                                <YAxis dataKey="name" type="category" stroke={theme.palette.text.primary} fontSize={9} width={100} />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#020617', 
                                    color: '#ffffff', 
                                    borderRadius: '6px', 
                                    border: 'none', 
                                    fontSize: '10px' 
                                  }} 
                                />
                                <ReferenceLine x={0} stroke={theme.palette.text.secondary} strokeWidth={1} />
                                <Bar dataKey="value" strokeWidth={1}>
                                  {shapData.map((entry, index) => {
                                    // Blue for protective factors (negative pull), Red for risk factors (positive pull)
                                    const fill = entry.value >= 0 ? '#f43f5e' : '#0ea5e9';
                                    return <Cell key={`cell-${index}`} fill={fill} />;
                                  })}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </Box>
                        </Paper>
                      </Box>

                      {/* Diagnostic Lists columns */}
                      <Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, height: '100%' }} id="clinical-factor-columns">
                          {/* Risk Drivers Card */}
                          <Paper 
                            variant="outlined" 
                            id="card-ai-risk-drivers"
                            sx={{ 
                              p: 2, 
                              borderRadius: 2, 
                              bgcolor: 'rgba(239, 68, 68, 0.03)', 
                              borderColor: 'rgba(239, 68, 68, 0.15)',
                              flexGrow: 1
                            }}
                          >
                            <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                              <Box sx={{ width: 6, height: 6, bgcolor: '#f43f5e', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                              High Risk Drivers Identified
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} id="risk-drivers-list">
                              {mergedAiAnalysis.explainability.keyRiskDrivers.map((driver, idx) => (
                                <Typography key={idx} variant="caption" sx={{ display: 'block', fontWeight: 'medium', color: theme.palette.mode === 'light' ? 'error.dark' : 'error.light' }}>
                                  • {driver}
                                </Typography>
                              ))}
                            </Box>
                          </Paper>

                          {/* Protective Factors Card */}
                          <Paper 
                            variant="outlined" 
                            id="card-ai-protective-drivers"
                            sx={{ 
                              p: 2, 
                              borderRadius: 2, 
                              bgcolor: 'rgba(16, 185, 129, 0.03)', 
                              borderColor: 'rgba(16, 185, 129, 0.15)',
                              flexGrow: 1
                            }}
                          >
                            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                              ⚡ Protective Factors Flagged
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} id="protective-drivers-list">
                              {mergedAiAnalysis.explainability.protectiveFactors.map((prot, idx) => (
                                <Typography key={idx} variant="caption" sx={{ display: 'block', fontWeight: 'medium', color: theme.palette.mode === 'light' ? 'success.dark' : 'success.light' }}>
                                  • {prot}
                                </Typography>
                              ))}
                            </Box>
                          </Paper>
                        </Box>
                      </Box>
                    </Box>
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
