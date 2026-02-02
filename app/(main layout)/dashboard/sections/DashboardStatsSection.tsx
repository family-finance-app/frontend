'use client';

import { FinancialCard } from '@/components';

import { formatCurrencyAmount } from '@/utils';

import { DashboardChartDataProps } from '../types';
import { RiArrowDownLine, RiArrowUpLine, RiWalletLine } from '@remixicon/react';

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
          value={`${formatCurrencyAmount(income)} UAH`}
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
          icon={<RiArrowUpLine />}
          chartData={incomeComparison}
          chartColor="moss"
        />
      </div>

      <div>
        <FinancialCard
          title={labels.expenses}
          value={`${formatCurrencyAmount(expenses)} UAH`}
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
          icon={<RiArrowDownLine />}
          chartData={expensesComparison}
          chartColor="salmon"
        />
      </div>
      <div>
        <FinancialCard
          title={labels.savings}
          value={`${formatCurrencyAmount(savings)} UAH`}
          change={{
            value: `${savingsRate.toFixed(1)}%`,
            type: 'neutral',
            period: ` of income ${labels.description}`,
          }}
          description={`All savings ${labels.description}`}
          size="md"
          icon={<RiWalletLine />}
          chartData={savingsComparison}
          chartColor="kashmir"
        />
      </div>
    </div>
  );
}
