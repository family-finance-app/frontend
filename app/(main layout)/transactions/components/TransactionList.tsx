'use client';

import { ReactNode } from 'react';
import { Transaction } from '../types';

import TransactionItem from './TransactionItem';

interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
  showHeader?: boolean;
  maxItems?: number;
  emptyMessage?: string;
  showAccount?: boolean;
  compact?: boolean;
  actions?: ReactNode;
  accounts?: Array<{
    id: number;
    name: string;
    type: string;
    currency: string;
  }>;
  categories?: Array<{
    id: number;
    name: string;
    type: string;
    icon?: string;
    color?: string;
  }>;
  onEditTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (transactionId: number) => void;
}

export default function TransactionList({
  transactions,
  title = 'Recent Transactions',
  showHeader = true,
  maxItems,
  emptyMessage = 'No transactions found',
  showAccount = false,
  compact = false,
  actions,
  accounts = [],
  categories = [],
  onEditTransaction,
  onDeleteTransaction,
}: TransactionListProps) {
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    if (dateA === dateB) {
      return b.id - a.id;
    }

    return dateB - dateA;
  });

  const displayTransactions = maxItems
    ? sortedTransactions.slice(0, maxItems)
    : sortedTransactions;

  return (
    <div className="bg-white dark:bg-primary-800 rounded-2xl shadow-financial border border-background-100 dark:border-background-700">
      {showHeader && (
        <div className="flex flex-row items-center justify-between gap-3 p-4 sm:p-6 border-b border-background-100">
          <h3 className="text-base sm:text-lg font-semibold text-background-900 dark:text-stack-100 shrink-0">
            {title}
          </h3>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}

      <div className={showHeader ? 'p-6' : 'p-4'}>
        {displayTransactions.length === 0 ? (
          <div className="text-center py-8 text-background-500 dark:text-stack-100">
            <div className="text-4xl mb-2"></div>
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-0">
            {displayTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                showAccount={showAccount}
                compact={compact}
                categories={categories}
                accounts={accounts}
                onEdit={onEditTransaction}
                onDelete={onDeleteTransaction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { TransactionItem };
