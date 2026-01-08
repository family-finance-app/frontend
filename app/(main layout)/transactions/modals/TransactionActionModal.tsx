'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Transaction } from '../types';
import { useDeleteTransaction } from '@/api/transactions/mutations';
import {
  formatCurrencyAmount,
  transactionFormatters,
} from '@/utils/formatters';
import { roboto } from '../../../assets/fonts/fonts';
import Button from '../../../components/ui/Button_financial';

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 backdrop-blur-sm bg-background-900/10 z-100 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-stack-200 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto animate-scale-in relative z-101">
        <div className="sticky top-0 bg-background-50 dark:bg-stack-200 border-b border-background-100 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2
              className={`${roboto.className} text-xl font-semibold text-primary-800`}
            >
              Transaction Actions
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-xl border border-background-100 dark:border-background-700 p-4 bg-background-50 dark:bg-stack-200">
            <div className="flex">
              <h3 className="text-lg font-semibold text-primary-700 mr-1.5">
                {transaction.type === 'EXPENSE' && (
                  <span className="text-danger-700">
                    -{formatCurrencyAmount(transaction.amount)}{' '}
                    {transaction.account?.currency || 'UAH'}{' '}
                  </span>
                )}
                {transaction.type === 'INCOME' && (
                  <span className="text-success-700">
                    +{formatCurrencyAmount(transaction.amount)}{' '}
                    {transaction.account?.currency || 'UAH'}{' '}
                  </span>
                )}
                {transaction.type === 'TRANSFER' && (
                  <span className="text-primary-00">
                    {formatCurrencyAmount(transaction.amount)}{' '}
                    {transaction.account?.currency || 'UAH'}{' '}
                  </span>
                )}
              </h3>
              <p className="text-sm text-background-500 dark:text-primary-700 mt-1">
                {transaction.account?.name || 'Account'}
              </p>
            </div>

            <h4 className="text-background-600">
              {transaction.description ||
                transactionFormatters.typeLabel(transaction.type)}
            </h4>
          </div>

          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
              <p className="text-danger-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              text="Edit Transaction"
              onClick={handleEdit}
              disabled={isDeleting}
              type="button"
              variant="primary"
              fullWidth={true}
              size="lg"
            />

            <Button
              text="Delete Transaction"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-white border  border-danger-600 text-danger-600 hover:bg-danger-600 hover:text-danger-600 dark:bg-stack-200 dark:border dark:border-danger-700 dark:hover:bg-danger-700 dark:hover:text-background-100"
              type="submit"
              variant="danger"
              fullWidth={true}
            />
            <p className="text-xs text-danger-600 dark:text-danger-600">
              Warning: This action will permanently delete the transaction.
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 flex justify-end ">
          <Button
            text="Cancel"
            onClick={onClose}
            type="button"
            variant="cancel"
            fullWidth={true}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
