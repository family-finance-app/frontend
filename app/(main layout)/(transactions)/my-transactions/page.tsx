'use client';

import { useState } from 'react';
import CreateTransactionForm from '@/components/transactions/CreateTransactionForm';
import TransactionList from '@/components/transactions/TransactionList';

export default function MyTransactions() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [lastCreatedId, setLastCreatedId] = useState<number | null>(null);

  const showSuccessMessage = (transactionId: number) => {
    setShowCreateForm(false);
    setLastCreatedId(transactionId);
    setTimeout(() => setLastCreatedId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Show message if transaction successfully created */}
      {lastCreatedId && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          Transaction created successfully!
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
          <CreateTransactionForm
            onSuccess={showSuccessMessage}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      <TransactionList />
    </div>
  );
}
