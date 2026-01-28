'use client';

import { useState, useMemo } from 'react';
import { showGlobalSuccess, showGlobalError } from '@/lib/global-alerts';

import { useMainData } from '@/(main layout)/data/MainDataProvider';
import {
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/api/transactions/mutations';
import {
  TransactionList,
  TransactionsFilters,
  filterTransactions,
  enrichTransactions,
  formatTransactions,
} from './index';
import { Category, Transaction } from './types';
import { EditModal, DeleteModal, type FormField } from '@/components';

interface EditTransactionFormData {
  type: string;
  amount: string;
  date: string;
  categoryId: string;
  description: string;
}

export default function MyTransactions() {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingTransactionId, setDeletingTransactionId] = useState<
    number | null
  >(null);
  const [filterType, setFilterType] = useState<
    'all' | 'INCOME' | 'EXPENSE' | 'TRANSFER'
  >('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>(
    'all',
  );

  const { transactions, accounts, categories, isLoading } = useMainData();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const formattedTransactions = formatTransactions(transactions || []);

  const enrichedTransactions = enrichTransactions(
    formattedTransactions,
    accounts,
    categories,
  );

  const filteredTransactions = filterTransactions(
    enrichedTransactions,
    filterType,
    timeRange,
  );

  const transactionTypes = [
    { value: 'INCOME', label: 'Income' },
    { value: 'EXPENSE', label: 'Expense' },
    { value: 'TRANSFER', label: 'Transfer' },
  ];

  const filteredCategories = useMemo(() => {
    if (!editingTransaction || !categories) return [];
    return categories.filter(
      (category: Category) => category.type === editingTransaction.type,
    );
  }, [categories, editingTransaction]);

  const categoryOptions = filteredCategories.map((category: Category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  const transactionFormFields: FormField[] = editingTransaction
    ? [
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          required: true,
          options: transactionTypes,
        },
        {
          name: 'amount',
          label: 'Amount',
          type: 'number',
          required: true,
          placeholder: '0.00',
        },
        {
          name: 'date',
          label: 'Date',
          type: 'date',
          required: true,
        },
        {
          name: 'categoryId',
          label: 'Category',
          type: 'select',
          required: true,
          options: categoryOptions,
        },
        {
          name: 'description',
          label: 'Description (Optional)',
          type: 'textarea',
          placeholder: 'Add a description to this transaction...',
        },
      ]
    : [];

  const validateTransactionForm = (
    data: EditTransactionFormData,
  ): Partial<Record<keyof EditTransactionFormData, string>> => {
    const errors: Partial<Record<keyof EditTransactionFormData, string>> = {};

    if (!data.amount) {
      errors.amount = 'Amount is required';
    }

    if (!data.date) {
      errors.date = 'Date is required';
    }

    if (!data.categoryId) {
      errors.categoryId = 'Category is required';
    }

    return errors;
  };

  const handleSaveTransaction = async (data: EditTransactionFormData) => {
    if (!editingTransaction) return;

    try {
      await updateTransaction.mutateAsync({
        id: editingTransaction.id,
        data: {
          amount: parseFloat(data.amount),
          date: data.date,
          categoryId: parseInt(data.categoryId, 10),
          description: data.description || '',
        },
      });
      showGlobalSuccess('Transaction updated');
    } catch (err: any) {
      showGlobalError(err?.message || 'Failed to update transaction');
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    console.log('Opening edit modal for transaction:', transaction);
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    console.log('Closing edit modal');
    setIsEditModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (transactionId: number) => {
    setDeletingTransactionId(transactionId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTransactionId) return;
    try {
      await deleteTransaction.mutateAsync(deletingTransactionId);
      setDeletingTransactionId(null);
      showGlobalSuccess(`${deletingItemName} deleted`);
    } catch (err: any) {
      setDeletingTransactionId(null);
      showGlobalError(err?.message || 'Failed to delete transaction');
    }
  };

  const deletingTransaction = filteredTransactions.find(
    (t) => t.id === deletingTransactionId,
  );

  const deletingItemName =
    deletingTransaction?.description ||
    deletingTransaction?.type ||
    'Transaction';

  return (
    <div className="space-y-6">
      <TransactionsFilters
        filterType={filterType}
        timeRange={timeRange}
        onFilterTypeChange={setFilterType}
        onTimeRangeChange={setTimeRange}
      />

      {isLoading ? (
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
          accounts={accounts || []}
          categories={categories || []}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
          actions={
            <div className="flex items-center space-x-3">
              <span className="text-sm text-background-600 dark:text-background-100">
                {filteredTransactions.length} transactions
              </span>
            </div>
          }
        />
      )}

      {editingTransaction && (
        <EditModal<EditTransactionFormData>
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSubmit={handleSaveTransaction}
          title="Edit Transaction"
          fields={transactionFormFields}
          initialData={{
            type: editingTransaction.type,
            amount: editingTransaction.amount.toString(),
            date:
              typeof editingTransaction.date === 'string' &&
              editingTransaction.date.match(/^\d{4}-\d{2}-\d{2}/)
                ? editingTransaction.date.split('T')[0]
                : new Date(editingTransaction.date).toISOString().split('T')[0],
            categoryId: editingTransaction.categoryId.toString(),
            description: editingTransaction.description || '',
          }}
          validateForm={validateTransactionForm}
          isLoading={updateTransaction.isPending}
        />
      )}

      <DeleteModal
        isOpen={!!deletingTransactionId}
        title="Delete Transaction"
        itemName={deletingItemName}
        isLoading={deleteTransaction.isPending}
        warningMessage={`This transaction will be permanently deleted.`}
        onClose={() => setDeletingTransactionId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
