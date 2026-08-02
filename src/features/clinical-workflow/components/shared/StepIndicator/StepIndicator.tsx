import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';

type StepIndicatorProps = {
  currentStep: number;
  steps: Array<{ label: string }>;
};

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <Box id="workflow-progress-stepper" sx={{ width: '100%', py: 1 }}>
      <Stepper activeStep={currentStep - 1} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              slotProps={{
                stepIcon: {
                  sx: {
                    color: index + 1 === currentStep ? 'primary.main' : index + 1 < currentStep ? '#10b981' : 'divider',
                  },
                },
              }}
            >
              <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: index + 1 === currentStep ? 'bold' : 'normal' }}>
                {step.label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}