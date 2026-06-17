/**
 * NeuroPredict AI - Clinical Core Layout Frame (High Density Theme)
 */
import React from 'react';
import { 
  Activity, 
  Users, 
  FileText, 
  Layers, 
  Database, 
  Cpu, 
  ShieldAlert, 
  Clock,
  UserCheck
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: 'dashboard' | 'profile' | 'workflow';
  onNavigate: (view: 'dashboard' | 'profile' | 'workflow') => void;
  selectedPatientName?: string;
}

export default function Layout({ 
  children, 
  activeView, 
  onNavigate, 
  selectedPatientName 
}: LayoutProps) {
  const currentTime = "2026-06-16 18:22:31";

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col justify-between overflow-hidden" id="neuro-app-container">
      {/* Top Navigation Bar */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10" id="global-hospital-header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-600 rounded flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800">
            NeuroPredict <span className="text-sky-600 font-black">AI</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="flex gap-1" id="top-nav-tabs">
            <button 
              id="nav-btn-dashboard"
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeView === 'dashboard' 
                  ? 'bg-slate-100 text-sky-700 font-bold' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Patients Queue
            </button>
            <button 
              id="nav-btn-workflow"
              onClick={() => onNavigate('workflow')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeView === 'workflow' 
                  ? 'bg-slate-100 text-sky-700 font-bold' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Clinical Pipeline Wizard
            </button>
            <button 
              id="nav-btn-profile"
              onClick={() => onNavigate('profile')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeView === 'profile' 
                  ? 'bg-slate-100 text-sky-700 font-bold' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Patient Analysis
            </button>
          </nav>
          
          <div className="h-6 w-px bg-slate-200"></div>
          
          <div className="flex items-center gap-3" id="clinician-badge">
            <div className="text-right">
              <p className="text-xs font-semibold leading-none text-slate-800">Dr. Sarah Mitchell</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Senior Neurologist</p>
            </div>
            <div className="w-8 h-8 bg-slate-200 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 font-semibold text-xs font-mono">
              SM
            </div>
          </div>
        </div>
      </header>

      {/* Sub-Header: Workflow Status Indicator */}
      <div className="h-12 bg-slate-800 text-white flex items-center px-6 gap-8 shrink-0" id="sub-header-workflow-banner">
        <div className="flex items-center gap-2 text-xs">
          <span className="opacity-50">Active Patient:</span>
          <span className="font-medium uppercase tracking-wide text-sky-300" id="selected-patient-badge-indicator">
            {selectedPatientName ? selectedPatientName : 'NONE SELECTED - CHOOSE FROM QUEUE'}
          </span>
        </div>
        
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1 text-[10px]" id="stepper-horizontal-gauge">
            <div className={`px-2.5 py-0.5 rounded font-bold uppercase transition-colors ${
              activeView === 'workflow' 
                ? 'bg-sky-500 text-white' 
                : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
            }`}>
              1. Clinical Data
            </div>
            <div className="w-4 h-px bg-slate-600"></div>
            <div className={`px-2.5 py-0.5 rounded font-bold uppercase transition-colors ${
              activeView === 'profile' 
                ? 'bg-sky-500 text-white' 
                : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
            }`}>
              2. Cognitive Profile
            </div>
            <div className="w-4 h-px bg-slate-600"></div>
            <div className={`px-2.5 py-0.5 rounded font-bold uppercase transition-colors ${
              activeView === 'profile'
                ? 'bg-sky-500 text-white' 
                : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
            }`}>
              3. Imaging Metrics
            </div>
            <div className="w-4 h-px bg-slate-600"></div>
            <div className={`px-2.5 py-0.5 rounded font-bold uppercase transition-colors ${
              activeView === 'profile'
                ? 'bg-sky-500 text-white' 
                : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
            }`}>
              4. AI Predictor
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">Pipeline Status:</span>
          <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> MONAI & PyTorch Active
          </span>
        </div>
      </div>

      {/* Content canvas */}
      <main className="flex-1 p-4 overflow-y-auto" id="clinical-main-stage">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Status Footer */}
      <footer className="h-8 bg-white border-t border-slate-200 flex items-center justify-between px-4 shrink-0" id="system-status-footer">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">System Online: GPU_NODE_01</span>
          </div>
          <div className="w-px h-3 bg-slate-200"></div>
          <span className="text-[10px] text-slate-400 font-mono">API_LATENCY: 142ms</span>
          <div className="w-px h-3 bg-slate-200"></div>
          <span className="text-[10px] text-slate-400 font-mono">UTC: {currentTime.split('T')[0] || currentTime}</span>
        </div>
        <div className="text-[10px] font-bold text-slate-300 font-mono">
          NEUROPREDICT_AI CORE v2.4.0-STABLE
        </div>
      </footer>
    </div>
  );
}

