'use client';

import { useMemo } from 'react';
import { FormSelect, SelectOption } from '@/components/shared/forms';
import { roboto } from '@/assets/fonts/fonts';

interface AccountTypeSelectProps {
  value: string;
  onChange: (type: string) => void;
  error?: string;
}

const ACCOUNT_TYPES = [
  {
    value: 'CREDIT',
    label: 'Credit Card',
    icon: '💳',
    description: 'Credit bank card',
  },
  {
    value: 'DEBIT',
    label: 'Debit Card',
    icon: '💳',
    description: 'Debit bank card',
  },
  {
    value: 'BANK',
    label: 'Bank Account',
    icon: '🏦',
    description: 'Checking or savings account',
  },
  {
    value: 'CASH',
    label: 'Cash',
    icon: '💵',
    description: 'Physical cash on hand',
  },
  {
    value: 'INVESTMENT',
    label: 'Investment',
    icon: '📈',
    description: 'Stocks, bonds, or other investments',
  },
  {
    value: 'DEPOSIT',
    label: 'Deposit Account',
    icon: '💰',
    description: 'High-yield savings or term deposit',
  },
  {
    value: 'DIGITAL',
    label: 'Digital Account',
    icon: '📱',
    description: 'PayPal, Bitcoin, or other digital wallets',
  },
  {
    value: 'SAVINGS',
    label: 'Savings',
    icon: '💰',
    description: 'All types of savings for specific goals',
  },
];

export function AccountTypeSelect({
  value,
  onChange,
  error,
}: AccountTypeSelectProps) {
  const selectedType = useMemo(
    () => ACCOUNT_TYPES.find((type) => type.value === value),
    [value]
  );

  return (
    <div>
      <label
        className={`${roboto.className} block text-sm font-semibold text-background-900 mb-3`}
      >
        Account Type *
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ACCOUNT_TYPES.map((type) => (
          <label
            key={type.value}
            className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:bg-background-50 ${
              value === type.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-300 dark:hover:bg-primary-400 ring-2 ring-primary-200'
                : 'border-background-300 bg-white dark:bg-stack-200 dark:hover:bg-primary-400 hover:border-background-400'
            }`}
          >
            <input
              type="radio"
              name="accountType"
              value={type.value}
              checked={value === type.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 bg-background-100 rounded-lg flex items-center justify-center text-xl">
                {type.icon}
              </div>
              <div>
                <p className="font-medium text-primary-800">{type.label}</p>
                <p className="text-sm text-background-600 dark:text-stack-600">
                  {type.description}
                </p>
              </div>
            </div>
            {value === type.value && (
              <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}

export { ACCOUNT_TYPES };
