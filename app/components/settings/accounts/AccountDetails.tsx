'use client';

import { useState } from 'react';
import { Account } from '@/types/account';
import { Transaction } from '@/types/transaction';
import { Category } from '@/types/transaction';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button_financial';
import { getAccountTypeName, type AccountType } from '@/utils/accounts';
import { formatCurrencyAmount } from '@/utils/formatters';
import { AccountTransactions } from './AccountTransactions';
import { EditAccountForm, type EditAccountFormData } from './EditAccountForm';

interface AccountDetailsProps {
  account: Account;
  transactions: Transaction[];
  categories: Category[];
  onDelete: (accountId: number) => void;
  onSave?: (accountId: number, data: EditAccountFormData) => Promise<void>;
  isLoading?: boolean;
}

export function AccountDetails({
  account,
  transactions,
  categories,
  onDelete,
  onSave,
  isLoading = false,
}: AccountDetailsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const accountTransactions = transactions
    .filter((t) => {
      const transactionAccountId =
        typeof t.accountId === 'string'
          ? parseInt(t.accountId, 10)
          : t.accountId;
      return transactionAccountId === account.id;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt).getTime();
      const dateB = new Date(b.date || b.createdAt).getTime();
      return dateB - dateA;
    });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Account Info Header */}
      <div className="bg-white rounded-xl shadow-financial border border-background-100 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3
              className={`${roboto.className} text-xl font-bold text-background-900 truncate`}
            >
              {account.name}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-background-600">
                {getAccountTypeName(account.type as AccountType)}
              </span>
              <span
                className={`${jetbrainsMono.className} font-semibold ${
                  account.balance >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}
              >
                {account.balance < 0 ? '-' : ''}
                {formatCurrencyAmount(Math.abs(account.balance))}{' '}
                {account.currency}
              </span>
              <span className="text-background-500 text-xs">
                Created:{' '}
                {new Date(account.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              text={isEditOpen ? 'Close' : 'Edit'}
              type="button"
              variant={isEditOpen ? 'outline' : 'primary'}
              size="sm"
              onClick={() => setIsEditOpen(!isEditOpen)}
              disabled={isLoading}
            />
            <Button
              text="Delete"
              type="button"
              variant="danger"
              size="sm"
              onClick={() => onDelete(account.id)}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Edit Form - Below account info */}
      {onSave && (
        <EditAccountForm
          account={account}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={onSave}
        />
      )}

      {/* Transactions Section - At the bottom */}
      <div>
        <h3
          className={`${roboto.className} text-lg font-bold text-background-900 mb-4`}
        >
          Transactions ({accountTransactions.length})
        </h3>
        <AccountTransactions
          accountId={account.id}
          transactions={accountTransactions}
          categories={categories}
          currency={account.currency}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
