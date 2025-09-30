'use client';

import { useState, useEffect } from 'react';
import { CreateTransactionFormData } from '@/types/transaction';
import { useCreateTransaction } from '@/hooks/useCreateTransaction';
import { transactionAPI } from '@/services/transactionAPI';
import { Category } from '@/types/transaction';

export default function MyTransactions() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<
    Array<{ id: number; title: string; type: string; currency: string }>
  >([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newTransaction, setNewTransaction] =
    useState<CreateTransactionFormData>({
      type: 'EXPENSE',
      amount: '',
      date: new Date().toISOString().split('T')[0], // today
      categoryId: '',
      accountId: '',
    });

  const { createTransaction, isLoading, errors, successMessage } =
    useCreateTransaction();

  // Load categories and accounts on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesResponse, accountsResponse] = await Promise.all([
          transactionAPI.getCategories(),
          transactionAPI.getAccounts(),
        ]);
        setCategories(categoriesResponse.categories);
        setAccounts(accountsResponse.accounts);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  // categories filter based on transaction type
  const filteredCategories = categories.filter((category) => {
    if (newTransaction.type === 'TRANSFER') return true; // show all categories for transfers
    return category.type === newTransaction.type;
  });

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await createTransaction(newTransaction);
    if (success) {
      setNewTransaction({
        type: 'EXPENSE',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        categoryId: '',
        accountId: '',
      });
      setShowCreateForm(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {errors.general}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Transactions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your income, expenses, and transfers
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showCreateForm ? 'Cancel' : '+ Add Transaction'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Add New Transaction
          </h3>
          <form onSubmit={handleCreateTransaction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Transaction Type
                </label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => {
                    setNewTransaction({
                      ...newTransaction,
                      type: e.target.value,
                      categoryId: '',
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="EXPENSE">💸 Expense</option>
                  <option value="INCOME">💰 Income</option>
                  <option value="TRANSFER">🔄 Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account
                </label>
                <select
                  value={newTransaction.accountId}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      accountId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.title} ({account.type}) - {account.currency}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={newTransaction.categoryId}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      categoryId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select category</option>
                  {filteredCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon ? `${category.icon} ` : ''}
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      amount: e.target.value,
                    })
                  }
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      date: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md transition-colors"
              >
                {isLoading ? 'Adding...' : 'Add Transaction'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                disabled={isLoading}
                className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Recent Transactions
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Transaction list will be displayed here...
        </p>
      </div>
    </div>
  );
}
