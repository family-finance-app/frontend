'use client';

import { roboto } from '@/assets/fonts/fonts';
import { ACCOUNT_TYPES } from './AccountTypeSelect';
import { CURRENCIES } from './AccountInputs';

interface AccountPreviewProps {
  name: string;
  accountType: string;
  balance: number;
  currency: string;
}

export function AccountPreview({
  name,
  accountType,
  balance,
  currency,
}: AccountPreviewProps) {
  const selectedType = ACCOUNT_TYPES.find((type) => type.value === accountType);
  const selectedCurrency = CURRENCIES.find((curr) => curr.value === currency);

  return (
    <div className="bg-background-50 border border-background-200 rounded-xl p-4">
      <h4
        className={`${roboto.className} text-sm font-semibold text-background-900 mb-3`}
      >
        Account Preview
      </h4>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-xl">
          {selectedType?.icon}
        </div>
        <div>
          <p className="font-medium text-background-900">
            {name || 'Account Name'}
          </p>
          <p className="text-sm text-background-600">
            {selectedType?.label} • {selectedCurrency?.symbol}
            {balance.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
