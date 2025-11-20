'use client';

import { Transaction } from '@/types/transaction';
import { Category } from '@/types/category';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';
import {
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

  const formatDate = (dateString: string): string => {
    try {
      // Try both createdAt and date formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Try parsing as ISO date or other formats
        const parts = dateString.split('T');
        if (parts.length > 0) {
          const parsed = new Date(parts[0]);
          if (!isNaN(parsed.getTime())) {
            return parsed.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
          }
        }
        return 'Invalid date';
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      console.error('Date parsing error:', e, dateString);
      return 'Invalid date';
    }
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
    <div className="bg-white rounded-2xl shadow-financial border border-background-100 overflow-hidden">
      {/* Transactions List - scrollable */}
      <div className="divide-y divide-background-100 max-h-[700px] overflow-y-auto">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 hover:bg-background-50 transition-colors"
          >
            <div className="grid grid-cols-3 gap-4 items-start">
              {/* Column 1 - Category Name */}
              <div>
                <p className="text-background-900 font-medium text-sm">
                  {getCategoryName(transaction.categoryId)}
                </p>
              </div>

              {/* Column 2 - Description & Date */}
              <div>
                <p className="text-background-900 text-sm">
                  {transaction.description ||
                    getCategoryName(transaction.categoryId)}
                </p>
                <p className="text-background-500 text-xs mt-1">
                  {formatDate(transaction.date || transaction.createdAt)}
                </p>
              </div>

              {/* Column 3 - Amount & Currency */}
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
                    : '→'}
                  {formatCurrencyAmount(Math.abs(transaction.amount))}{' '}
                  {currency}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
