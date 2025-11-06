'use client';

import { useMemo } from 'react';
import { useExchangeRates } from '@/api/exchangeRate/queries';
import { formatCurrencyAmount } from '@/utils/formatters';

interface SidebarExchangeRatesWidgetProps {
  compact?: boolean;
}

/**
 * Exchange Rates Widget for Sidebar
 * Displays current USD/EUR to UAH exchange rates
 * Available in compact mode for sidebar and full mode for dashboard
 */
export function SidebarExchangeRatesWidget({
  compact = false,
}: SidebarExchangeRatesWidgetProps) {
  const { data: rates, isLoading } = useExchangeRates();

  const lastUpdated = useMemo(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const cached = localStorage.getItem('exchange_rates_cache');
        if (cached) {
          const { timestamp } = JSON.parse(cached);
          const date = new Date(timestamp);
          return date.toLocaleString('uk-UA');
        }
      }
    } catch (error) {
      console.warn('Failed to get cache timestamp:', error);
    }
    return '';
  }, [rates]);

  const currencies = [
    { code: 'USD', label: 'USD' },
    { code: 'EUR', label: 'EUR' },
  ];

  if (compact) {
    // compact version for sidebar
    if (isLoading || !rates) {
      return (
        <div className="bg-background-50 rounded-lg p-3 space-y-2">
          <div className="h-4 bg-background-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-background-200 rounded w-full animate-pulse"></div>
        </div>
      );
    }

    return (
      <div className="bg-background-50 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-background-900 uppercase tracking-wider">
            Exchange Rates
          </span>
          <div className="relative group">
            <button className="text-xs text-background-500 hover:text-background-700 transition-colors">
              ⓘ
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-background-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50">
              {lastUpdated && `Updated: ${lastUpdated}`}
            </div>
          </div>
        </div>

        {currencies.map((currency) => {
          const rate = rates[currency.code];
          if (!rate) return null;

          return (
            <div
              key={currency.code}
              className="flex items-center justify-between text-sm py-1"
            >
              <span className="text-background-700">{currency.label}</span>
              <span className="font-mono font-semibold text-background-900">
                {formatCurrencyAmount(rate)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // full version for dashboard
  if (isLoading || !rates) {
    return (
      <div className="bg-white rounded-2xl shadow-financial p-6 border border-background-100">
        <h3 className="text-lg font-semibold text-foreground-900 mb-4">
          Exchange Rates
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-background-200 rounded w-full"></div>
          <div className="h-8 bg-background-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-financial p-6 border border-background-100">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-foreground-900">
          Exchange Rates
        </h3>
        <div className="text-xs text-background-500">
          {lastUpdated && `Updated: ${lastUpdated}`}
        </div>
      </div>

      <div className="space-y-3">
        {currencies.map((currency) => {
          const rate = rates[currency.code];
          if (!rate) return null;

          return (
            <div
              key={currency.code}
              className="flex items-center justify-between p-3 rounded-lg bg-background-50 hover:bg-background-100 transition-colors"
            >
              <span className="font-medium text-foreground-900">
                {currency.label}
              </span>
              <div className="text-right">
                <div className="text-lg font-semibold text-foreground-900">
                  {formatCurrencyAmount(rate)}
                </div>
                <div className="text-xs text-background-500">
                  1 {currency.code} = {formatCurrencyAmount(rate)} UAH
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-background-100">
        <p className="text-xs text-background-600">
          Exchange rates update at 8 AM and 3 PM daily and are cached in the
          browser to minimize API requests.
        </p>
      </div>
    </div>
  );
}
