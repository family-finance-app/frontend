'use client';

import { useTransactions } from '@/api/transactions/queries';

export default function TransactionList() {
  const { data: transactions, isLoading, error } = useTransactions();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Loading transactions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-red-600">Error loading transactions</p>
      </div>
    );
  }

  const transactionsArray = Array.isArray(transactions) ? transactions : [];

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
        {transactionsArray.slice(0, 10).map((t) => (
          <li key={t.id} className="flex justify-between py-2 border-b">
            <div>
              <span className="font-medium">{t.category}</span>
              <span className="text-sm text-gray-500 ml-2">{t.date}</span>
            </div>
            <span
              className={`font-semibold ${
                t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {t.type === 'INCOME' ? '+' : '-'}${t.amount}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
