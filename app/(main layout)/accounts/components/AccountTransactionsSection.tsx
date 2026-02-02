'use client';

import { useState } from 'react';

import { Account, EditAccountFormData } from '../types';

import { Transaction, Category } from '@/(main layout)/transactions/types';

import { AccountTransactionList } from '../index';

interface AccountTransactionsSectionProps {
  account: Account;
  transactions: Transaction[];
  categories: Category[];
  onDelete: (accountId: number) => void;
  onSave?: (accountId: number, data: EditAccountFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function AccountTransactionsSection({
  account,
  transactions,
  categories,
  isLoading = false,
}: AccountTransactionsSectionProps) {
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
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

  return (
    <div className="space-y-6 animate-fade-in">
      <AccountTransactionList
        accountId={account.id}
        accountName={account.name}
        transactions={accountTransactions}
        categories={categories}
        currency={account.currency}
        isLoading={isLoading}
      />
    </div>
  );
}
