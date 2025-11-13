'use client';

import { Account } from '@/types/account';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';
import { getAccountTypeName, type AccountType } from '@/utils/accounts';
import { formatCurrencyAmount } from '@/utils/formatters';

interface AccountCardProps {
  account: Account;
}

const getCardColorStyles = (accountType: AccountType) => {
  const colorMap: Record<AccountType, { accent: string }> = {
    BANK: {
      accent: 'text-background-100',
    },
    DEBIT: {
      accent: 'text-moss-200',
    },
    CREDIT: {
      accent: 'text-salmon-300',
    },
    CASH: {
      accent: 'text-marzipan-200',
    },
    INVESTMENT: {
      accent: 'text-smalt-100',
    },
    DEPOSIT: {
      accent: 'text-hazel-50',
    },
    DIGITAL: {
      accent: 'text-kashmir-100',
    },
    SAVINGS: {
      accent: 'text-hazel-200',
    },
  };

  return colorMap[accountType] || colorMap.BANK;
};

export function AccountCard({ account }: AccountCardProps) {
  const colors = getCardColorStyles(account.type as AccountType);

  return (
    <div
      className={`rounded-2xl shadow-financial bg-background-700 border-background-500 p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 group`}
    >
      {/* Account Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div>
            <h4
              className={`${roboto.className} font-semibold text-background-100`}
            >
              {account.name}
            </h4>
            <p className={`text-sm font-medium ${colors.accent}`}>
              {getAccountTypeName(account.type as AccountType)}
            </p>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="mb-4">
        <div className="flex items-baseline space-x-2">
          <span
            className={`${jetbrainsMono.className} text-2xl font-bold text-background-100`}
          >
            {formatCurrencyAmount(account.balance)}
          </span>
          <span className="text-sm text-background-100">
            {account.currency}
          </span>
        </div>
      </div>
    </div>
  );
}
