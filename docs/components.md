# Component Library Reference

This document provides a comprehensive reference for all reusable UI components in the Family Finance application.

## Table of Contents

1. [Layout Components](#layout-components)
2. [Chart Components](#chart-components)
3. [Card Components](#card-components)
4. [Form Components](#form-components)
5. [Modal Components](#modal-components)
6. [UI Components](#ui-components)
7. [Guard Components](#guard-components)

---

## Layout Components

**Location:** `/app/components/layout/`

### Navigation

Top navigation bar with user menu and mobile toggle.

```tsx
import { Navigation } from '@/components';

<Navigation />;
```

**Features:**

- Logo with home link
- Mobile menu toggle
- User dropdown menu
- Theme toggle
- Add Transaction button (with `id="add-transaction-button"` for onboarding)

### Sidebar

Side navigation menu with route links.

```tsx
import { Sidebar } from '@/components';

<Sidebar />;
```

**Features:**

- Navigation links to all main pages
- Active route highlighting
- Collapsible on mobile
- User account section

### Footer

Page footer with copyright and links.

```tsx
import { Footer } from '@/components';

<Footer />;
```

---

## Chart Components

**Location:** `/app/components/charts/`

### AreaChart

Time series visualization with filled areas.

```tsx
import { AreaChart } from '@/components/charts/AreaChart';

<AreaChart
  data={[
    { month: 'Jan', income: 5000, expenses: 3000 },
    { month: 'Feb', income: 5500, expenses: 3200 },
  ]}
  categories={['income', 'expenses']}
  index="month"
  colors={['emerald', 'rose']}
  valueFormatter={(value) => `₴${value.toLocaleString()}`}
/>;
```

**Props:**

| Prop             | Type                        | Description                   |
| ---------------- | --------------------------- | ----------------------------- |
| `data`           | `object[]`                  | Chart data array              |
| `categories`     | `string[]`                  | Data keys to display          |
| `index`          | `string`                    | X-axis key                    |
| `colors`         | `string[]`                  | Color names for each category |
| `valueFormatter` | `(value: number) => string` | Format tooltip values         |
| `showLegend`     | `boolean`                   | Show/hide legend              |
| `showGridLines`  | `boolean`                   | Show/hide grid                |

### BarChart

Comparative bar chart visualization.

```tsx
import { BarChart } from '@/components/charts/BarChart';

<BarChart
  data={[
    { month: 'Jan', savings: 2000 },
    { month: 'Feb', savings: 2300 },
  ]}
  categories={['savings']}
  index="month"
  colors={['blue']}
/>;
```

**Props:** Same as AreaChart

### DonutChart

Circular chart for category distribution.

```tsx
import { DonutChart } from '@/components/charts/DonutChart';

<DonutChart
  data={[
    { name: 'Food', value: 1500 },
    { name: 'Transport', value: 800 },
    { name: 'Entertainment', value: 500 },
  ]}
  category="value"
  index="name"
  colors={['blue', 'cyan', 'indigo']}
  valueFormatter={(value) => `₴${value}`}
/>;
```

**Props:**

| Prop             | Type                        | Description       |
| ---------------- | --------------------------- | ----------------- |
| `data`           | `object[]`                  | Chart data array  |
| `category`       | `string`                    | Value key         |
| `index`          | `string`                    | Label key         |
| `colors`         | `string[]`                  | Color names       |
| `valueFormatter` | `(value: number) => string` | Format values     |
| `showLabel`      | `boolean`                   | Show center label |

### ProgressBar

Linear progress indicator.

```tsx
import { ProgressBar } from '@/components/charts/ProgressBar';

<ProgressBar value={75} max={100} color="emerald" showLabel />;
```

**Props:**

| Prop        | Type      | Description           |
| ----------- | --------- | --------------------- |
| `value`     | `number`  | Current value         |
| `max`       | `number`  | Maximum value         |
| `color`     | `string`  | Bar color             |
| `showLabel` | `boolean` | Show percentage label |

---

## Card Components

**Location:** `/app/components/cards/`

### FinancialCard

Display financial metrics with icon and trend.

```tsx
import { FinancialCard } from '@/components';

<FinancialCard
  title="Total Balance"
  value="₴125,000"
  description="Across all accounts"
  icon={<RiWalletLine />}
  trend="+5.2%"
  trendDirection="up"
/>;
```

**Props:**

| Prop             | Type                          | Description        |
| ---------------- | ----------------------------- | ------------------ |
| `title`          | `string`                      | Card title         |
| `value`          | `string`                      | Main value display |
| `description`    | `string`                      | Subtitle text      |
| `icon`           | `ReactNode`                   | Icon component     |
| `trend`          | `string`                      | Trend percentage   |
| `trendDirection` | `'up' \| 'down' \| 'neutral'` | Trend indicator    |
| `onClick`        | `() => void`                  | Click handler      |

### CardGrid

Grid layout for multiple cards.

```tsx
import { CardGrid } from '@/components';

<CardGrid columns={3}>
  <FinancialCard {...card1Props} />
  <FinancialCard {...card2Props} />
  <FinancialCard {...card3Props} />
</CardGrid>;
```

**Props:**

| Prop       | Type                   | Description       |
| ---------- | ---------------------- | ----------------- |
| `children` | `ReactNode`            | Card components   |
| `columns`  | `2 \| 3 \| 4`          | Number of columns |
| `gap`      | `'sm' \| 'md' \| 'lg'` | Gap between cards |

---

## Form Components

**Location:** `/app/components/forms/`

### FormField

Configuration object for form fields.

```tsx
interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'select'
    | 'textarea'
    | 'date';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: (value: any) => string | undefined;
}
```

### Usage with Forms

```tsx
const formFields: FormField[] = [
  {
    name: 'name',
    label: 'Account Name',
    type: 'text',
    placeholder: 'Enter account name',
    required: true,
  },
  {
    name: 'type',
    label: 'Account Type',
    type: 'select',
    options: [
      { value: 'bank', label: 'Bank Account' },
      { value: 'cash', label: 'Cash' },
    ],
  },
  {
    name: 'balance',
    label: 'Initial Balance',
    type: 'number',
    placeholder: '0.00',
  },
];
```

---

## Modal Components

**Location:** `/app/components/modals/`

### EditModal

Generic modal for editing forms.

```tsx
import { EditModal } from '@/components';

<EditModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Account"
  fields={formFields}
  initialData={accountData}
  onSubmit={handleSubmit}
  isLoading={isSubmitting}
/>;
```

**Props:**

| Prop          | Type                     | Description            |
| ------------- | ------------------------ | ---------------------- |
| `isOpen`      | `boolean`                | Modal visibility       |
| `onClose`     | `() => void`             | Close handler          |
| `title`       | `string`                 | Modal title            |
| `fields`      | `FormField[]`            | Form field definitions |
| `initialData` | `object`                 | Initial form values    |
| `onSubmit`    | `(data: object) => void` | Submit handler         |
| `isLoading`   | `boolean`                | Loading state          |

### DeleteModal

Confirmation dialog for deletions.

```tsx
import { DeleteModal } from '@/components';

<DeleteModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleDelete}
  title="Delete Account"
  message="Are you sure you want to delete this account? This action cannot be undone."
  isLoading={isDeleting}
/>;
```

**Props:**

| Prop          | Type         | Description          |
| ------------- | ------------ | -------------------- |
| `isOpen`      | `boolean`    | Modal visibility     |
| `onClose`     | `() => void` | Close handler        |
| `onConfirm`   | `() => void` | Confirm handler      |
| `title`       | `string`     | Modal title          |
| `message`     | `string`     | Confirmation message |
| `isLoading`   | `boolean`    | Loading state        |
| `confirmText` | `string`     | Confirm button text  |
| `cancelText`  | `string`     | Cancel button text   |

### SuccessMessage

Toast notification for success states.

```tsx
import { SuccessMessage } from '@/components';

<SuccessMessage
  message="Account created successfully!"
  onClose={() => setShowSuccess(false)}
  duration={3000}
/>;
```

**Props:**

| Prop       | Type         | Description           |
| ---------- | ------------ | --------------------- |
| `message`  | `string`     | Success message       |
| `onClose`  | `() => void` | Close handler         |
| `duration` | `number`     | Auto-close delay (ms) |

### ErrorMessage

Toast notification for error states.

```tsx
import { ErrorMessage } from '@/components';

<ErrorMessage
  message="Failed to create account. Please try again."
  onClose={() => setShowError(false)}
/>;
```

**Props:**

| Prop      | Type         | Description   |
| --------- | ------------ | ------------- |
| `message` | `string`     | Error message |
| `onClose` | `() => void` | Close handler |

---

## UI Components

**Location:** `/app/components/ui/`

### Loader

Loading spinner component.

```tsx
import { Loader } from '@/components';

<Loader size="md" />;
```

**Props:**

| Prop        | Type                   | Description        |
| ----------- | ---------------------- | ------------------ |
| `size`      | `'sm' \| 'md' \| 'lg'` | Spinner size       |
| `className` | `string`               | Additional classes |

### Logo

App logo components.

```tsx
import { Logo_light, Logo_dark } from '@/components';

<Logo_light />  // For dark backgrounds
<Logo_dark />   // For light backgrounds
```

---

## Guard Components

**Location:** `/app/components/guards/`

### AuthGuard

Route protection wrapper.

```tsx
import AuthGuard from '@/components/guards/AuthGuard';

<AuthGuard>
  <ProtectedContent />
</AuthGuard>;
```

**Behavior:**

- Redirects unauthenticated users to `/sign-in`
- Redirects authenticated users away from auth pages
- Shows loading state during auth check

### AuthProvider

Authentication context provider.

```tsx
import AuthProvider from '@/components/guards/AuthContext';

<AuthProvider>
  <App />
</AuthProvider>;
```

**Provides:**

- `token: string | null` - Current auth token
- `setToken: (token: string) => void` - Set auth token
- `clearToken: () => void` - Clear auth token
- `isAuthenticated: boolean` - Authentication status

### useAuth Hook

Access authentication context.

```tsx
import { useAuth } from '@/components/guards/AuthContext';

const { token, isAuthenticated, setToken, clearToken } = useAuth();
```

---

## Onboarding Components

**Location:** `/app/onboarding/components/`

### WelcomeModal

Initial welcome screen for new users.

```tsx
import { WelcomeModal } from '@/onboarding';

<WelcomeModal
  isOpen={true}
  onStartTutorial={startOnboarding}
  onSkip={skipOnboarding}
/>;
```

### TutorialSpotlight

Highlights target elements during tutorial.

```tsx
import { TutorialSpotlight } from '@/onboarding';

<TutorialSpotlight
  targetId="add-account-button"
  isActive={true}
  position="bottom"
>
  <TutorialTooltip {...tooltipProps} />
</TutorialSpotlight>;
```

### TutorialTooltip

Information card for tutorial steps.

```tsx
import { TutorialTooltip } from '@/onboarding';

<TutorialTooltip
  title="Create Your First Account"
  description="Start by adding a financial account."
  progress={{ current: 1, total: 5, percentage: 20 }}
  onNext={nextStep}
  onSkip={skipOnboarding}
/>;
```

---

## Usage Patterns

### Importing Components

All public components are exported from `/app/components/index.ts`:

```tsx
import {
  CardGrid,
  FinancialCard,
  EditModal,
  DeleteModal,
  SuccessMessage,
  ErrorMessage,
  FormField,
  Loader,
  Footer,
  Navigation,
  Sidebar,
} from '@/components';
```

### Chart Components (separate import)

```tsx
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { DonutChart } from '@/components/charts/DonutChart';
```

### Onboarding Components

```tsx
import {
  OnboardingProvider,
  TutorialOverlay,
  useOnboarding,
} from '@/onboarding';
```

---

## Styling Guidelines

### Component Classes

All components use Tailwind CSS with consistent patterns:

```tsx
// Base card styling
className =
  'bg-white dark:bg-background-300 rounded-xl shadow-sm border border-stack-200 dark:border-stack-400';

// Text colors
className = 'text-stack-600 dark:text-stack-200';

// Hover states
className =
  'hover:bg-primary-50 dark:hover:bg-background-400 transition-colors';
```

### Dark Mode Support

All components support dark mode via the `dark:` prefix:

```tsx
<div className="bg-white dark:bg-background-300">
  <h2 className="text-stack-600 dark:text-stack-100">Title</h2>
</div>
```

### Responsive Design

Use Tailwind breakpoints for responsive layouts:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```
