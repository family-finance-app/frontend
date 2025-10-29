'use client';

import { useState } from 'react';
import { Transaction } from '@/types/transaction';
import {
  useDeleteTransaction,
  useUpdateTransaction,
} from '@/api/transactions/mutations';

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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full">
          {/* Header */}
          <div className="p-6 border-b border-background-100">
            <h2 className="text-xl font-semibold text-background-900">
              Transaction Options
            </h2>
            <p className="text-sm text-background-500 mt-1">
              {Math.abs(transaction.amount)}{' '}
              {transaction.account?.currency || 'UAH'}
            </p>
          </div>

          {/* Actions */}
          <div className="p-6 space-y-3">
            {error && (
              <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-danger-600 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleEdit}
              disabled={isDeleting}
              className="w-full px-4 py-3 rounded-lg border border-primary-600 text-primary-600 font-medium hover:bg-primary-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edit Transaction
            </button>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                isDeleting
                  ? 'bg-danger-100 text-danger-600 opacity-50 cursor-not-allowed'
                  : 'bg-danger-50 text-danger-600 hover:bg-danger-100'
              }`}
            >
              {isDeleting ? 'Deleting...' : 'Delete Transaction'}
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-background-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-background-600 hover:text-background-900 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
