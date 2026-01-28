'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { TransactionList } from '@/(main layout)/transactions/index';

import { Transaction } from '@/(main layout)/transactions/types';

import {
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/api/transactions/mutations';

import {
  Button,
  EditModal,
  DeleteModal,
  SuccessMessage,
  ErrorMessage,
  type FormField,
} from '@/components';

import { Account } from '@/(main layout)/accounts/types';

interface Category {
  id: number;
  name: string;
  type: string;
  icon?: string;
  color?: string;
}

interface DashboardTransactionsSectionProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  isLoading: boolean;
}

interface EditTransactionFormData {
  type: string;
  amount: string;
  date: string;
  categoryId: string;
  description: string;
}

export default function DashboardTransactionsSection({
  transactions,
  accounts,
  categories,
  isLoading,
}: DashboardTransactionsSectionProps) {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();
  const [deletingTransactionId, setDeletingTransactionId] = useState<
    number | null
  >(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDeleteTransaction = (transactionId: number) => {
    setDeletingTransactionId(transactionId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTransactionId) return;
    try {
      await deleteTransaction.mutateAsync(deletingTransactionId);
      setDeletingTransactionId(null);
      setSuccessMessage('Transaction deleted');
      setErrorMessage(null);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setDeletingTransactionId(null);
      setErrorMessage(err?.message || 'Failed to delete transaction');
      setSuccessMessage(null);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingTransaction(null);
    setIsEditModalOpen(false);
  };

  const router = useRouter();

  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  const transactionTypes = [
    { value: 'INCOME', label: 'Income' },
    { value: 'EXPENSE', label: 'Expense' },
    { value: 'TRANSFER', label: 'Transfer' },
  ];

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
      handleCloseEditModal();
      setSuccessMessage('Transaction updated');
      setErrorMessage(null);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update transaction');
      setSuccessMessage(null);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white  rounded-2xl border border-background-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-background-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
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
    );
  }

  return (
    <>
      {successMessage && (
        <div className="mb-3">
          <SuccessMessage message={successMessage} />
        </div>
      )}
      {errorMessage && (
        <div className="mb-3">
          <ErrorMessage message={errorMessage} />
        </div>
      )}
      <TransactionList
        transactions={transactions}
        title="Recent Transactions"
        maxItems={6}
        showAccount={true}
        accounts={accounts}
        categories={categories}
        onEditTransaction={handleEditTransaction}
        onDeleteTransaction={handleDeleteTransaction}
        actions={
          <Button
            text="View All"
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/transactions')}
          />
        }
      />

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
        itemName={
          transactions.find((t) => t.id === deletingTransactionId)
            ?.description || 'Transaction'
        }
        isLoading={deleteTransaction.isPending}
        warningMessage={`This transaction will be permanently deleted.`}
        onClose={() => setDeletingTransactionId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
