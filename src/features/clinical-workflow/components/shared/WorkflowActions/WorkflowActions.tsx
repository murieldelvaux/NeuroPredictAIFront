import { Box, Button } from '@mui/material';
import { ArrowBack as ArrowLeftIcon, ArrowForward as ArrowRightIcon, Save as SaveIcon } from '@mui/icons-material';

type WorkflowActionsProps = {
  currentStep: number;
  isWorkflowBusy: boolean;
  canGoBack: boolean;
  primaryLabel: string;
  primaryColor?: 'secondary' | 'success';
  onBack: () => void;
  onPrimaryAction: () => void;
};

export default function WorkflowActions({
  currentStep,
  isWorkflowBusy,
  canGoBack,
  primaryLabel,
  primaryColor = 'secondary',
  onBack,
  onPrimaryAction,
}: WorkflowActionsProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 1, borderColor: 'divider', pt: 3 }} id="workflow-nav-footer">
      {canGoBack ? (
        <Button variant="outlined" color="inherit" onClick={onBack} startIcon={<ArrowLeftIcon />} id="btn-step-prev" sx={{ fontWeight: 'bold', borderColor: 'divider' }}>
          Etapa anterior
        </Button>
      ) : (
        <Box />
      )}

      <Button
        variant="contained"
        color={primaryColor}
        onClick={onPrimaryAction}
        endIcon={primaryColor === 'success' ? <SaveIcon /> : <ArrowRightIcon />}
        id={currentStep === 4 || currentStep === 6 ? 'btn-save-evaluation' : 'btn-step-next'}
        disabled={isWorkflowBusy}
        sx={{ fontWeight: 'bold', color: primaryColor === 'success' ? '#ffffff' : undefined }}
      >
        {primaryLabel}
      </Button>
    </Box>
  );
}