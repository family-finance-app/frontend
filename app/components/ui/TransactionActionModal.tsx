'use client';

import { useState } from 'react';
import { Transaction } from '@/types/transaction';
import {
  useDeleteTransaction,
  useUpdateTransaction,
} from '@/api/transactions/mutations';
import { formatTransactionsForList } from '@/utils/transactions';
import {
  formatCurrencyAmount,
  transactionFormatters,
} from '@/utils/formatters';

interface TransactionActionModalProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (transaction: Transaction) => void;
}

export default function TransactionActionModal({
  transaction,
  isOpen,
  onClose,
  onEdit,
}: TransactionActionModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deleteTransaction = useDeleteTransaction();

  const handleEdit = () => {
    onEdit?.(transaction);
    onClose();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteTransaction.mutateAsync(transaction.id);
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'Failed to delete transaction. Please try again.';
      setError(errorMessage);
      console.error('Failed to delete transaction:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-background-50 border border-background-400 dark:bg-stack-200 dark:border dark:border-stack-100 rounded-2xl shadow-lg max-w-sm w-full">
          <div className="p-6 border-b border-background-100">
            <h2 className="text-xl font-semibold text-primary-800">
              {formatCurrencyAmount(transaction.amount)}{' '}
              {transaction.account?.currency || 'UAH'}
            </h2>
            <p className="text-sm text-background-500 dark:text-primary-700 mt-1">
              {transaction.account?.name} (
              {transaction.description ||
                transactionFormatters.typeLabel(transaction.type)}
              )
            </p>
          </div>

          <div className="p-6 space-y-3">
            {error && (
              <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-danger-600 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleEdit}
              disabled={isDeleting}
              className="w-full px-4 py-3 rounded-lg border border-primary-400 bg-primary-600 dark:border-success-800 dark:bg-primary-700 dark:text-background-100 dark:hover:bg-primary-600 text-background-100 font-medium hover:bg-primary-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edit Transaction
            </button>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                isDeleting
                  ? ' bg-danger-600 text-danger-100 opacity-50 cursor-not-allowed'
                  : 'bg-background-50 border border-danger-600 text-danger-600 hover:bg-danger-600 hover:text-danger-50 dark:bg-stack-200 dark:border dark:border-danger-700 dark:hover:bg-danger-600 dark:hover:text-background-100'
              }`}
            >
              {isDeleting ? 'Deleting...' : 'Delete Transaction'}
            </button>
            <p className="text-xs text-danger-600 dark:text-danger-700 ">
              Warning: This action will permanently delete the transaction.
            </p>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-background-100 flex justify-end">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-background-200 dark:border-background-400 rounded-lg text-background-900 font-medium hover:bg-background-100 dark:hover:bg-background-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
