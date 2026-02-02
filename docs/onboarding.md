# Onboarding System

This document describes the interactive tutorial/onboarding system that guides new users through the Family Finance application.

## Overview

The onboarding system provides a step-by-step tutorial for first-time users, highlighting key features and guiding them through essential actions like creating accounts and adding transactions.

## Architecture

**Location:** `/app/onboarding/`

```
onboarding/
├── index.ts                    # Public exports
├── types.ts                    # Step definitions & types
├── OnboardingContext.tsx       # State management
├── components/
│   ├── index.ts
│   ├── TutorialOverlay.tsx     # Main orchestrator
│   ├── TutorialSpotlight.tsx   # Element highlighting
│   ├── TutorialTooltip.tsx     # Step information cards
│   ├── TutorialProgress.tsx    # Progress indicator
│   ├── TutorialCenterModal.tsx # Centered modals
│   └── WelcomeModal.tsx        # Welcome screen
└── hooks/
    └── useOnboardingTrigger.ts # Action completion triggers
```

## Tutorial Flow

### Steps

1. **Welcome Modal** - Greets new users and offers to start the tutorial
2. **Create Account** - Guides user to the Accounts page to create their first account
3. **Add Transaction** - Shows how to add income/expense transactions
4. **View Dashboard** - Introduces the dashboard overview
5. **Understand Balance** - Explains multi-currency balance calculation
6. **View Stats** - Shows income/expense statistics
7. **Complete** - Congratulates user on completing the tutorial

### Step Definitions

```typescript
// /app/onboarding/types.ts

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'create-account',
    title: 'Create Your First Account',
    description: 'Start by creating a financial account...',
    targetId: 'add-account-button',
    route: '/accounts',
    position: 'bottom',
    action: 'create',
    nextStep: 'add-transaction',
  },
  // ... more steps
];
```

## State Management

### OnboardingContext

Provides global state for the onboarding system.

```typescript
interface OnboardingState {
  isOnboardingActive: boolean;
  currentStepId: string | null;
  completedSteps: string[];
  hasSeenWelcome: boolean;
  isFirstTimeUser: boolean;
}
```

### Actions

| Action              | Description                     |
| ------------------- | ------------------------------- |
| `START_ONBOARDING`  | Begin tutorial from first step  |
| `COMPLETE_STEP`     | Mark a step as completed        |
| `GO_TO_STEP`        | Navigate to specific step       |
| `SKIP_ONBOARDING`   | Skip/exit the tutorial          |
| `FINISH_ONBOARDING` | Complete the tutorial           |
| `RESET_ONBOARDING`  | Reset to initial state          |
| `SET_WELCOME_SEEN`  | Mark welcome as seen            |
| `LOAD_STATE`        | Restore state from localStorage |

### Persistence

State is persisted to localStorage under the key `family-finance-onboarding`:

```typescript
{
  completedSteps: string[];
  hasSeenWelcome: boolean;
  isFirstTimeUser: boolean;
}
```

## Usage

### Provider Setup

The OnboardingProvider must wrap the main layout:

```tsx
// /app/(main layout)/layout.tsx

import { OnboardingProvider, TutorialOverlay } from '@/onboarding';

export default function Layout({ children }) {
  return (
    <OnboardingProvider>
      {/* Layout content */}
      <TutorialOverlay />
    </OnboardingProvider>
  );
}
```

### Using the Hook

Access onboarding state and actions in any component:

```tsx
import { useOnboarding } from '@/onboarding';

function MyComponent() {
  const {
    isOnboardingActive,
    currentStep,
    startOnboarding,
    nextStep,
    skipOnboarding,
    finishOnboarding,
    resetOnboarding,
    getProgress,
  } = useOnboarding();

  return <button onClick={startOnboarding}>Start Tutorial</button>;
}
```

### Target Elements

Components that should be highlighted need specific IDs:

```tsx
// Add Account button
<button id="add-account-button">Add Account</button>

// Add Transaction button
<button id="add-transaction-button">Add Transaction</button>

// Dashboard sections
<div id="dashboard-balance-section">...</div>
<div id="total-balance-widget">...</div>
<div id="dashboard-stats-section">...</div>
```

### Triggering Step Completion

Use the `useOnboardingTrigger` hook to automatically advance steps:

```tsx
import { useOnboardingTrigger } from '@/onboarding/hooks/useOnboardingTrigger';

function CreateAccountForm() {
  const { onAccountCreated } = useOnboardingTrigger();

  const handleSubmit = async (data) => {
    await createAccount(data);
    onAccountCreated(); // Advances tutorial if on create-account step
  };
}
```

## Components

### TutorialOverlay

The main orchestrator component that:

- Shows WelcomeModal for first-time users
- Renders appropriate step UI (spotlight or center modal)
- Handles navigation between steps

```tsx
<TutorialOverlay />
```

### WelcomeModal

Initial modal shown to first-time users:

```tsx
<WelcomeModal
  isOpen={true}
  onStartTutorial={startOnboarding}
  onSkip={skipOnboarding}
/>
```

**Features:**

- Welcome message with app description
- "Start Quick Guide" button
- "Skip for now" option

### TutorialSpotlight

Highlights target elements without blocking interaction:

```tsx
<TutorialSpotlight
  targetId="add-account-button"
  isActive={true}
  position="bottom"
>
  <TutorialTooltip {...props} />
</TutorialSpotlight>
```

**Features:**

- Positions tooltip relative to target element
- Follows element if it moves
- Uses portals for proper z-index layering

### TutorialTooltip

Information card shown alongside highlighted elements:

```tsx
<TutorialTooltip
  title="Create Your First Account"
  description="Click the Add Account button to get started."
  progress={{ current: 1, total: 5, percentage: 20 }}
  icon={<RiWalletLine />}
  actionLabel="Got it"
  onNext={nextStep}
  onSkip={skipOnboarding}
  onClose={skipOnboarding}
/>
```

### TutorialProgress

Progress bar showing tutorial completion:

```tsx
<TutorialProgress current={2} total={5} percentage={40} />
```

### TutorialCenterModal

Centered modal for steps without target elements:

```tsx
<TutorialCenterModal
  isOpen={true}
  title="Tutorial Complete!"
  description="You're all set to manage your finances."
  icon="complete"
  onContinue={finishOnboarding}
  onSkip={skipOnboarding}
  continueLabel="Finish Tour"
/>
```

## Restarting the Tutorial

Users can restart the tutorial from Settings:

```tsx
// /app/(main layout)/settings/page.tsx

const { resetOnboarding, startOnboarding } = useOnboarding();

const handleRestartTutorial = () => {
  resetOnboarding();
  startOnboarding();
};
```

This clears localStorage and starts fresh from the first step.

## Auto-Trigger Logic

The tutorial automatically appears for first-time users:

```typescript
// TutorialOverlay.tsx

if (isFirstTimeUser && !hasSeenWelcome && !isOnboardingActive) {
  return <WelcomeModal isOpen={true} ... />;
}
```

**Conditions for showing welcome:**

1. `isFirstTimeUser` is `true` (no localStorage data)
2. `hasSeenWelcome` is `false`
3. `isOnboardingActive` is `false`

## Customization

### Adding New Steps

1. Add step definition in `types.ts`:

```typescript
{
  id: 'new-step',
  title: 'New Feature',
  description: 'Description of the feature.',
  targetId: 'target-element-id', // Optional
  route: '/page-route',          // Optional
  position: 'bottom',
  action: 'view',
  nextStep: 'next-step-id',
}
```

2. Add target element ID in the relevant component
3. Update `stepIcons` and `actionLabels` in `TutorialOverlay.tsx`

### Customizing Appearance

Modify the component styles in:

- `TutorialTooltip.tsx` - Tooltip card styling
- `TutorialSpotlight.tsx` - Highlight effect
- `WelcomeModal.tsx` - Welcome screen design

### Animation

Custom animations are defined in `globals.css`:

```css
@keyframes tutorial-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(var(--primary-400), 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(var(--primary-400), 0);
  }
}

.tutorial-highlight {
  animation: tutorial-pulse 2s infinite;
}
```

## Best Practices

1. **Non-blocking** - Tutorial should never prevent users from using the app
2. **Skippable** - Always provide a skip option
3. **Resumable** - Remember progress for returning users
4. **Contextual** - Show tips relevant to the current page
5. **Concise** - Keep step descriptions brief and actionable
