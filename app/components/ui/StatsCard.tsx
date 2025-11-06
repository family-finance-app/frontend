import { ReactNode } from 'react';
import { jetbrainsMono, roboto } from '../../assets/fonts/fonts';
import { formatCurrencyAmount } from '@/utils/formatters';

interface ChartData {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

interface StatsCardProps {
  title: string;
  data: ChartData[];
  type?: 'pie' | 'bar' | 'line' | 'donut';
  showLegend?: boolean;
  height?: string;
  className?: string;
}

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  color?: 'primary' | 'success' | 'danger' | 'warning';
  showPercentage?: boolean;
}

function ProgressBar({
  label,
  value,
  max,
  color = 'primary',
  showPercentage = false,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    danger: 'bg-danger-500',
    warning: 'bg-warning-500',
  };

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-background-700">{label}</span>
      </div>
      <div className="w-full bg-background-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function SimplePieChart({
  data,
  size = 'md',
}: {
  data: ChartData[];
  size?: 'sm' | 'md' | 'lg';
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
  };

  const colors = [
    '#5b887f', // primary-500
    '#10b981', // success-500
    '#f59e0b', // warning-500
    '#ef4444', // danger-500
    '#6b7280', // background-500
    '#8b5cf6', // purple-500
  ];

  return (
    <div className="flex items-center justify-center">
      <svg className={sizeClasses[size]} viewBox="0 0 100 100">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = (cumulativePercentage / 100) * 360 - 90;
          const endAngle = startAngle + angle;

          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

          const largeArc = angle > 180 ? 1 : 0;

          const pathData = [
            `M 50 50`,
            `L ${x1} ${y1}`,
            `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z',
          ].join(' ');

          cumulativePercentage += percentage;

          return (
            <path
              key={index}
              d={pathData}
              fill={item.color || colors[index % colors.length]}
              stroke="white"
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </div>
  );
}

export default function StatsCard({
  title,
  data,
  type = 'bar',
  showLegend = true,
  height = 'h-64',
  className = '',
}: StatsCardProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      className={`bg-white rounded-2xl shadow-financial border border-background-100 p-6 ${className}`}
    >
      <h3
        className={`${roboto.className} text-lg font-semibold text-background-900 mb-6`}
      >
        {title}
      </h3>

      <div className={`${height} flex items-center justify-center`}>
        {type === 'pie' && <SimplePieChart data={data} size="lg" />}
        {type === 'donut' && <SimplePieChart data={data} size="lg" />}
        {(type === 'bar' || type === 'line') && (
          <div className="w-full space-y-4">
            {data.map((item, index) => (
              <ProgressBar
                key={index}
                label={item.label}
                value={item.value}
                max={total}
                color={index % 2 === 0 ? 'primary' : 'success'}
              />
            ))}
          </div>
        )}
      </div>

      {showLegend && (
        <div className="mt-6 pt-6 border-t border-background-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.map((item, index) => {
              const colors = [
                'bg-primary-500',
                'bg-success-500',
                'bg-warning-500',
                'bg-danger-500',
              ];
              const percentage = ((item.value / total) * 100).toFixed(1);

              return (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      colors[index % colors.length]
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-background-900 truncate">
                      {item.label}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p
                        className={`${jetbrainsMono.className} text-sm text-background-600`}
                      >
                        {formatCurrencyAmount(item.value)}
                      </p>
                      <span className="text-xs text-background-500">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export { ProgressBar };
