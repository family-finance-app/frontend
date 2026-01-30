'use client';

import { Transaction, Category } from '@/(main layout)/transactions/types';

import {
  dateFormatters,
  formatCurrencyAmount,
  transactionFormatters,
} from '@/utils';

import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';

interface AccountTransactionListProps {
  accountId: number;
  accountName: string;
  transactions: Transaction[];
  categories: Category[];
  currency: string;
  isLoading?: boolean;
}

export default function AccountTransactionList({
  accountName,
  transactions,
  categories,
  currency,
  isLoading = false,
}: AccountTransactionListProps) {
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return {
      name: category?.name || 'Unknown',
      icon: category?.icon,
    };
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    if (dateA === dateB) {
      return b.id - a.id;
    }

    return dateB - dateA;
  });

  const typeConfig = {
    INCOME: {
      color: 'text-success-700 dark:text-primary-200',
      bgColor: 'bg-success-50',
      fallbackIcon: '↗',
    },
    EXPENSE: {
      color: 'text-danger-700 dark:text-danger-300',
      bgColor: 'bg-danger-50',
      fallbackIcon: '↙',
    },
    TRANSFER: {
      color: 'text-kashmir-500 dark:text-stack-200',
      bgColor: 'bg-primary-50',
      fallbackIcon: '⇄',
    },
  } as const;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-financial border border-background-100 p-6">
        <div className="flex items-center justify-center h-32">
          <p className="text-background-500">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-financial border border-background-100 p-6">
        <div className="flex items-center justify-center h-32">
          <p className="text-background-500">
            No transactions for this account
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-background-200 rounded-2xl shadow-financial border border-primary-400 overflow-hidden">
      <div className=" ">
        <h3
          className={`${roboto.className} text-lg font-bold text-primary-800 m-4`}
        >
          {accountName}
        </h3>
      </div>
      <div className="divide-y divide-background-100 dark:divide-background-200 dark:bg-background-50 max-h-[700px] overflow-y-auto">
        {sortedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 hover:bg-background-50 dark:hover:bg-background-100 transition-colors"
          >
            <div className="grid grid-cols-3 gap-4 items-start">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-primary-800 font-medium text-sm">
                    {getCategoryName(transaction.categoryId).name}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-primary-800 text-sm">
                  {transaction.description ||
                    getCategoryName(transaction.categoryId).name}
                </p>
                <p className="text-primary-700 text-xs mt-1">
                  {dateFormatters.toDisplay(transaction.date)}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={`${
                    jetbrainsMono.className
                  } font-bold text-sm ${transactionFormatters.typeColor(
                    transaction.type,
                  )}`}
                >
                  {transaction.type === 'INCOME'
                    ? '+'
                    : transaction.type === 'EXPENSE'
                      ? '-'
                      : ''}
                  {formatCurrencyAmount(transaction.amount)} {currency}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
