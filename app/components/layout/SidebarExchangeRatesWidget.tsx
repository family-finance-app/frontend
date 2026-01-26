'use client';

import { useMemo, useEffect, useRef, useState } from 'react';

import { useExchangeRates } from '@/api/exchangeRate/queries';

import { formatCurrencyAmount } from '@/utils';

interface SidebarExchangeRatesWidgetProps {
  compact?: boolean;
}

export function SidebarExchangeRatesWidget({
  compact = false,
}: SidebarExchangeRatesWidgetProps) {
  const { exchangeRates, lastUpdated, isLoading } = useExchangeRates();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInfoOpen) return;

    const handleOutside = (event: MouseEvent | TouchEvent) => {
      if (!infoRef.current) return;
      if (!infoRef.current.contains(event.target as Node)) {
        setIsInfoOpen(false);
      }
    };

    document.addEventListener('click', handleOutside);
    document.addEventListener('touchstart', handleOutside);

    return () => {
      document.removeEventListener('click', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isInfoOpen]);

  const currentRates = useMemo(() => {
    if (!lastUpdated) return '';
    try {
      const date = new Date(lastUpdated);
      return date.toLocaleString('uk-ua');
    } catch (error) {
      console.warn('Failed to format fetchedAt:', error);
      return '';
    }
  }, [lastUpdated]);

  const currencies = [
    { code: 'USD', label: 'USD' },
    { code: 'EUR', label: 'EUR' },
  ];

  if (compact) {
    if (isLoading || !exchangeRates) {
      return (
        <div className="bg-background-50 rounded-lg p-3 space-y-2">
          <div className="h-4 bg-background-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-background-200 rounded w-full animate-pulse"></div>
        </div>
      );
    }

    return (
      <div className="bg-background-50 dark:bg-background-100 dark:text-primary-800 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-background-900 uppercase tracking-wider">
            Exchange Rates
          </span>
          <div className="relative group" ref={infoRef}>
            <button
              className="text-xs text-background-500 dark:text-background-800 hover:text-background-700 transition-colors"
              type="button"
              onClick={() => setIsInfoOpen((prev) => !prev)}
              aria-expanded={isInfoOpen}
              aria-controls="exchange-rate-tooltip"
            >
              ⓘ
            </button>
            <div
              className={`absolute right-0 top-full mt-2 ${
                isInfoOpen ? 'block' : 'hidden'
              } md:group-hover:block bg-primary-900/95 border border-primary-700 text-primary-50 text-sm rounded-lg px-4 py-3 whitespace-normal z-80 w-52 backdrop-blur-sm shadow-lg`}
              id="exchange-rate-tooltip"
            >
              {lastUpdated &&
                `Monobank exchange rate. Last updated: ${new Date(lastUpdated).toLocaleString('uk-ua')}`}
            </div>
          </div>
        </div>

        {currencies.map((currency) => {
          const rate = exchangeRates?.[currency.code];
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
  if (isLoading || !exchangeRates) {
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
          const rate = exchangeRates?.[currency.code];
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
