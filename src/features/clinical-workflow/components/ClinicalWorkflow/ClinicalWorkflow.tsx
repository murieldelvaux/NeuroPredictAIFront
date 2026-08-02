import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { ClinicalWorkflowProps } from '../../types';
import { useClinicalWorkflow } from '../../hooks/useClinicalWorkflow';
import { useDemographicsForm } from '../../hooks/useDemographicsForm';
import { useClinicalHistoryForm } from '../../hooks/useClinicalHistoryForm';
import { useCognitiveTestsForm } from '../../hooks/useCognitiveTestsForm';
import { useImagingForm } from '../../hooks/useImagingForm';
import { useWorkflowSubmit } from '../../hooks/useWorkflowSubmit';
import StepIndicator from '../shared/StepIndicator/StepIndicator';
import WorkflowActions from '../shared/WorkflowActions/WorkflowActions';
import PatientInfoStep from '../steps/PatientInfoStep/PatientInfoStep';
import ClinicalDataStep from '../steps/ClinicalDataStep/ClinicalDataStep';
import ComorbiditiesStep from '../steps/ComorbiditiesStep/ComorbiditiesStep';
import MRIUploadStep from '../steps/MRIUploadStep/MRIUploadStep';
import AIAnalysisStep from '../steps/AIAnalysisStep/AIAnalysisStep';
import WorkflowReviewStep from '../steps/WorkflowReviewStep/WorkflowReviewStep';

const stepsMetadata = [{ label: 'Dados demográficos' }, { label: 'Dados clínicos' }, { label: 'Comorbidades' }, { label: 'MRI' }, { label: 'IA' }, { label: 'Confirmar resultados' }];

export default function ClinicalWorkflow({ onComplete, onError, onCancel }: ClinicalWorkflowProps) {
  const navigation = useClinicalWorkflow();
  const demographics = useDemographicsForm();
  const history = useClinicalHistoryForm();
  const cognitive = useCognitiveTestsForm();
  const imaging = useImagingForm();

  const submit = useWorkflowSubmit({
    step: navigation.step,
    goToStep: navigation.goToStep,
    firstName: demographics.firstName,
    lastName: demographics.lastName,
    age: demographics.age,
    sex: demographics.sex,
    dateOfBirth: demographics.dateOfBirth,
    educationYears: demographics.educationYears,
    symptomsList: history.symptomsList,
    hasFamilyHistory: history.hasFamilyHistory,
    selectedRiskFactors: history.selectedRiskFactors,
    selectedComorbidities: history.selectedComorbidities,
    medicationsList: history.medicationsList,
    mmseScore: cognitive.mmseScore,
    mocaScore: cognitive.mocaScore,
    cdrScore: cognitive.cdrScore,
    cdrtotScore: cognitive.cdrtotScore,
    customFileUploaded: imaging.customFileUploaded,
    onComplete,
    onError,
  });

  const stepContent = navigation.step === 1
    ? <PatientInfoStep firstName={demographics.firstName} lastName={demographics.lastName} age={demographics.age} sex={demographics.sex} dateOfBirth={demographics.dateOfBirth} educationYears={demographics.educationYears} onFirstNameChange={demographics.setFirstName} onLastNameChange={demographics.setLastName} onAgeChange={demographics.setAge} onSexChange={demographics.setSex} onDateOfBirthChange={demographics.setDateOfBirth} onEducationYearsChange={demographics.setEducationYears} />
    : navigation.step === 2
      ? <ClinicalDataStep mmseScore={cognitive.mmseScore} mocaScore={cognitive.mocaScore} cdrScore={cognitive.cdrScore} cdrtotScore={cognitive.cdrtotScore} onMmseChange={cognitive.setMmseScore} onMocaChange={cognitive.setMocaScore} onCdrChange={cognitive.setCdrScore} onCdrtotChange={cognitive.setCdrtotScore} />
      : navigation.step === 3
        ? <ComorbiditiesStep symptomsInput={history.symptomsInput} symptomsList={history.symptomsList} selectedRiskFactors={history.selectedRiskFactors} selectedComorbidities={history.selectedComorbidities} medicationsInput={history.medicationsInput} medicationsList={history.medicationsList} hasFamilyHistory={history.hasFamilyHistory} familyRelation={history.familyRelation} dementiaCount={history.dementiaCount} onSymptomsInputChange={history.setSymptomsInput} onAddSymptom={history.addSymptom} onRemoveSymptom={history.removeSymptom} onToggleRiskFactor={history.toggleRiskFactor} onToggleComorbidity={history.toggleComorbidity} onMedicationsInputChange={history.setMedicationsInput} onAddMedication={history.addMedication} onRemoveMedication={history.removeMedication} onHasFamilyHistoryChange={history.setHasFamilyHistory} onFamilyRelationChange={history.setFamilyRelation} onDementiaCountChange={history.setDementiaCount} />
        : navigation.step === 4
          ? <MRIUploadStep scanType={imaging.scanType} scanDate={imaging.scanDate} radiologistNotes={imaging.radiologistNotes} customFileUploaded={imaging.customFileUploaded} onScanTypeChange={imaging.setScanType} onScanDateChange={imaging.setScanDate} onRadiologistNotesChange={imaging.setRadiologistNotes} onCustomFileChange={imaging.setCustomFileUploaded} />
          : navigation.step === 5
            ? <AIAnalysisStep simulationRunning={submit.simulationRunning} simulationPercentage={submit.simulationPercentage} terminalLogs={submit.terminalLogs} />
            : navigation.step === 6
              ? <WorkflowReviewStep firstName={demographics.firstName} lastName={demographics.lastName} dateOfBirth={demographics.dateOfBirth} age={demographics.age} sex={demographics.sex} mrn={demographics.mrn} mmseScore={cognitive.mmseScore} mocaScore={cognitive.mocaScore} cdrScore={cognitive.cdrScore} />
              : null;

  const primaryLabel = navigation.step === 4 ? 'Salvar' : navigation.step === 5 ? 'Executar IA' : navigation.step === 6 ? 'Concluir' : 'Próxima etapa';
  const primaryColor = navigation.step === 4 || navigation.step === 6 ? 'success' : 'secondary';
  const handlePrimaryAction = navigation.step === 5 ? submit.runAIPipeline : navigation.step === 6 ? submit.submitWorkflow : submit.handleNextStep;

  return (
    <Paper variant="outlined" id="workflow-wizard-wrapper" sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', pb: 2 }} id="workflow-header-panel">
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Entrada ativa de aquisição do paciente</Typography>
          <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">Fluxo guiado de ingestão multimodal em conformidade com as regras de privacidade.</Typography>
        </Box>
        <Button variant="outlined" color="inherit" size="small" onClick={onCancel} id="btn-cancel-acquisition" sx={{ fontSize: '11px', textTransform: 'none', fontWeight: 'bold', borderColor: 'divider' }}>
          Abandonar avaliação
        </Button>
      </Box>

      <StepIndicator currentStep={navigation.step} steps={stepsMetadata} />
      {stepContent}
      <WorkflowActions
        currentStep={navigation.step}
        isWorkflowBusy={submit.isWorkflowBusy}
        canGoBack={navigation.step > 1}
        primaryLabel={primaryLabel}
        primaryColor={primaryColor}
        onBack={() => navigation.goToStep(navigation.step - 1)}
        onPrimaryAction={handlePrimaryAction}
      />
    </Paper>
  );
}