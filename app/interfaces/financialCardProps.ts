import { ReactNode } from 'react';

import { DashboardChartDataProps } from './chartDataProps';

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
