'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  RiWalletLine,
  RiExchangeLine,
  RiDashboardLine,
  RiMoneyDollarCircleLine,
  RiBarChartLine,
} from '@remixicon/react';

import { useOnboarding } from '../OnboardingContext';
import TutorialSpotlight from './TutorialSpotlight';
import TutorialTooltip from './TutorialTooltip';
import TutorialCenterModal from './TutorialCenterModal';
import WelcomeModal from './WelcomeModal';

const stepIcons: Record<string, React.ReactNode> = {
  'create-account': <RiWalletLine className="w-5 h-5" />,
  'add-transaction': <RiExchangeLine className="w-5 h-5" />,
  'view-dashboard': <RiDashboardLine className="w-5 h-5" />,
  'understand-balance': <RiMoneyDollarCircleLine className="w-5 h-5" />,
  'view-stats': <RiBarChartLine className="w-5 h-5" />,
};

const actionLabels: Record<string, string> = {
  welcome: "Let's Start",
  'create-account': 'Got it',
  'add-transaction': 'Got it',
  'view-dashboard': 'Next',
  'understand-balance': 'Next',
  'view-stats': 'Next',
  complete: 'Finish Tour',
};

export default function TutorialOverlay() {
  const pathname = usePathname();
  const {
    isOnboardingActive,
    currentStep,
    startOnboarding,
    nextStep,
    skipOnboarding,
    finishOnboarding,
    goToStep,
    getProgress,
    isFirstTimeUser,
    hasSeenWelcome,
    isLoaded,
  } = useOnboarding();

  const progress = getProgress();

  useEffect(() => {
    if (currentStep?.route && pathname !== currentStep.route) {
    }
  }, [currentStep, pathname]);

  if (!isLoaded) return null;

  if (isFirstTimeUser && !hasSeenWelcome && !isOnboardingActive) {
    return (
      <WelcomeModal
        isOpen={true}
        onStartTutorial={startOnboarding}
        onSkip={skipOnboarding}
      />
    );
  }

  if (!isOnboardingActive || !currentStep) return null;

  if (currentStep.id === 'complete') {
    return (
      <TutorialCenterModal
        isOpen={true}
        title={currentStep.title}
        description={currentStep.description}
        icon="complete"
        onContinue={finishOnboarding}
        onSkip={skipOnboarding}
        continueLabel={actionLabels[currentStep.id]}
      />
    );
  }

  if (currentStep.targetId) {
    return (
      <TutorialSpotlight
        targetId={currentStep.targetId}
        isActive={true}
        position={
          currentStep.position === 'center' ? 'bottom' : currentStep.position
        }
      >
        <TutorialTooltip
          title={currentStep.title}
          description={currentStep.description}
          progress={progress}
          onNext={nextStep}
          onSkip={skipOnboarding}
          onClose={skipOnboarding}
          isLastStep={!currentStep.nextStep}
          icon={stepIcons[currentStep.id]}
          actionLabel={actionLabels[currentStep.id]}
        />
      </TutorialSpotlight>
    );
  }

  return (
    <TutorialCenterModal
      isOpen={true}
      title={currentStep.title}
      description={currentStep.description}
      icon="info"
      onContinue={nextStep}
      onSkip={skipOnboarding}
      continueLabel={actionLabels[currentStep.id] || 'Continue'}
    />
  );
}
