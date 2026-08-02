import { useNavigate } from 'react-router-dom';
import ClinicalWorkflow from '../components/ClinicalWorkflow/ClinicalWorkflow';
import { useToast } from '../../../providers/AppProviders';

export default function WorkflowPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return (
    <ClinicalWorkflow
      onComplete={(patientId) => navigate(`/patients/${patientId}`)}
      onError={(message) => showToast(message, 'error')}
      onCancel={() => navigate('/dashboard')}
    />
  );
}