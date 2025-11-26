import { DashboardChartDataProps } from './chartDataProps';

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
