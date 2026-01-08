'use client';

import { Transaction } from '@/types/transaction';
import { Category } from '@/types/category';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';
import {
  dateFormatters,
  formatCurrencyAmount,
  transactionFormatters,
} from '@/utils/formatters';

interface AccountTransactionsProps {
  accountId: number;
  transactions: Transaction[];
  categories: Category[];
  currency: string;
  isLoading?: boolean;
}

export function AccountTransactions({
  transactions,
  categories,
  currency,
  isLoading = false,
}: AccountTransactionsProps) {
  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown';
  };

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
          Transactions ({transactions.length})
        </h3>
      </div>
      <div className="divide-y divide-background-100 dark:divide-background-200 dark:bg-background-50 max-h-[700px] overflow-y-auto">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 hover:bg-background-50 dark:hover:bg-background-100 transition-colors"
          >
            <div className="grid grid-cols-3 gap-4 items-start">
              <div>
                <p className="text-primary-800 font-medium text-sm">
                  {getCategoryName(transaction.categoryId)}
                </p>
              </div>

              <div>
                <p className="text-primary-800 text-sm">
                  {transaction.description ||
                    getCategoryName(transaction.categoryId)}
                </p>
                <p className="text-primary-700 text-xs mt-1">
                  {dateFormatters.toDisplay(
                    transaction.date || transaction.createdAt
                  )}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={`${
                    jetbrainsMono.className
                  } font-bold text-sm ${transactionFormatters.typeColor(
                    transaction.type
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
