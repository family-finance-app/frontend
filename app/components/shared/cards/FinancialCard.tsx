import { roboto, jetbrainsMono } from '../../../assets/fonts/fonts';
import { AreaChart } from '@/components/charts/AreaChart';

import { formatCurrencyAmount } from '@/utils/formatters';
import { ReactNode } from 'react';

import { DashboardChartDataProps } from '@/(main layout)/dashboard/types';

export interface FinancialCardProps {
  title: string;
  value: number | string;
  change?: {
    value: string | number;
    type: 'positive' | 'negative' | 'neutral';
    period?: string;
  };
  description?: string;
  icon?: ReactNode;
  trend?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  chartData?: DashboardChartDataProps[];
  chartColor?:
    | 'moss'
    | 'hazel'
    | 'salmon'
    | 'kashmir_light'
    | 'kashmir'
    | 'primary'
    | 'pink'
    | 'moss_light'
    | 'fuchsia_pink';
}

export default function FinancialCard({
  title,
  value,
  change,
  description,
  icon,
  trend,
  className = '',
  size = 'md',
  chartData,
  chartColor = 'salmon',
}: FinancialCardProps) {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const valueClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const changeColor = {
    positive: 'text-success-700',
    negative: 'text-danger-700',
    neutral: 'text-kashmir-500',
  };

  return (
    <div
      className={`bg-white dark:bg-background-100 rounded-2xl shadow-financial hover:shadow-financial-lg transition-all duration-300 border border-background-100 ${sizeClasses[size]} ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3
            className={`${roboto.className} text-background-600 dark:text-background-800 font-medium text-sm uppercase tracking-wider`}
          >
            {title}
          </h3>
        </div>
        {icon && <div className="text-background-400">{icon}</div>}
      </div>

      <div className="flex items-center justify-between mb-3">
        <div
          className={`${jetbrainsMono.className} ${valueClasses[size]} font-bold text-background-900`}
        >
          {value}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          {change && (
            <div
              className={`${jetbrainsMono.className} text-sm font-semibold ${
                changeColor[change.type]
              }`}
            >
              {change.type === 'positive' &&
                typeof change.value === 'number' &&
                '+'}
              {typeof change.value === 'number'
                ? `${change.value.toLocaleString()}`
                : `${change.value}`}
              {change.period && (
                <span className="text-background-500 dark:text-primary-800 font-normal ml-1">
                  {change.period}
                </span>
              )}
            </div>
          )}
          {description && (
            <div className="text-xs text-background-500 dark:text-stack-600 mt-1">
              {description}
            </div>
          )}
        </div>
        {trend && <div className="ml-4">{trend}</div>}
      </div>

      {chartData && chartData.length > 0 && (
        <div className="mt-8 -mb-2 h-48 min-h-48 w-full min-w-0">
          <AreaChart
            data={chartData}
            index="date"
            categories={['amount']}
            showLegend={false}
            showYAxis={false}
            startEndOnly={true}
            valueFormatter={(value) => formatCurrencyAmount(value)}
            className="h-full w-full"
            colors={[chartColor]}
          />
        </div>
      )}
    </div>
  );
}
