/**
 * NeuroPredict AI - Clinical Workflow Ingestion Stepper styled with Material-UI
 */
import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  Checkbox, 
  FormControlLabel, 
  Stepper, 
  Step, 
  StepLabel, 
  LinearProgress, 
  Chip,
  Divider,
  Paper,
  InputLabel,
  FormControl,
  CircularProgress,
  useTheme
} from '@mui/material';
import { 
  ArrowBack as ArrowLeftIcon, 
  ArrowForward as ArrowRightIcon, 
  CheckCircle as CheckIcon, 
  MedicalServices as SymptomsIcon, 
  Person as DemographicIcon, 
  Psychology as AssessmentIcon, 
  Image as BrainIcon,
  Memory as ProcessorIcon,
  ListAlt as ReviewIcon,
  Add as AddIcon,
  Terminal as TerminalIcon,
  Security as GuardIcon
} from '@mui/icons-material';
import { ClinicalWorkflowProps } from '../../types';
import { useClinicalWorkflow } from '@/src/hooks/useClinicalWorkflow';

export default function ClinicalWorkflow({ onSave, isSaving, onCancel }: ClinicalWorkflowProps) {
  const theme = useTheme();

  // Load state and logic out of presenter
  const {
    step,
    setStep,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    age,
    setAge,
    gender,
    setGender,
    dob,
    setDob,
    mrn,
    educationYears,
    setEducationYears,
    symptomsInput,
    setSymptomsInput,
    symptomsList,
    addSymptom,
    removeSymptom,
    selectedRiskFactors,
    toggleRiskFactor,
    selectedComorbidities,
    toggleComorbidity,
    medicationsInput,
    setMedicationsInput,
    medicationsList,
    addMedication,
    removeMedication,
    mmseScore,
    setMmseScore,
    mocaScore,
    setMocaScore,
    cdrScore,
    setCdrScore,
    scanType,
    setScanType,
    scanDate,
    setScanDate,
    radiologistNotes,
    setRadiologistNotes,
    customFileUploaded,
    setCustomFileUploaded,
    simulationPercentage,
    simulationRunning,
    terminalLogs,
    runAIPipeline,
    submitWorkflow,
  } = useClinicalWorkflow(onSave);

  // Labels & Icons for stepper
  const stepsMetadata = [
    { label: 'Patient Demographics' },
    { label: 'Clinical History' },
    { label: 'Cognitive Assessments' },
    { label: 'Neuroimaging Metadata' },
    { label: 'AI Processor Request' },
    { label: 'Confirm Results' }
  ];

  return (
    <Paper variant="outlined" id="workflow-wizard-wrapper" sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header Panel */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: 1, 
          borderColor: 'divider',
          pb: 2 
        }} 
        id="workflow-header-panel"
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Active Patient Acquisition Intake</Typography>
          <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">Guided multimodality data ingestion matching HIPAA rules.</Typography>
        </Box>
        <Button 
          variant="outlined" 
          color="inherit" 
          size="small" 
          onClick={onCancel}
          id="btn-cancel-acquisition"
          sx={{ fontSize: '11px', textTransform: 'none', fontWeight: 'bold', borderColor: 'divider' }}
        >
          Abandon Evaluation
        </Button>
      </Box>

      {/* Stepper Wizard Progress Indicators */}
      <Box id="workflow-progress-stepper" sx={{ width: '100%', py: 1 }}>
        <Stepper activeStep={step - 1} alternativeLabel={true}>
          {stepsMetadata.map((meta, index) => (
            <Step key={index}>
              <StepLabel 
                slotProps={{
                  stepIcon: {
                    sx: {
                      color: index + 1 === step ? 'primary.main' : index + 1 < step ? '#10b981' : 'divider'
                    }
                  }
                }}
              >
                <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: index + 1 === step ? 'bold' : 'normal' }}>
                  {meta.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* STEP 1: Demographics Ingestion */}
      {step === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="workflow-step-one">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
            <DemographicIcon sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Step 1: Patient Demographic Variables</Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }} id="demographics-form-fields">
            <TextField 
              required
              id="input-first-name" 
              label="FIRST NAME" 
              variant="outlined" 
              fullWidth 
              size="small"
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Arthur"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField 
              required
              id="input-last-name" 
              label="LAST NAME" 
              variant="outlined" 
              fullWidth 
              size="small"
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Pendelton"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField 
              id="input-age" 
              label="AGE (YEARS)" 
              type="number" 
              variant="outlined" 
              fullWidth 
              size="small"
              value={age} 
              onChange={(e) => setAge(Math.max(1, parseInt(e.target.value) || 0))}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <FormControl fullWidth size="small">
              <InputLabel id="select-gender-label">BIOLOGICAL GENDER</InputLabel>
              <Select
                labelId="select-gender-label"
                id="select-gender"
                value={gender}
                label="BIOLOGICAL GENDER"
                onChange={(e: any) => setGender(e.target.value)}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField 
              id="input-dob" 
              label="DATE OF BIRTH" 
              type="date" 
              variant="outlined" 
              fullWidth 
              size="small"
              value={dob} 
              onChange={(e) => setDob(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField 
              id="input-education" 
              label="FORMAL EDUCATION YEARS" 
              type="number" 
              variant="outlined" 
              fullWidth 
              size="small"
              value={educationYears} 
              onChange={(e) => setEducationYears(Math.max(0, parseInt(e.target.value) || 0))}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        </Box>
      )}

      {/* STEP 2: Clinical Symptoms & History Ingestion */}
      {step === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="workflow-step-two">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
            <SymptomsIcon sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Step 2: Medical Symptoms & Risk Profilers</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }} id="clinical-history-form">
            {/* Presenting Symptoms Tags list */}
            <Box id="wrapper-symptoms-input-block">
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
                PRESENTING SYMPTOMS
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <TextField 
                  fullWidth 
                  size="small" 
                  placeholder="e.g. Mild word retrieval delays, subjective short term recall deficits"
                  value={symptomsInput} 
                  id="input-symptom-tag"
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSymptom())}
                />
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={addSymptom}
                  startIcon={<AddIcon />}
                  id="btn-add-symptom"
                  sx={{ shrink: 0 }}
                >
                  Add
                </Button>
              </Box>
              
              {symptomsList.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }} id="added-symptoms-chips">
                  {symptomsList.map((tag, i) => (
                    <Chip 
                      key={i} 
                      label={tag} 
                      size="small" 
                      onDelete={() => removeSymptom(i)}
                      id={`btn-del-symptom-${i}`}
                      sx={{ fontWeight: 'bold' }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Heredity Risk Biomarkers / Comorbidities CSS Grid Box */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3.5 }} id="history-checkbox-grid">
              <Paper variant="outlined" sx={{ p: 2, bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.01)' }} id="card-genetic-selections">
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: '800', mb: 1.5 }}>
                  APOE BIOMARKER & GENETIC CHARACTERISTICS
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {[
                    "ApoE4 positive (ε3/ε4)",
                    "ApoE4 positive (ε4/ε4)",
                    "Family history of early onset AD",
                    "Sedentary lifestyle habits"
                  ].map(f => (
                    <FormControlLabel
                      key={f}
                      control={<Checkbox size="small" checked={selectedRiskFactors.includes(f)} onChange={() => toggleRiskFactor(f)} />}
                      label={<Typography variant="body2">{f}</Typography>}
                    />
                  ))}
                </Box>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.01)' }} id="card-comorbidities-selections">
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: '800', mb: 1.5 }}>
                  GLOBAL COMORBIDITIES
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {[
                    "Hypertension",
                    "Type 2 Diabetes mellitus",
                    "Hypercholesterolemia",
                    "Chronic Kidney Disease"
                  ].map(c => (
                    <FormControlLabel
                      key={c}
                      control={<Checkbox size="small" checked={selectedComorbidities.includes(c)} onChange={() => toggleComorbidity(c)} />}
                      label={<Typography variant="body2">{c}</Typography>}
                    />
                  ))}
                </Box>
              </Paper>
            </Box>

            {/* Prescribed Medications tag list */}
            <Box id="wrapper-medications-input-block">
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
                PRESCRIBED MEDICATIONS
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <TextField 
                  fullWidth 
                  size="small" 
                  placeholder="e.g. Donepezil 10mg once daily at bedtime"
                  value={medicationsInput} 
                  id="input-med-tag"
                  onChange={(e) => setMedicationsInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
                />
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={addMedication}
                  startIcon={<AddIcon />}
                  id="btn-add-medication"
                  sx={{ shrink: 0 }}
                >
                  Add
                </Button>
              </Box>
              
              {medicationsList.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }} id="added-meds-chips">
                  {medicationsList.map((tag, i) => (
                    <Chip 
                      key={i} 
                      label={tag} 
                      size="small" 
                      onDelete={() => removeMedication(i)}
                      id={`btn-del-med-${i}`}
                      sx={{ fontWeight: 'bold' }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* STEP 3: Cognitive Tests Scores */}
      {step === 3 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="workflow-step-three">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
            <AssessmentIcon sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Step 3: Quantitative Cognitive Assessments</Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3.5 }} id="cognitive-scales-fields">
            {/* MMSE Card */}
            <Card variant="outlined" id="input-range-mmse">
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>MMSE SCORE</Typography>
                  <Chip label="Scale: 0-30" size="small" variant="filled" sx={{ height: 18, fontSize: '9px', fontWeight: 'bold' }} />
                </Box>
                <TextField 
                  type="number" 
                  fullWidth 
                  size="small"
                  value={mmseScore} 
                  id="score-mmse"
                  onChange={(e) => setMmseScore(Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))}
                  slotProps={{ htmlInput: { min: 0, max: 30 } }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, lineHeight: 1.4 }}>
                  Mini-Mental State Exam. Baseline standards classify index scores &lt;24 as symptomatic deficits.
                </Typography>
              </CardContent>
            </Card>

            {/* MOCA Card */}
            <Card variant="outlined" id="input-range-moca">
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>MOCA SCORE</Typography>
                  <Chip label="Scale: 0-30" size="small" variant="filled" sx={{ height: 18, fontSize: '9px', fontWeight: 'bold' }} />
                </Box>
                <TextField 
                  type="number" 
                  fullWidth 
                  size="small"
                  value={mocaScore} 
                  id="score-moca"
                  onChange={(e) => setMocaScore(Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))}
                  slotProps={{ htmlInput: { min: 0, max: 30 } }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, lineHeight: 1.4 }}>
                  Montreal Cognitive Assessment. Highly responsive to initial executive latencies & working memory.
                </Typography>
              </CardContent>
            </Card>

            {/* CDR Card */}
            <Card variant="outlined" id="input-range-cdr">
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>CDR SCORE INDEX</Typography>
                  <Chip label="Scale: 0-3" size="small" variant="filled" sx={{ height: 18, fontSize: '9px', fontWeight: 'bold' }} />
                </Box>
                <FormControl fullWidth size="small">
                  <Select
                    id="score-cdr"
                    value={cdrScore}
                    onChange={(e: any) => setCdrScore(parseFloat(e.target.value))}
                  >
                    <MenuItem value="0">0.0 (Normal)</MenuItem>
                    <MenuItem value="0.5">0.5 (Very Mild / Prodromal)</MenuItem>
                    <MenuItem value="1">1.0 (Mild Dementia)</MenuItem>
                    <MenuItem value="2">2.0 (Moderate Dementia)</MenuItem>
                    <MenuItem value="3">3.0 (Severe Dementia)</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, lineHeight: 1.4 }}>
                  Clinical Dementia Rating. Sourced via caregiver semi-structured interviews evaluating memory & orientation.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* STEP 4: Neuroimaging Modality Ingestion */}
      {step === 4 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="workflow-step-four">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
            <BrainIcon sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Step 4: Neuroimaging Modality & Radiologist Records</Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }} id="mri-details-formfields">
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="select-scan-type-label">IMAGE METRICS TYPE</InputLabel>
                <Select
                  labelId="select-scan-type-label"
                  id="select-scan-type"
                  value={scanType}
                  label="IMAGE METRICS TYPE"
                  onChange={(e: any) => setScanType(e.target.value)}
                >
                  <MenuItem value="MRI 3T">MRI 3.0 Tesla Structural Scan</MenuItem>
                  <MenuItem value="PET-FDG">PET Scan (FDG Metabolic Marker)</MenuItem>
                  <MenuItem value="CT Scan">CT Scan Computed Tomography</MenuItem>
                </Select>
              </FormControl>

              <TextField 
                id="imaging-scan-date" 
                label="SCAN ACQUISITION DATE" 
                type="date" 
                variant="outlined" 
                fullWidth 
                size="small"
                value={scanDate} 
                onChange={(e) => setScanDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>

            <TextField 
              id="textarea-radiologist-notes" 
              label="RADIOLOGIST FINDINGS & CLINICAL NOTES" 
              variant="outlined" 
              fullWidth 
              multiline
              rows={4}
              value={radiologistNotes} 
              onChange={(e) => setRadiologistNotes(e.target.value)}
              placeholder="Declare initial structural findings here..."
              slotProps={{ inputLabel: { shrink: true } }}
            />

            {/* Custom file uploader style */}
            <Box 
              sx={{ 
                border: '2px dashed', 
                borderColor: 'divider', 
                borderRadius: 2, 
                p: 4, 
                textAlign: 'center', 
                position: 'relative', 
                bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.01)',
                '&:hover': { borderColor: 'primary.main' }
              }} 
              id="wizard-mri-dropzone"
            >
              <input
                id="wizard-mri-inner-input"
                type="file"
                accept=".nii,.nii.gz,.dcm"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setCustomFileUploaded(e.target.files[0].name);
                  }
                }}
                style={{
                  position: 'absolute',
                  top: 0, right: 0, bottom: 0, left: 0,
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {customFileUploaded ? `✓ Attached File: ${customFileUploaded}` : "Browse MRI Voxel Datasets (Optional)"}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Accepts DICOM folders, NIfTI structural formats (.nii.gz)
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* STEP 5: AI Processor Simulation and Intermediary Terminal Loggers */}
      {step === 5 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="workflow-step-five">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
            <ProcessorIcon sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Step 5: Explainable AI Pipeline Trigger</Typography>
          </Box>

          <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.01)' }} id="ai-processor-action-zone">
            {simulationRunning ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, maxWidth: 360, mx: 'auto' }} id="processor-running-block">
                <CircularProgress color="primary" />
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Processing voxel layers & clinical weights...</Typography>
                
                <Box sx={{ width: '100%' }}>
                  <LinearProgress variant="determinate" value={simulationPercentage} sx={{ height: 6, borderRadius: 2 }} />
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block', mt: 1, fontWeight: 'bold' }}>
                    {simulationPercentage}% Compiled
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }} id="processor-idle-block">
                <Box sx={{ p: 1.5, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: '50%', display: 'flex' }}>
                  <ProcessorIcon fontSize="large" />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'extrabold' }}>Request Alzheimer's Prognostic Alignment</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                  By clicking below, you submit this multimodality intake file comprising demographics, clinical records, and voxel configurations to central PyTorch predictors. This outputs SHAP factors.
                </Typography>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={runAIPipeline}
                  id="btn-run-diagnostic-pipeline"
                  sx={{ mt: 1 }}
                >
                  Confirm and Run Diagnostic Core (PyTorch + MONAI)
                </Button>
              </Box>
            )}

            {/* Simulated Live PyTorch logs */}
            {terminalLogs.length > 0 && (
              <Paper 
                variant="elevation" 
                elevation={3} 
                sx={{ 
                  mt: 4, 
                  bgcolor: '#020617', 
                  color: '#94a3b8', 
                  p: 2.5, 
                  borderRadius: 2, 
                  textAlign: 'left',
                  border: '1.5px solid #1e293b'
                }} 
                id="pipeline-terminal-box"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #1e293b', pb: 1, mb: 1, color: '#38bdf8' }}>
                  <TerminalIcon fontSize="small" />
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>PYTORCH INTERMEDIARY TERMINAL</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, fontFamily: 'monospace', fontSize: '11px' }}>
                  {terminalLogs.map((log, i) => (
                    <Typography key={i} variant="caption" sx={{ fontFamily: 'sans-serif', fontSize: '10px', color: '#cbd5e1' }}>
                      {log}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            )}
          </Paper>
        </Box>
      )}

      {/* STEP 6: Results Confirmation & Local Synchronization */}
      {step === 6 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} id="workflow-step-six">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
            <CheckIcon sx={{ color: 'success.main' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Step 6: Confirm Results & Commit Demographics</Typography>
          </Box>

          <Paper variant="outlined" sx={{ p: 4, bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.01)' }} id="results-review-dashboard">
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1.1fr' }, gap: 3 }} id="review-metrics-split">
              <Box>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'text.secondary' }}>
                  SUBJECT DEMOGRAPHICS
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: '900', mt: 1 }}>
                  {firstName} {lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Born {dob} ({age} years old selection) • {gender}
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main', fontWeight: 'bold', display: 'block', mt: 0.5 }}>
                  {mrn}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'text.secondary' }}>
                  COGNITIVE INDEX
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, mt: 1 }} id="review-cognitive-values">
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>MMSE:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{mmseScore} / 30</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>MoCA:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{mocaScore} / 30</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>CDR Index:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{cdrScore} / 3.0</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Notification summary card */}
            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3, mt: 3 }} id="review-risk-projection-card">
              <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 1.5 }}>
                SIMULATED CLINICAL REPORT INSIGHT
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, borderColor: 'success.light', bgcolor: 'rgba(16, 185, 129, 0.05)' }}>
                <GuardIcon sx={{ color: 'success.main', mt: 0.25 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: '950', color: theme.palette.mode === 'light' ? 'success.dark' : 'success.light' }}>
                    Pipeline Execution Complete
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, lineHeight: 1.4, color: 'text.primary' }}>
                    This profile compiles correctly following all department criteria. Retrospective analysis can be re-run at any time. Click Save File to commit to central registrar databases.
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Stepper Wizard Navigation Actions */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderTop: 1, 
          borderColor: 'divider', 
          pt: 3 
        }} 
        id="workflow-nav-footer"
      >
        {step > 1 && step < 5 ? (
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={() => setStep(step - 1)}
            startIcon={<ArrowLeftIcon />}
            id="btn-step-prev"
            sx={{ fontWeight: 'bold', borderColor: 'divider' }}
          >
            Previous Step
          </Button>
        ) : <Box />}

        {step < 5 ? (
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => setStep(step + 1)}
            endIcon={<ArrowRightIcon />}
            id="btn-step-next"
            sx={{ fontWeight: 'bold' }}
          >
            Next Segment
          </Button>
        ) : step === 6 ? (
          <Button 
            variant="contained" 
            color="success" 
            disabled={isSaving}
            onClick={submitWorkflow}
            id="btn-save-evaluation"
            sx={{ fontWeight: 'black', color: '#ffffff' }}
          >
            {isSaving ? "Syncing Workspace..." : "Commit and Save Patient"}
          </Button>
        ) : <Box />}
      </Box>
    </Paper>
  );
}
