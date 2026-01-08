'use client';

import { useState } from 'react';
import { Account } from '@/types/account';
import { Transaction } from '@/types/transaction';
import { Category } from '@/types/category';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button_financial';
import { getAccountTypeName } from '@/utils/accounts';
import { formatCurrencyAmount } from '@/utils/formatters';
import { AccountTransactions } from './AccountTransactions';
import { EditAccountForm } from './EditAccountForm';
import { EditAccountFormData } from '@/types/account';

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
      {/* List of account's transactions*/}
      <AccountTransactions
        accountId={account.id}
        transactions={accountTransactions}
        categories={categories}
        currency={account.currency}
        isLoading={isLoading}
      />

      {/* Edit/delete account*/}
      <div className="bg-white dark:bg-background-200 rounded-xl shadow-financial border border-primary-400 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3
              className={`${roboto.className} text-xl font-bold text-primary-800 truncate`}
            >
              {account.name}
            </h3>
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
        {onSave && (
          <EditAccountForm
            account={account}
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSave={onSave}
          />
        )}
      </div>
    </div>
  );
}
