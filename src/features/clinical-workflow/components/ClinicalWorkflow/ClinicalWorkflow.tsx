import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { ClinicalWorkflowProps } from '../../types';
import { useClinicalWorkflow } from '@/src/hooks/useClinicalWorkflow';
import StepIndicator from '../shared/StepIndicator/StepIndicator';
import WorkflowActions from '../shared/WorkflowActions/WorkflowActions';
import PatientInfoStep from '../steps/PatientInfoStep/PatientInfoStep';
import ClinicalDataStep from '../steps/ClinicalDataStep/ClinicalDataStep';
import ComorbiditiesStep from '../steps/ComorbiditiesStep/ComorbiditiesStep';
import MRIUploadStep from '../steps/MRIUploadStep/MRIUploadStep';
import AIAnalysisStep from '../steps/AIAnalysisStep/AIAnalysisStep';
import WorkflowReviewStep from '../steps/WorkflowReviewStep/WorkflowReviewStep';

const stepsMetadata = [
  { label: 'Dados demográficos' },
  { label: 'Dados clínicos' },
  { label: 'Comorbidades' },
  { label: 'MRI' },
  { label: 'IA' },
  { label: 'Confirmar resultados' },
];

export default function ClinicalWorkflow({ onComplete, onError, onCancel }: ClinicalWorkflowProps) {
  const workflow = useClinicalWorkflow({ onComplete, onError });

  const renderStep = () => {
    switch (workflow.step) {
      case 1:
        return <PatientInfoStep firstName={workflow.firstName} lastName={workflow.lastName} age={workflow.age} sex={workflow.sex} dateOfBirth={workflow.date_of_birth} onFirstNameChange={workflow.setFirstName} onLastNameChange={workflow.setLastName} onAgeChange={workflow.setAge} onSexChange={workflow.setSex} onDateOfBirthChange={workflow.setDateOfBirth} />;
      case 2:
        return <ClinicalDataStep educationYears={workflow.educationYears} mmseScore={workflow.mmseScore} mocaScore={workflow.mocaScore} cdrScore={workflow.cdrScore} cdrtotScore={workflow.cdrtotScore} onEducationYearsChange={workflow.setEducationYears} onMmseChange={workflow.setMmseScore} onMocaChange={workflow.setMocaScore} onCdrChange={workflow.setCdrScore} onCdrtotChange={workflow.setCdrtotScore} />;
      case 3:
        return <ComorbiditiesStep symptomsInput={workflow.symptomsInput} symptomsList={workflow.symptomsList} selectedRiskFactors={workflow.selectedRiskFactors} selectedComorbidities={workflow.selectedComorbidities} medicationsInput={workflow.medicationsInput} medicationsList={workflow.medicationsList} hasFamilyHistory={workflow.hasFamilyHistory} familyRelation={workflow.familyRelation} dementiaCount={workflow.dementiaCount} onSymptomsInputChange={workflow.setSymptomsInput} onAddSymptom={workflow.addSymptom} onRemoveSymptom={workflow.removeSymptom} onToggleRiskFactor={workflow.toggleRiskFactor} onToggleComorbidity={workflow.toggleComorbidity} onMedicationsInputChange={workflow.setMedicationsInput} onAddMedication={workflow.addMedication} onRemoveMedication={workflow.removeMedication} onHasFamilyHistoryChange={workflow.setHasFamilyHistory} onFamilyRelationChange={workflow.setFamilyRelation} onDementiaCountChange={workflow.setDementiaCount} />;
      case 4:
        return <MRIUploadStep scanType={workflow.scanType} scanDate={workflow.scanDate} radiologistNotes={workflow.radiologistNotes} customFileUploaded={workflow.customFileUploaded} onScanTypeChange={workflow.setScanType} onScanDateChange={workflow.setScanDate} onRadiologistNotesChange={workflow.setRadiologistNotes} onCustomFileChange={workflow.setCustomFileUploaded} />;
      case 5:
        return <AIAnalysisStep simulationRunning={workflow.simulationRunning} simulationPercentage={workflow.simulationPercentage} terminalLogs={workflow.terminalLogs} />;
      case 6:
        return <WorkflowReviewStep firstName={workflow.firstName} lastName={workflow.lastName} dateOfBirth={workflow.date_of_birth} age={workflow.age} sex={workflow.sex} mrn={workflow.mrn} mmseScore={workflow.mmseScore} mocaScore={workflow.mocaScore} cdrScore={workflow.cdrScore} />;
      default:
        return null;
    }
  };

  const primaryLabel = workflow.step === 4 ? 'Salvar' : workflow.step === 5 ? 'Executar IA' : workflow.step === 6 ? 'Concluir' : 'Próxima etapa';
  const primaryColor = workflow.step === 4 || workflow.step === 6 ? 'success' : 'secondary';
  const handlePrimaryAction = workflow.step === 5 ? workflow.runAIPipeline : workflow.step === 6 ? workflow.submitWorkflow : workflow.handleNextStep;

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

      <StepIndicator currentStep={workflow.step} steps={stepsMetadata} />
      {renderStep()}
      <WorkflowActions currentStep={workflow.step} isWorkflowBusy={workflow.isWorkflowBusy} canGoBack={workflow.step > 1} primaryLabel={primaryLabel} primaryColor={primaryColor} onBack={() => workflow.setStep(workflow.step - 1)} onPrimaryAction={handlePrimaryAction} />
    </Paper>
  );
}