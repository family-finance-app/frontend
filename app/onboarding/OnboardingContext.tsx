'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
  ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';

import {
  OnboardingState,
  OnboardingAction,
  OnboardingStep,
  ONBOARDING_STEPS,
  ONBOARDING_STORAGE_KEY,
  getStepById,
  getNextStep,
} from './types';

interface OnboardingContextType extends OnboardingState {
  currentStep: OnboardingStep | null;
  startOnboarding: () => void;
  completeStep: (stepId: string) => void;
  goToStep: (stepId: string) => void;
  skipOnboarding: () => void;
  finishOnboarding: () => void;
  resetOnboarding: () => void;
  setWelcomeSeen: () => void;
  nextStep: () => void;
  getProgress: () => { current: number; total: number; percentage: number };
  isLoaded: boolean;
}

const initialState: OnboardingState = {
  isOnboardingActive: false,
  currentStepId: null,
  completedSteps: [],
  hasSeenWelcome: false,
  isFirstTimeUser: true,
};

function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction,
): OnboardingState {
  switch (action.type) {
    case 'START_ONBOARDING':
      return {
        ...state,
        isOnboardingActive: true,
        currentStepId: 'create-account',
        hasSeenWelcome: true,
      };

    case 'COMPLETE_STEP':
      return {
        ...state,
        completedSteps: state.completedSteps.includes(action.stepId)
          ? state.completedSteps
          : [...state.completedSteps, action.stepId],
      };

    case 'GO_TO_STEP':
      return {
        ...state,
        currentStepId: action.stepId,
      };

    case 'SKIP_ONBOARDING':
      return {
        ...state,
        isOnboardingActive: false,
        currentStepId: null,
        hasSeenWelcome: true,
        isFirstTimeUser: false,
      };

    case 'FINISH_ONBOARDING':
      return {
        ...state,
        isOnboardingActive: false,
        currentStepId: null,
        completedSteps: ONBOARDING_STEPS.map((step) => step.id),
        hasSeenWelcome: true,
        isFirstTimeUser: false,
      };

    case 'RESET_ONBOARDING':
      return initialState;

    case 'SET_WELCOME_SEEN':
      return {
        ...state,
        hasSeenWelcome: true,
      };

    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, dispatch] = useReducer(onboardingReducer, initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);

        dispatch({
          type: 'LOAD_STATE',
          payload: {
            completedSteps: parsed.completedSteps || [],
            hasSeenWelcome: parsed.hasSeenWelcome || false,
            isFirstTimeUser: parsed.isFirstTimeUser !== false,
          },
        });
      }
    } catch (error) {
      console.error('Failed to load onboarding state:', error);
    }

    queueMicrotask(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify({
          completedSteps: state.completedSteps,
          hasSeenWelcome: state.hasSeenWelcome,
          isFirstTimeUser: state.isFirstTimeUser,
        }),
      );
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
    }
  }, [
    isLoaded,
    state.completedSteps,
    state.hasSeenWelcome,
    state.isFirstTimeUser,
  ]);

  const currentStep = state.currentStepId
    ? getStepById(state.currentStepId) || null
    : null;

  const startOnboarding = useCallback(() => {
    dispatch({ type: 'START_ONBOARDING' });

    const firstStep = getStepById('create-account');
    if (firstStep?.route && pathname !== firstStep.route) {
      router.push(firstStep.route);
    }
  }, [router, pathname]);

  const completeStep = useCallback((stepId: string) => {
    dispatch({ type: 'COMPLETE_STEP', stepId });
  }, []);

  const goToStep = useCallback(
    (stepId: string) => {
      const step = getStepById(stepId);
      if (step?.route && pathname !== step.route) {
        router.push(step.route);
      }
      dispatch({ type: 'GO_TO_STEP', stepId });
    },
    [router, pathname],
  );

  const skipOnboarding = useCallback(() => {
    dispatch({ type: 'SKIP_ONBOARDING' });
  }, []);

  const finishOnboarding = useCallback(() => {
    dispatch({ type: 'FINISH_ONBOARDING' });
  }, []);

  const resetOnboarding = useCallback(() => {
    dispatch({ type: 'RESET_ONBOARDING' });
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  }, []);

  const setWelcomeSeen = useCallback(() => {
    dispatch({ type: 'SET_WELCOME_SEEN' });
  }, []);

  const nextStep = useCallback(() => {
    if (state.currentStepId) {
      completeStep(state.currentStepId);
      const next = getNextStep(state.currentStepId);
      if (next) {
        goToStep(next.id);
      } else {
        finishOnboarding();
      }
    }
  }, [state.currentStepId, completeStep, goToStep, finishOnboarding]);

  const getProgress = useCallback(() => {
    const total = ONBOARDING_STEPS.length;
    const current = state.currentStepId
      ? ONBOARDING_STEPS.findIndex((s) => s.id === state.currentStepId) + 1
      : 0;
    const percentage = Math.round((current / total) * 100);
    return { current, total, percentage };
  }, [state.currentStepId]);

  const value: OnboardingContextType = {
    ...state,
    currentStep,
    startOnboarding,
    completeStep,
    goToStep,
    skipOnboarding,
    finishOnboarding,
    resetOnboarding,
    setWelcomeSeen,
    nextStep,
    getProgress,
    isLoaded,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
