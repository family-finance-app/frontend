'use client';

import { roboto } from '@/assets/fonts/fonts';

interface DashboardHeaderProps {
  timeframe: 'week' | 'month' | 'year';
  onTimeframeChange: (timeframe: 'week' | 'month' | 'year') => void;
}

export function DashboardHeader({
  timeframe,
  onTimeframeChange,
}: DashboardHeaderProps) {
  const getTimeframeText = () => {
    switch (timeframe) {
      case 'week':
        return 'this week';
      case 'month':
        return 'this month';
      case 'year':
        return 'this year';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1
          className={`${roboto.className} text-3xl font-bold text-background-900 mb-2`}
        >
          Personal Dashboard
        </h1>
        <p className="text-background-600">
          Welcome back! Here's your financial overview for {getTimeframeText()}.
        </p>
      </div>

      <div className="flex items-center space-x-3 mt-4 lg:mt-0">
        <div className="flex bg-background-100 rounded-xl p-1">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => onTimeframeChange(period)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                timeframe === period
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-background-600 hover:text-background-900'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
