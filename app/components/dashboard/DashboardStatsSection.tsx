'use client';

import FinancialCard from '@/components/ui/FinancialCard';

interface DashboardStatsSectionProps {
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsPercentage: number;
}

const INCOME_ICON = (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 11l5-5m0 0l5 5m-5-5v12"
    />
  </svg>
);

const EXPENSES_ICON = (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 13l-5 5m0 0l-5-5m5 5V6"
    />
  </svg>
);

const SAVINGS_ICON = (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

export function DashboardStatsSection({
  monthlyIncome,
  monthlyExpenses,
  savingsPercentage,
}: DashboardStatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      <FinancialCard
        title="Monthly Income"
        value={monthlyIncome}
        change={{
          value: 450.0,
          type: 'positive',
          period: 'vs last month',
        }}
        description="All income sources"
        size="md"
        icon={INCOME_ICON}
      />

      <FinancialCard
        title="Monthly Expenses"
        value={monthlyExpenses}
        change={{
          value: 125.3,
          type: 'negative',
          period: 'vs last month',
        }}
        description="All spending"
        size="md"
        icon={EXPENSES_ICON}
      />

      <FinancialCard
        title="Savings Rate"
        value={`${savingsPercentage.toFixed(1)}%`}
        change={{
          value: '5%',
          type: 'positive',
          period: 'vs last month',
        }}
        description="Of total income"
        size="md"
        icon={SAVINGS_ICON}
      />
    </div>
  );
}
