'use client';

import { useState } from 'react';
import { useMyTransactions } from '@/api/transactions/queries';
import { useCategories } from '@/api/categories/queries';
import TransactionList from '@/components/ui/TransactionList';
import Button from '@/components/ui/Button';
import {
  TransactionsHeader,
  // TransactionsStats,
  TransactionsFilters,
  TransactionSuccessMessage,
  CreateTransactionSection,
} from '@/components/transactions';
import {
  filterTransactions,
  calculateTransactionStats,
} from '@/utils/transactions';
import { formatTransactionsForList } from '@/utils/dashboard';

export default function MyTransactions() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [lastCreatedId, setLastCreatedId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<
    'all' | 'INCOME' | 'EXPENSE' | 'TRANSFER'
  >('all');
  const [timeRange, setTimeRange] = useState<
    'week' | 'month' | 'quarter' | 'year' | 'all'
  >('all');

  // Load data from API
  const { data: transactions, isLoading: transactionsLoading } =
    useMyTransactions();

  // Format transactions
  const formattedTransactions = formatTransactionsForList(transactions || []);

  // Filter transactions
  const filteredTransactions = filterTransactions(
    formattedTransactions,
    filterType,
    timeRange
  );

  // Calculate stats
  const stats = calculateTransactionStats(filteredTransactions);

  const showSuccessMessage = (transactionId: number) => {
    setLastCreatedId(transactionId);
    setShowCreateForm(false);

    setTimeout(() => {
      setLastCreatedId(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <TransactionsHeader onAddClick={() => setShowCreateForm(true)} />

      {/* Success Message */}
      <TransactionSuccessMessage visible={!!lastCreatedId} />

      {/* Stats Cards (maybe later)*/}
      {/* <TransactionsStats
        totalIncome={stats.totalIncome}
        totalExpenses={stats.totalExpenses}
        netFlow={stats.netFlow}
      /> */}

      {/* Create Transaction Form */}
      <CreateTransactionSection
        isVisible={showCreateForm}
        onSuccess={showSuccessMessage}
        onCancel={() => setShowCreateForm(false)}
      />

      {/* Filters and Controls */}
      <TransactionsFilters
        filterType={filterType}
        timeRange={timeRange}
        onFilterTypeChange={setFilterType}
        onTimeRangeChange={setTimeRange}
      />

      {/* Transactions List */}
      {transactionsLoading ? (
        <div className="bg-white rounded-2xl border border-background-200 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-background-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-background-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-background-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-background-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-background-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <TransactionList
          transactions={filteredTransactions}
          title="All Transactions"
          showAccount={true}
          actions={
            <div className="flex items-center space-x-3">
              <span className="text-sm text-background-600">
                {filteredTransactions.length} transactions
              </span>
            </div>
          }
        />
      )}
    </div>
  );
}
