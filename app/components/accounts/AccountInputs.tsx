'use client';

import { useMemo } from 'react';
import { FormInput } from '@/components/shared/forms';
import { roboto } from '@/assets/fonts/fonts';

interface CurrencySelectProps {
  value: string;
  onChange: (currency: string) => void;
  symbol?: string;
  error?: string;
}

const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'UAH', label: 'Ukrainian Hryvnia (₴)', symbol: '₴' },
];

export function CurrencySelect({
  value,
  onChange,
  error,
}: CurrencySelectProps) {
  return (
    <div>
      <label
        className={`${roboto.className} block text-sm font-semibold text-background-900 mb-2`}
      >
        Currency *
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-background-300 rounded-xl bg-white dark:bg-stack-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-background-400 dark:text-primary-700"
      >
        {CURRENCIES.map((currency) => (
          <option key={currency.value} value={currency.value}>
            {currency.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}

export function AccountBalanceInput({
  value,
  onChange,
  symbol = '$',
  error,
}: {
  value: number;
  onChange: (balance: number) => void;
  symbol?: string;
  error?: string;
}) {
  return (
    <div>
      <label
        className={`${roboto.className} block text-sm font-semibold text-primary-800 mb-2`}
      >
        Initial Balance *
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-background-500 font-medium">
          {symbol}
        </span>
        <input
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          className={`w-full pl-8 pr-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            error
              ? 'border-danger-600 bg-danger-50'
              : 'border-background-300 bg-white dark:bg-stack-200 hover:border-background-400 focus:bg-background-50 dark:text-primary-700'
          }`}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-danger-600 flex items-center space-x-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export function AccountNameInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (name: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label
        className={`${roboto.className} block text-sm font-semibold text-primary-800 mb-2`}
      >
        Account Name *
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., Revolut Debit Card"
        className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
          error
            ? 'border-danger-600 bg-danger-50'
            : 'border-background-300 bg-white dark:bg-stack-200 hover:border-background-400 focus:bg-background-50 dark:text-primary-700'
        }`}
        maxLength={50}
      />
      {error && (
        <p className="mt-2 text-sm text-danger-600 flex items-center space-x-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export { CURRENCIES };
