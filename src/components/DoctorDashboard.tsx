/**
 * NeuroPredict AI - Clinical Doctor Dashboard
 */
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Activity, 
  BrainCircuit, 
  Activity as ClinicalIcon, 
  UserPlus, 
  ArrowRight, 
  Brain, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Patient } from '../types';

interface DoctorDashboardProps {
  patients: Patient[];
  isLoading: boolean;
  onSelectPatient: (id: string) => void;
  onStartWorkflow: () => void;
}

export default function DoctorDashboard({ 
  patients, 
  isLoading, 
  onSelectPatient, 
  onStartWorkflow 
}: DoctorDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'High' | 'Moderate' | 'Low'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Completed' | 'Pending Interpretation' | 'Awaiting MRI'>('ALL');

  // Compute stats securely
  const totalPatients = patients.length;
  const highRiskCount = patients.filter(p => p.riskCategory === 'High').length;
  const awaitingMRICount = patients.filter(p => p.status === 'Awaiting MRI').length;
  const averageRisk = Math.round(
    patients.reduce((sum, p) => sum + p.riskScore, 0) / (totalPatients || 1)
  );

  // Filter logic
  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === 'ALL' || p.riskCategory === riskFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

    return matchesSearch && matchesRisk && matchesStatus;
  });

  return (
    <div className="space-y-4" id="doctor-dashboard-root">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-200 pb-3" id="dashboard-header-block">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight" id="dashboard-main-heading">
            Clinical Diagnostic Queue
          </h2>
          <p className="text-slate-500 text-xs mt-0.5" id="dashboard-sub-heading">
            Alzheimer’s disease prognostic forecasting & explainable clinical indicators.
          </p>
        </div>

        <button
          id="btn-trigger-new-evaluation"
          onClick={onStartWorkflow}
          className="bg-sky-600 text-white hover:bg-sky-700 px-4 py-2 rounded-md font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors self-start md:self-auto cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
          <span>New Acquisition Workflow</span>
        </button>
      </div>

      {/* Analytical Medical Badges / Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-metric-grid">
        {/* Total registry */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs transition-shadow hover:shadow-xs" id="card-metric-total">
          <div className="flex items-center justify-between" id="metric-total-header">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinical Registry</span>
            <div className="p-1.5 bg-sky-50 text-sky-600 rounded">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2" id="metric-total-content">
            <h3 className="text-2xl font-bold text-slate-800">{isLoading ? "..." : totalPatients}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
              Active Patient Profiles
            </p>
          </div>
        </div>

        {/* High Prognosis Risk ratio */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs transition-shadow hover:shadow-xs" id="card-metric-critical">
          <div className="flex items-center justify-between" id="metric-critical-header">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Critical Priority</span>
            <div className="p-1.5 bg-rose-50 text-rose-650 rounded">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2" id="metric-critical-content">
            <h3 className="text-2xl font-bold text-slate-800">{isLoading ? "..." : highRiskCount}</h3>
            <p className="text-[10px] text-rose-600 font-semibold mt-0.5">
              Patients with High Atrophy Risk
            </p>
          </div>
        </div>

        {/* Average Neural index */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs transition-shadow hover:shadow-xs" id="card-metric-average">
          <div className="flex items-center justify-between" id="metric-average-header">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Prognosis Factor</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded">
              <BrainCircuit className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2" id="metric-average-content">
            <h3 className="text-2xl font-bold text-slate-800">{isLoading ? "..." : `${averageRisk}%`}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Composite diagnostic confidence
            </p>
          </div>
        </div>

        {/* MRI backlogs */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs transition-shadow hover:shadow-xs" id="card-metric-imaging">
          <div className="flex items-center justify-between" id="metric-imaging-header">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Imaging Pipeline</span>
            <div className="p-1.5 bg-sky-50 text-sky-600 rounded">
              <Brain className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2" id="metric-imaging-content">
            <h3 className="text-2xl font-bold text-slate-800">{isLoading ? "..." : awaitingMRICount}</h3>
            <p className="text-[10px] text-sky-600 font-semibold mt-0.5">
              Awaiting standard 3T MRI upload
            </p>
          </div>
        </div>
      </div>

      {/* Main Registry and Filtering Segment */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden" id="dashboard-queue-container">
        {/* Filter bar controls */}
        <div className="p-3 border-b border-slate-150 flex flex-col xl:flex-row gap-3 justify-between bg-slate-50/50" id="queue-filter-bar">
          <div className="flex-1 max-w-md relative" id="search-input-wrapper">
            <Search className="absolute left-3 top-2.5 text-slate-400 h-3.5 w-3.5" />
            <input
              id="patients-search-input"
              type="text"
              placeholder="Search by Patient name, MRN, or Ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md py-1.5 pl-9 pr-3 text-xs placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2" id="filters-container">
            {/* Risk filter */}
            <div className="flex items-center space-x-0.5 border border-slate-200 rounded-md p-0.5 bg-white" id="filter-wrapper-risk">
              <button
                id="btn-filter-all-risk"
                onClick={() => setRiskFilter('ALL')}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                  riskFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All Risks
              </button>
              <button
                id="btn-filter-high-risk"
                onClick={() => setRiskFilter('High')}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                  riskFilter === 'High' ? 'bg-rose-600 text-white' : 'text-slate-500 hover:text-rose-650'
                }`}
              >
                High Risk
              </button>
              <button
                id="btn-filter-moderate-risk"
                onClick={() => setRiskFilter('Moderate')}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                  riskFilter === 'Moderate' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-amber-600'
                }`}
              >
                Mod. Risk
              </button>
              <button
                id="btn-filter-low-risk"
                onClick={() => setRiskFilter('Low')}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                  riskFilter === 'Low' ? 'bg-emerald-650 text-white' : 'text-slate-500 hover:text-emerald-650'
                }`}
              >
                Low Risk
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-0.5 border border-slate-200 rounded-md p-0.5 bg-white" id="filter-wrapper-status">
              <button
                id="btn-filter-all-status"
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                  statusFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-500'
                }`}
              >
                All Statuses
              </button>
              <button
                id="btn-filter-pending-status"
                onClick={() => setStatusFilter('Pending Interpretation')}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                  statusFilter === 'Pending Interpretation' ? 'bg-sky-600 text-white' : 'text-slate-500'
                }`}
              >
                Pending AI
              </button>
            </div>
          </div>
        </div>

        {/* Patient Register Table */}
        <div className="overflow-x-auto" id="queue-table-frame">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2" id="table-loading-frame">
              <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-400 font-medium text-[10px] font-mono">Syncing securely with central databases...</span>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-12 text-slate-500" id="table-empty-frame">
              <p className="font-bold text-xs">No clinical files match the active filtration query.</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Adjust search parameters or initiate a new diagnostic flow.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse" id="queue-patients-table">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-mono text-[10px] font-bold tracking-wider uppercase border-b border-slate-100">
                  <th className="py-2.5 px-4">ID & MRN</th>
                  <th className="py-2.5 px-4">Patient Name</th>
                  <th className="py-2.5 px-4">Age / Sex</th>
                  <th className="py-2.5 px-4">Last Evaluation</th>
                  <th className="py-2.5 px-4 text-center">Prognosis Risk Factor</th>
                  <th className="py-2.5 px-4 text-center">Service Status</th>
                  <th className="py-2.5 px-4 text-right">Operation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700 text-xs">
                {filteredPatients.map(p => {
                  const riskColorMap = {
                    High: { bg: 'bg-rose-50 border-rose-100', text: 'text-rose-700', fill: 'bg-rose-600' },
                    Moderate: { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-800', fill: 'bg-amber-500' },
                    Low: { bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-700', fill: 'bg-emerald-500' }
                  }[p.riskCategory];

                  const statusColorMap = {
                    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                    'Pending Interpretation': 'bg-sky-50 text-sky-700 border-sky-100',
                    'Awaiting MRI': 'bg-slate-100 text-slate-650 border-slate-200'
                  }[p.status];

                  return (
                    <tr 
                      key={p.id} 
                      className="hover:bg-slate-50/50 transition-colors"
                      id={`cohort-row-${p.id}`}
                    >
                      {/* ID / MRN */}
                      <td className="py-2 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-[10px] text-slate-400">{p.id.toUpperCase()}</span>
                          <span className="text-[10px] text-sky-600 font-mono mt-0.5">{p.mrn}</span>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-2 px-4">
                        <span className="font-semibold text-slate-850 hover:text-sky-600 cursor-pointer block text-xs" onClick={() => onSelectPatient(p.id)}>
                          {p.name}
                        </span>
                      </td>

                      {/* Demographic tag */}
                      <td className="py-2 px-4">
                        <div className="flex items-center space-x-1 text-slate-500">
                          <span>{p.age} y/o</span>
                          <span className="text-slate-300">•</span>
                          <span>{p.gender}</span>
                        </div>
                      </td>

                      {/* Last eval */}
                      <td className="py-2 px-4">
                        <div className="flex items-center space-x-1 text-slate-500">
                          <Calendar className="w-3 h-3" />
                          <span>{p.lastEvaluated}</span>
                        </div>
                      </td>

                      {/* Risk index */}
                      <td className="py-2 px-4">
                        <div className="flex items-center justify-center">
                          <div className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${riskColorMap.bg} ${riskColorMap.text}`}>
                            <span className={`w-1 h-1 rounded-full ${riskColorMap.fill}`}></span>
                            <span>{p.riskCategory} ({p.riskScore}%)</span>
                          </div>
                        </div>
                      </td>

                      {/* Pipeline Status */}
                      <td className="py-2 px-4 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${statusColorMap}`}>
                          {p.status}
                        </span>
                      </td>

                      {/* Review Trigger */}
                      <td className="py-2 px-4 text-right">
                        <button
                          id={`btn-review-file-${p.id}`}
                          onClick={() => onSelectPatient(p.id)}
                          className="inline-flex items-center space-x-1 bg-slate-50 hover:bg-sky-600 hover:text-white border border-slate-250 rounded px-2 py-1 text-[10px] font-bold transition-all cursor-pointer text-slate-650"
                        >
                          <span>Review File</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
