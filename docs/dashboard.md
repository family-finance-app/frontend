# Dashboard

This document provides a comprehensive guide to the Dashboard page architecture, components, and functionality.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Page Component](#page-component)
4. [Dashboard Sections](#dashboard-sections)
5. [Utility Functions](#utility-functions)
6. [Data Flow](#data-flow)
7. [State Management](#state-management)
8. [Adding Features](#adding-features)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The Dashboard (`/dashboard`) is the main financial overview page, providing:

- **Total Balance** - All accounts converted to UAH equivalent
- **Period Statistics** - Income/expenses for week/month/year
- **Recent Transactions** - Last 5 transactions with quick edit
- **Expense Breakdown** - Monthly spending by category
- **Exchange Rates** - Current USD/EUR rates (in sidebar)

### Key Features

| Feature                | Description                             |
| ---------------------- | --------------------------------------- |
| Multi-currency balance | Converts USD/EUR to UAH using NBU rates |
| Timeframe selection    | Week, month, or year statistics         |
| Period comparison      | Shows change vs previous period         |
| Real-time updates      | Data refreshes when transactions change |
| Responsive layout      | Adapts to mobile, tablet, desktop       |

---

## Architecture

```
Dashboard Page (dashboard/page.tsx)
├── Data Fetching (React Query hooks)
│   ├── useMyAccounts()
│   ├── useMyTransactions()
│   └── useCategories()
├── Data Processing (utility functions)
│   ├── formatAccountsForWidget()
│   ├── formatTransactionsForList()
│   ├── calculatePeriodStats()
│   └── calculateExpensesByCategory()
└── Component Tree
    ├── DashboardHeader
    │   └── Timeframe selector (week/month/year)
    ├── DashboardBalanceSection
    │   ├── Total balance widget
    │   └── Account breakdown
    ├── DashboardStatsSection
    │   ├── Income card
    │   ├── Expenses card
    │   └── Savings card
    ├── DashboardTransactionsSection
    │   └── Recent transactions list
    └── DashboardExpensesSection
        └── Category bar chart
```

### Design Patterns

1. **Client-Side Rendering** - All components use `'use client'` for SSR safety
2. **Lazy Data Loading** - React Query handles fetching with loading states
3. **Derived Data** - Calculations in utility functions, not components
4. **Period-Based Filtering** - Statistics adapt to selected timeframe
5. **Responsive Grid** - Tailwind CSS grid for all screen sizes

---

## Page Component

**Location:** `/app/(main layout)/dashboard/page.tsx`

### State

```tsx
const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
const [isClient, setIsClient] = useState(false);
```

| State       | Purpose                                           |
| ----------- | ------------------------------------------------- |
| `timeframe` | Selected period for statistics (default: 'month') |
| `isClient`  | Hydration safety flag                             |

### Data Sources

```tsx
const { data: accounts } = useMyAccounts();
const { data: transactions } = useMyTransactions();
const { data: categories } = useCategories();
```

### Layout Structure

```tsx
{
  /* Row 1: Balance + Stats */
}
<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
  <DashboardBalanceSection /> {/* 1 column */}
  <DashboardStatsSection /> {/* 2 columns */}
</div>;

{
  /* Row 2: Transactions + Expenses */
}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <DashboardTransactionsSection /> {/* 2 columns */}
  <DashboardExpensesSection /> {/* 1 column */}
</div>;
```

---

## Dashboard Sections

### 1. DashboardHeader

**Location:** `/app/(main layout)/dashboard/sections/DashboardHeader.tsx`

Displays greeting and timeframe selection.

```tsx
interface DashboardHeaderProps {
  timeframe: 'week' | 'month' | 'year';
  onTimeframeChange: (timeframe: 'week' | 'month' | 'year') => void;
}
```

**Features:**

- Personalized greeting
- Three toggle buttons (Week/Month/Year)
- Active button styling

### 2. DashboardBalanceSection

**Location:** `/app/(main layout)/dashboard/sections/DashboardBalanceSection.tsx`

Displays total balance in UAH and account list.

```tsx
interface DashboardBalanceSectionProps {
  totalBalance: number;
  formattedAccounts: Array<{
    id: string;
    name: string;
    type: string;
    balance: string;
    currency: string;
  }>;
  isLoading: boolean;
}
```

**Features:**

- Total balance converted to UAH
- Tooltip explaining currency conversion
- Individual account balances
- Loading skeleton state

**Currency Conversion:**

The `useTotalBalanceInUAH()` hook handles conversion:

```typescript
// Example: User has 3 accounts
// - UAH Account: 10,000 ₴
// - USD Account: $500 (rate: 41.25)
// - EUR Account: €200 (rate: 45.10)

// Total = 10,000 + (500 × 41.25) + (200 × 45.10)
// Total = 10,000 + 20,625 + 9,020
// Total = 39,645 ₴
```

### 3. DashboardStatsSection

**Location:** `/app/(main layout)/dashboard/sections/DashboardStatsSection.tsx`

Displays income, expenses, and savings with period comparison.

```tsx
interface DashboardStatsSectionProps {
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  savingsRate: number;
  period: 'week' | 'month' | 'year';
  incomeChange?: {
    value: number;
    type: 'positive' | 'negative' | 'neutral';
    displayValue: string;
  };
  expensesChange?: {
    value: number;
    type: 'positive' | 'negative' | 'neutral';
    displayValue: string;
  };
}
```

**Features:**

- Three financial cards
- Dynamic labels based on period
- Color-coded change indicators
- Savings rate percentage

**Color Logic:**

| Metric   | Increase        | Decrease        |
| -------- | --------------- | --------------- |
| Income   | 🟢 Green (good) | 🔴 Red (bad)    |
| Expenses | 🔴 Red (bad)    | 🟢 Green (good) |

### 4. DashboardTransactionsSection

**Location:** `/app/(main layout)/dashboard/sections/DashboardTransactionsSection.tsx`

Displays 5 most recent transactions.

```tsx
interface DashboardTransactionsSectionProps {
  transactions: Transaction[];
  isLoading: boolean;
}
```

**Features:**

- Transaction list with category icons
- Amount with currency
- Date and account info
- Edit button per transaction
- "View All" link to transactions page
- Loading skeleton state

### 5. DashboardExpensesSection

**Location:** `/app/(main layout)/dashboard/sections/DashboardExpensesSection.tsx`

Displays monthly spending by category.

```tsx
interface DashboardExpensesSectionProps {
  expensesByCategory: Array<{ label: string; value: number }>;
  isLoading: boolean;
}
```

**Features:**

- Bar chart of top 5 categories
- Always shows current month (ignores timeframe)
- Category name and amount
- Empty state when no expenses

---

## Utility Functions

**Location:** `/app/(main layout)/dashboard/utils/`

### Data Formatting

#### formatTransactionsForList()

Converts API response to standardized format.

```typescript
function formatTransactionsForList(apiTransactions: any[]): Transaction[];
```

- Parses amounts to numbers
- Standardizes date format
- Sorts by date (newest first)
- Includes category and account references

#### formatAccountsForWidget()

Formats accounts for display.

```typescript
function formatAccountsForWidget(
  accounts: Account[] | undefined,
): FormattedAccount[];
```

- Converts type codes to readable names
- Formats balance with currency
- Returns empty array if no accounts

### Statistics Calculation

#### calculatePeriodStats()

Main statistics function.

```typescript
function calculatePeriodStats(
  transactions: Transaction[],
  period: 'week' | 'month' | 'year',
): PeriodStats;
```

**Returns:**

```typescript
{
  income: number; // Sum of INCOME transactions
  expenses: number; // Sum of EXPENSE transactions
  netAmount: number; // income - expenses
  savings: number; // Transfers to savings accounts
  savingsRate: number; // (savings / income) × 100
  transactionsCount: number;
}
```

**Period Ranges:**

| Period | Start Date             | End Date |
| ------ | ---------------------- | -------- |
| Week   | Monday of current week | Today    |
| Month  | 1st of current month   | Today    |
| Year   | January 1st            | Today    |

#### calculateIncomeChange()

Compares current income to previous period.

```typescript
function calculateIncomeChange(
  currentIncome: number,
  transactions: Transaction[],
  period: 'week' | 'month' | 'year',
): ChangeInfo;
```

**Returns:**

```typescript
{
  value: number; // Absolute change
  type: 'positive' | 'negative' | 'neutral'; // Direction
  displayValue: string; // "+1,234.00" or "-567.00"
}
```

#### calculateExpensesChange()

Compares current expenses to previous period.

```typescript
function calculateExpensesChange(
  currentExpenses: number,
  transactions: Transaction[],
  period: 'week' | 'month' | 'year',
): ChangeInfo;
```

**Note:** Logic is inverted - spending less = positive (good).

#### calculateExpensesByCategory()

Aggregates expenses by category for current month.

```typescript
function calculateExpensesByCategory(
  transactions: Transaction[],
  categories: Category[],
): Array<{ label: string; value: number }>;
```

- Filters for current month only
- Groups by category
- Returns top 5 by amount

---

## Data Flow

### Initial Load

```
Page Renders
    │
    ▼
useEffect: setIsClient(true)
    │
    ▼
React Query Fetches (parallel):
├── useMyAccounts()
├── useMyTransactions()
└── useCategories()
    │
    ▼
Data Formatting:
├── formatAccountsForWidget(accounts)
└── formatTransactionsForList(transactions)
    │
    ▼
Calculations:
├── calculatePeriodStats(transactions, 'month')
├── calculateIncomeChange(...)
├── calculateExpensesChange(...)
├── useTotalBalanceInUAH(accounts)
└── calculateExpensesByCategory(...)
    │
    ▼
Components Render
```

### Timeframe Change

```
User Clicks Period Button
    │
    ▼
setTimeframe(newPeriod)
    │
    ▼
Recalculations with new period:
├── calculatePeriodStats(transactions, newPeriod)
├── calculateIncomeChange(..., newPeriod)
└── calculateExpensesChange(..., newPeriod)
    │
    ▼
Stats Section Updates:
├── Labels change
├── Values update
└── Comparison recalculates
    │
    ▼
Note: Expenses chart unchanged (always current month)
```

---

## State Management

### Page-Level State

| State       | Type                          | Purpose                     |
| ----------- | ----------------------------- | --------------------------- |
| `timeframe` | `'week' \| 'month' \| 'year'` | Controls statistics period  |
| `isClient`  | `boolean`                     | Prevents hydration mismatch |

### Component-Level State

**DashboardTransactionsSection:**

```tsx
const [editingTransaction, setEditingTransaction] =
  useState<Transaction | null>(null);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
```

---

## Adding Features

### Adding a New Timeframe (e.g., Quarter)

1. Update type definitions:

   ```typescript
   type Timeframe = 'week' | 'month' | 'year' | 'quarter';
   ```

2. Add button in DashboardHeader

3. Update `calculatePeriodStats()`:

   ```typescript
   case 'quarter':
     const quarter = Math.floor(now.getMonth() / 3);
     startDate = new Date(now.getFullYear(), quarter * 3, 1);
     break;
   ```

4. Update period labels in DashboardStatsSection

### Adding a New Metric

1. Calculate in `calculatePeriodStats()`:

   ```typescript
   const investments = periodTransactions
     .filter((t) => t.type === 'INVESTMENT')
     .reduce((sum, t) => sum + t.amount, 0);
   ```

2. Add card in DashboardStatsSection

3. Pass props through page component

### Adding a New Section

1. Create component: `DashboardNewSection.tsx`
2. Define props interface
3. Add to page layout grid
4. Implement loading and empty states

---

## Troubleshooting

### Issue: Numbers showing leading zeros

**Cause:** Backend returns amounts as strings.

**Solution:** `formatTransactionsForList()` includes:

```typescript
amount: Number(transaction.amount) || 0;
```

### Issue: Hydration mismatch errors

**Cause:** SSR renders differently than client.

**Solution:** Use `isClient` flag:

```tsx
if (!isClient) return null;
```

### Issue: Statistics not updating

**Cause:** Component not re-rendering.

**Solution:** All calculations run at render time, so they update when:

- `transactions` data changes
- `timeframe` state changes

### Issue: Exchange rates stale

**Cause:** 24-hour cache.

**Solution:** Clear cache:

```javascript
localStorage.removeItem('exchange_rates_cache');
```

---

## Testing Checklist

- [ ] All timeframe buttons work
- [ ] Statistics change correctly per period
- [ ] Change indicators show correct colors
- [ ] Income: green for increase, red for decrease
- [ ] Expenses: red for increase, green for decrease
- [ ] Category chart shows current month only
- [ ] Total balance converts currencies correctly
- [ ] Loading states display properly
- [ ] Empty states show when no data
- [ ] Responsive layout works on all devices
- [ ] Transaction edit modal functions correctly
- [ ] No console errors
- [ ] No hydration mismatches
