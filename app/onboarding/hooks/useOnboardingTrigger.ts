'use client';

import { useCallback } from 'react';
import { useOnboarding } from '../OnboardingContext';

// tracking onboarding step completion when user performs actions

export function useOnboardingTrigger() {
  const { isOnboardingActive, currentStepId, completeStep, goToStep } =
    useOnboarding();

  // when user successfully creates an account
  const onAccountCreated = useCallback(() => {
    if (isOnboardingActive && currentStepId === 'create-account') {
      completeStep('create-account');
      goToStep('add-transaction');
    }
  }, [isOnboardingActive, currentStepId, completeStep, goToStep]);

  // when user successfully creates a transaction
  const onTransactionCreated = useCallback(() => {
    if (isOnboardingActive && currentStepId === 'add-transaction') {
      completeStep('add-transaction');
      // Go directly to view-dashboard step
      goToStep('view-dashboard');
    }
  }, [isOnboardingActive, currentStepId, completeStep, goToStep]);

  // if onboarding is waiting for a specific action
  const isWaitingForAction = useCallback(
    (actionStep: string) => {
      return isOnboardingActive && currentStepId === actionStep;
    },
    [isOnboardingActive, currentStepId],
  );

  return {
    onAccountCreated,
    onTransactionCreated,
    isWaitingForAction,
    isOnboardingActive,
  };
}
