'use client';

import { Account } from '@/types/account';
import { jetbrainsMono } from '@/assets/fonts/fonts';
import { Transaction } from '@/types/transaction';
import { getAccountTypeName } from '@/utils/accounts';
import { formatCurrencyAmount } from '@/utils/formatters';

interface AccountsListProps {
  accounts: Account[];
  transactions: Transaction[];
  selectedAccountId: number | null;
  onSelectAccount: (accountId: number) => void;
}

export function AccountsList({
  accounts,
  selectedAccountId,
  onSelectAccount,
  transactions,
}: AccountsListProps) {
  return (
    <div className="divide-y divide-background-100">
      {accounts.map((account) => {
        const isSelected = selectedAccountId === account.id;
        const accountTxCount = transactions.filter(
          (t) =>
            (typeof t.accountId === 'string'
              ? parseInt(t.accountId, 10)
              : t.accountId) === account.id
        ).length;

        return (
          <button
            key={account.id}
            onClick={() => onSelectAccount(account.id)}
            className={`w-full p-4 text-left transition-all hover:bg-primary-100 dark:hover:bg-background-100 ${
              isSelected
                ? 'bg-primary-100 dark:bg-background-200 border-l-4 border-l-primary-500'
                : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold text-sm truncate ${
                    isSelected
                      ? 'text-primary-700 dark:text-primary-800'
                      : 'text-primary-800'
                  }`}
                >
                  {account.name}
                </p>
                <p className="text-xs text-background-500 dark:text-primary-700 mt-0.5">
                  {getAccountTypeName(account.type)} • {accountTxCount}{' '}
                  transactions
                </p>
                <p
                  className={`${
                    jetbrainsMono.className
                  } text-sm font-semibold mt-1.5 ${
                    account.balance >= 0
                      ? 'text-success-700'
                      : 'text-danger-700'
                  }`}
                >
                  {account.balance < 0 ? '-' : ''}
                  {formatCurrencyAmount(Math.abs(account.balance))}{' '}
                  {account.currency}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
