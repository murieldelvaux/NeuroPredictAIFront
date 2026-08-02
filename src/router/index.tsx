import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';
import AppLayout from '../components/Layout/Layout';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import WorkflowPage from '../features/clinical-workflow/pages/WorkflowPage';
import PatientProfilePage from '../features/patient-profile/pages/PatientProfilePage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="workflow" element={<WorkflowPage />} />
      <Route path="patients/:patientId" element={<PatientProfilePage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>,
  ),
);