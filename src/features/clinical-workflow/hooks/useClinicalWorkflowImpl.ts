/**
 * useClinicalWorkflow — multi-step form state manager.
 * Owns the MedicalWorkflowSession state and step navigation.
 */
import { useState } from 'react';
import type { MedicalWorkflowSession } from '../../../types';

const TOTAL_STEPS = 4;

export function useClinicalWorkflow() {
  const [session, setSession] = useState<MedicalWorkflowSession>({
    currentStep: 1,
  });

  const goToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setSession((prev) => ({ ...prev, currentStep: step }));
    }
  };

  const nextStep = () => goToStep(session.currentStep + 1);
  const prevStep = () => goToStep(session.currentStep - 1);

  const updateSession = (patch: Partial<MedicalWorkflowSession>) => {
    setSession((prev) => ({ ...prev, ...patch }));
  };

  const resetSession = () => {
    setSession({ currentStep: 1 });
  };

  return {
    session,
    currentStep: session.currentStep,
    totalSteps: TOTAL_STEPS,
    isFirstStep: session.currentStep === 1,
    isLastStep: session.currentStep === TOTAL_STEPS,
    goToStep,
    nextStep,
    prevStep,
    updateSession,
    resetSession,
  };
}
