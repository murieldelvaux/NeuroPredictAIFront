/**
 * NeuroPredict AI - Clinical Workspace Root
 */
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import DoctorDashboard from './components/DoctorDashboard';
import PatientProfile from './components/PatientProfile';
import ClinicalWorkflow from './components/ClinicalWorkflow';
import { usePatients, usePatient, useCreatePatient } from './hooks/useMedicalQueries';
import { 
  ShieldAlert, 
  Sparkles, 
  X, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

// Create solid query orchestrator
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  }
});

function WorkspaceRoot() {
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
    >
      {/* Toast Alert popups bar */}
      {toastMessage && (
        <div 
          className={`mb-6 p-4.5 rounded-xl border flex items-center justify-between shadow-xs transition-all animate-fade-in ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
              : toastMessage.type === 'error'
                ? 'bg-rose-50 border-rose-100 text-rose-800'
                : 'bg-indigo-50 border-indigo-100 text-indigo-800'
          }`}
          id="toast-notifications-banner"
        >
          <div className="flex items-center space-x-3 text-xs font-semibold">
            {toastMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <p>{toastMessage.text}</p>
          </div>
          <button 
            id="btn-close-toast" 
            onClick={() => setToastMessage(null)} 
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* RENDER VIEW SCREEN */}
      <div className="transition-all duration-300" id="main-view-container">
        
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
          <div>
            {detailLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4" id="profile-detailed-loading">
                <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-slate-400 font-mono text-xs font-semibold">Recalculating feature importance gradients...</span>
              </div>
            ) : activeDetail ? (
              <PatientProfile 
                patientRecord={activeDetail} 
                onBack={() => setActiveView('dashboard')}
              />
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500" id="profile-not-found">
                <p className="font-semibold text-sm">Please select an active patient from the workspace queue first.</p>
                <button
                  id="btn-trigger-redirect-dashboard"
                  onClick={() => setActiveView('dashboard')}
                  className="mt-4 bg-slate-900 text-teal-400 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WorkspaceRoot />
    </QueryClientProvider>
  );
}
