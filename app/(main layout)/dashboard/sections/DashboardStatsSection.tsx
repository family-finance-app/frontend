'use client';

import FinancialCard from '@/(main layout)/dashboard/cards/FinancialCard';
import { formatCurrencyAmount } from '@/utils/formatters';
import { DashboardChartDataProps } from '../types/dashboardChartDataProps';

export interface DashboardStatsSectionProps {
  income: number;
  expenses: number;
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
  incomeComparison?: DashboardChartDataProps[];
  expensesComparison?: DashboardChartDataProps[];
  savingsComparison?: DashboardChartDataProps[];
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

export default function DashboardStatsSection({
  income,
  expenses,
  savings,
  savingsRate,
  period,
  incomeChange,
  expensesChange,
  incomeComparison,
  expensesComparison,
  savingsComparison,
}: DashboardStatsSectionProps) {
  const getPeriodLabels = () => {
    switch (period) {
      case 'week':
        return {
          income: 'Weekly Income',
          expenses: 'Weekly Expenses',
          savings: 'Weekly Savings',
          description: 'this week',
          comparison: 'last week',
        };
      case 'year':
        return {
          income: 'Yearly Income',
          expenses: 'Yearly Expenses',
          savings: 'Yearly Savings',
          description: 'this year',
          comparison: 'last year',
        };
      default:
        return {
          income: 'Monthly Income',
          expenses: 'Monthly Expenses',
          savings: 'Monthly Savings',
          description: 'this month',
          comparison: 'last month',
        };
    }
  };

  const labels = getPeriodLabels();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-48 min-w-0">
      <div>
        <FinancialCard
          title={labels.income}
          value={formatCurrencyAmount(income)}
          change={
            incomeChange
              ? {
                  value: incomeChange.displayValue,
                  type: incomeChange.type,
                  period: ` vs ${labels.comparison}`,
                }
              : undefined
          }
          description={`All income sources ${labels.description}`}
          size="md"
          icon={INCOME_ICON}
          chartData={incomeComparison}
          chartColor="moss"
        />
      </div>

      <div>
        <FinancialCard
          title={labels.expenses}
          value={formatCurrencyAmount(expenses)}
          change={
            expensesChange
              ? {
                  value: expensesChange.displayValue,
                  type: expensesChange.type,
                  period: ` vs ${labels.comparison}`,
                }
              : undefined
          }
          description={`All spending ${labels.description}`}
          size="md"
          icon={EXPENSES_ICON}
          chartData={expensesComparison}
          chartColor="salmon"
        />
      </div>
      <div>
        <FinancialCard
          title={labels.savings}
          value={formatCurrencyAmount(savings)}
          change={{
            value: `${savingsRate.toFixed(1)}%`,
            type: 'neutral',
            period: ` of income ${labels.description}`,
          }}
          description={`All savings ${labels.description}`}
          size="md"
          icon={SAVINGS_ICON}
          chartData={savingsComparison}
          chartColor="kashmir"
        />
      </div>
    </div>
  );
}
