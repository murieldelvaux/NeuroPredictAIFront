/**
 * NeuroPredict AI - Component Props / View Model Typings
 */
import React from 'react';
import { 
  Patient, 
  PatientDemographics, 
  ClinicalHistory, 
  CognitiveEvaluation, 
  ImagingExam, 
  ImagingAnalysisResult, 
  AIAnalysisResult 
} from './index';

export interface LayoutProps {
  children: React.ReactNode;
  activeView: 'dashboard' | 'profile' | 'workflow';
  onNavigate: (view: 'dashboard' | 'profile' | 'workflow') => void;
  selectedPatientName?: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export interface DoctorDashboardProps {
  patients: Patient[];
  isLoading: boolean;
  onSelectPatient: (id: string) => void;
  onStartWorkflow: () => void;
}

export interface ClinicalWorkflowProps {
  onSave: (data: {
    demographics: Omit<PatientDemographics, 'id'>;
    history: ClinicalHistory;
    cognitive: { mmse: number; moca: number; cdr: number };
    imaging?: { scanType: string; scanDate: string; radiologistNotes: string; fileUploaded?: string };
  }) => void;
  isSaving: boolean;
  onCancel: () => void;
}

export interface PatientProfileProps {
  patientRecord: {
    patient: Patient;
    demographics: PatientDemographics;
    history: ClinicalHistory;
    cognitive: CognitiveEvaluation;
    exam?: ImagingExam;
    imagingAnalysis?: ImagingAnalysisResult;
    aiAnalysis?: AIAnalysisResult;
  };
  onBack: () => void;
}
