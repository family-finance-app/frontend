export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetId?: string;
  route?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'navigate' | 'create' | 'view';
  nextStep?: string;
  isCompleted?: boolean;
}

export interface OnboardingState {
  isOnboardingActive: boolean;
  currentStepId: string | null;
  completedSteps: string[];
  hasSeenWelcome: boolean;
  isFirstTimeUser: boolean;
}

export type OnboardingAction =
  | { type: 'START_ONBOARDING' }
  | { type: 'COMPLETE_STEP'; stepId: string }
  | { type: 'GO_TO_STEP'; stepId: string }
  | { type: 'SKIP_ONBOARDING' }
  | { type: 'FINISH_ONBOARDING' }
  | { type: 'RESET_ONBOARDING' }
  | { type: 'SET_WELCOME_SEEN' }
  | { type: 'LOAD_STATE'; payload: Partial<OnboardingState> };

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'create-account',
    title: 'Create Your First Account',
    description: 'Start by creating a financial account to track your money.',
    targetId: 'add-account-button',
    route: '/accounts',
    position: 'bottom',
    action: 'create',
    nextStep: 'add-transaction',
  },
  {
    id: 'add-transaction',
    title: 'Add Your First Transaction',
    description:
      'Track your finances by adding transactions. Record income, expenses, or transfers between accounts. Tip: Use "Transfer" to move money to savings accounts.',
    targetId: 'add-transaction-button',
    route: '/dashboard',
    position: 'bottom',
    action: 'create',
    nextStep: 'view-dashboard',
  },
  {
    id: 'view-dashboard',
    title: 'Your Financial Dashboard',
    description:
      'See your total balance, income, expenses, and savings. The dashboard updates in real time as you add transactions.',
    targetId: 'dashboard-balance-section',
    route: '/dashboard',
    position: 'right',
    action: 'view',
    nextStep: 'understand-balance',
  },
  {
    id: 'understand-balance',
    title: 'Understand Your Total Balance',
    description:
      'Your total balance shows all your money from every account, converted to UAH at current exchange rates. Check exchange rates in the widget on the left.',
    targetId: 'total-balance-widget',
    route: '/dashboard',
    position: 'bottom',
    action: 'view',
    nextStep: 'view-stats',
  },
  {
    id: 'view-stats',
    title: 'Income & Expense Statistics',
    description:
      'These cards show your income, expenses, and savings for the selected period. All amounts are converted to UAH for easy comparison. Use the time period selector to switch between weekly, monthly, or yearly views.',
    targetId: 'dashboard-stats-section',
    route: '/dashboard',
    position: 'top',
    action: 'view',
    nextStep: 'complete',
  },
  {
    id: 'complete',
    title: "You're All Set!",
    description:
      "You've completed the getting started guide. You now know how to create accounts, add transactions, and read your financial statistics. Start tracking your finances and achieve your goals!",
    position: 'center',
    action: 'view',
  },
];

export const ONBOARDING_STORAGE_KEY = 'family-finance-onboarding';

export const getStepById = (stepId: string): OnboardingStep | undefined =>
  ONBOARDING_STEPS.find((step) => step.id === stepId);

export const getNextStep = (
  currentStepId: string,
): OnboardingStep | undefined => {
  const currentStep = getStepById(currentStepId);
  if (currentStep?.nextStep) {
    return getStepById(currentStep.nextStep);
  }
  return undefined;
};

export const getStepIndex = (stepId: string): number =>
  ONBOARDING_STEPS.findIndex((step) => step.id === stepId);

export const getTotalSteps = (): number => ONBOARDING_STEPS.length;
