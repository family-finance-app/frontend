'use client';

import { useEffect, useState } from 'react';
import { useMyTransactions } from '@/api/transactions/queries';
import { useCategories } from '@/api/categories/queries';
import { useMyAccounts } from '@/api/accounts/queries';

export default function TransactionList() {
  const { data: transactions, isLoading, error } = useMyTransactions();
  const { data: categories } = useCategories();
  const { data: accounts } = useMyAccounts();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Loading transactions...
        </p>
      </div>
    );
  }
  const getCurrencySymbol = (currency?: string) => {
    if (!currency) return '';
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      UAH: '₴',
    };
    return symbols[currency] || currency;
  };

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-red-600">Error loading transactions</p>
      </div>
    );
  }

  const transactionsArray = Array.isArray(transactions) ? transactions : [];
  const categoriesArray = Array.isArray(categories) ? categories : [];
  const accountsArray = Array.isArray(accounts) ? accounts : [];

  if (transactionsArray.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-400">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Recent Transactions
      </h3>
      <ul className="space-y-2">
        {transactionsArray.slice(0, 15).map((transaction) => {
          const categoryName =
            categoriesArray.find(
              (cat) => String(cat.id) === String(transaction.categoryId)
            )?.name ?? 'Uncategorized';
          const account = accountsArray.find(
            (account) => String(account.id) === String(transaction.accountId)
          );

          return (
            <li
              key={transaction.id}
              className="flex justify-between py-2 border-b"
            >
              <div>
                <span className="font-medium">{categoryName}</span>
                <span className="text-sm text-gray-500 ml-2">
                  {transaction.date}
                </span>
              </div>
              <div>
                <span>
                  {account?.name} ({`${account?.currency}`})
                </span>
              </div>
              <span
                className={`font-semibold ${
                  transaction.type === 'INCOME'
                    ? 'text-green-600'
                    : 'text-gray-600'
                }`}
              >
                {transaction.type === 'INCOME' ? '+' : '-'}
                {transaction.amount}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
