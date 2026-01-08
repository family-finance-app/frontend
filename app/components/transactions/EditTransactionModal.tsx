'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Transaction } from '@/types/transaction';
import { useUpdateTransaction } from '@/api/transactions/mutations';
import { useCategories } from '@/api/categories/queries';
import { roboto } from '../../assets/fonts/fonts';
import { FormActions, FormInput, FormSelect } from '../shared/forms';

interface EditTransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditTransactionModal({
  transaction,
  isOpen,
  onClose,
}: EditTransactionModalProps) {
  const updateTransaction = useUpdateTransaction();
  const isUpdating = updateTransaction.isPending;
  const { data: categories = [] } = useCategories();
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    amount: '',
    date: '',
    categoryId: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction && isOpen) {
      let dateString = '';
      try {
        if (typeof transaction.date === 'string') {
          if (transaction.date.match(/^\d{4}-\d{2}-\d{2}/)) {
            dateString = transaction.date.split('T')[0];
          } else {
            dateString = new Date(transaction.date).toISOString().split('T')[0];
          }
        }
      } catch (error) {
        console.error('Error parsing transaction date:', error);
      }

      const newFormData = {
        type: transaction.type,
        amount: transaction.amount.toString(),
        date: dateString,
        categoryId: transaction.categoryId.toString(),
        description: '',
      };

      Promise.resolve().then(() => setFormData(newFormData));
    }
  }, [transaction, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && { categoryId: '' }),
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleValueChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && { categoryId: '' }),
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const filteredCategories = categories.filter((category) => {
    if (!formData.type) return true;
    return category.type === formData.type;
  });

  const options = filteredCategories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transaction) return;

    const newErrors: Record<string, string> = {};
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updateTransaction.mutateAsync({
        id: transaction.id,
        data: {
          amount: parseFloat(formData.amount) as any,
          date: formData.date,
          categoryId: parseInt(formData.categoryId) as any,
          description: formData.description || undefined,
        },
      });
      onClose();
    } catch (error) {
      console.error('Failed to update transaction:', error);
      setErrors({ submit: 'Failed to update transaction' });
    }
  };

  if (!isOpen || !transaction) return null;

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
      <div className="bg-white dark:bg-stack-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-scale-in relative z-101">
        <div className="sticky top-0 bg-background-50 dark:bg-stack-200 border-b border-background-100 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2
              className={`${roboto.className} text-xl font-semibold text-primary-800`}
            >
              Edit Transaction
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background-100 rounded-lg transition-colors"
              aria-label="Close edit transaction modal"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <FormInput
                label={{ type: 'amount', text: 'Amount' }}
                name="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange(e)}
                error={errors.amount}
                classname="internal"
              />
            </div>

            <div>
              <FormInput
                label={{ type: 'date', text: 'Date' }}
                name="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange(e)}
                error={errors.date}
                classname="internal"
              />
            </div>

            <div>
              <FormSelect
                label="Category"
                name="categoryId"
                value={formData.categoryId}
                onChange={(value) => handleValueChange('categoryId', value)}
                options={options}
                placeholder="Select category"
                error={errors.categoryId}
              />
            </div>

            <div>
              <FormInput
                label={{ type: 'description', text: 'Description (Optional)' }}
                name="description"
                type="text"
                placeholder="Add a the description to this transaction..."
                value={formData.description}
                onChange={(e) => handleChange(e)}
                classname="internal"
              />
            </div>

            <FormActions
              onCancel={onClose}
              submitLabel={isUpdating ? 'Editing...' : 'Submit'}
              cancelLabel="Cancel"
              isLoading={isUpdating}
            />
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
