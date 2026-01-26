'use client';

import { SELECT_ACCOUNT_TYPES, currencyList } from '../types';

import { getRemixIcon } from '@/utils/getRemixIcon';

import { roboto } from '@/assets/fonts/fonts';

interface AccountPreviewProps {
  name: string;
  accountType: string;
  balance: number;
  currency: string;
}

export default function AccountPreview({
  name,
  accountType,
  balance,
  currency,
}: AccountPreviewProps) {
  const selectedType = SELECT_ACCOUNT_TYPES.find(
    (type) => type.value === accountType
  );
  const selectedCurrency = currencyList.find((curr) => curr.value === currency);

  return (
    <div className="bg-background-50 dark:bg-primary-600 border border-background-200 rounded-xl p-4">
      <h4
        className={`${roboto.className} text-sm font-semibold text-background-900 dark:text-background-200 mb-3`}
      >
        Account Preview
      </h4>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-100 dark:bg-background-100 rounded-lg flex items-center justify-center">
          {selectedType?.icon &&
            (() => {
              const Icon = getRemixIcon(selectedType.icon);
              return Icon ? (
                <Icon className="w-5 h-5 text-primary-700 dark:text-primary-800" />
              ) : null;
            })()}
        </div>
        <div>
          <p className="font-medium text-background-900 dark:text-background-100">
            {name || 'Account Name'}
          </p>
          <p className="text-sm text-background-600 dark:text-background-200">
            {selectedType?.label} • {selectedCurrency?.symbol}
            {balance.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
