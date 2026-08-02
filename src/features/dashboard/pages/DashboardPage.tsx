import { useNavigate } from 'react-router-dom';
import DoctorDashboard from '../components/DoctorDashboard/DoctorDashboard';
import { useGetPatients } from '../react-queries/useGetPatients';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: patients = [], isLoading } = useGetPatients();

  return (
    <DoctorDashboard
      patients={patients}
      isLoading={isLoading}
      onSelectPatient={(id) => navigate(`/patients/${id}`)}
      onStartWorkflow={() => navigate('/workflow')}
    />
  );
}