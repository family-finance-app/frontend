'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { useUpdateTransaction } from '@/api/transactions/mutations';
import { useCategories } from '@/api/categories/queries';

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

      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        date: dateString,
        categoryId: transaction.categoryId.toString(),
        description: '',
      });
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

  // Filter categories based on transaction type
  const filteredCategories = categories.filter((category) => {
    if (!formData.type) return true;
    return category.type === formData.type;
  });

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transaction) return;

    const newErrors: Record<string, string> = {};
    if (!formData.type) newErrors.type = 'Type is required';
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
          type: formData.type as any,
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

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full">
          <div className="p-6 border-b border-background-100">
            <h2 className="text-xl font-semibold text-background-900">
              Edit Transaction
            </h2>
          </div>

          <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-background-900 mb-2">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">Select type</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
                <option value="TRANSFER">Transfer</option>
              </select>
              {errors.type && (
                <p className="text-danger-600 text-sm mt-1">{errors.type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-background-900 mb-2">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              {errors.amount && (
                <p className="text-danger-600 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-background-900 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              {errors.date && (
                <p className="text-danger-600 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-background-900 mb-2">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={!formData.type}
                className="w-full px-3 py-2 border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 disabled:bg-background-50 disabled:text-background-400 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!formData.type ? 'Select type first' : 'Select a category'}
                </option>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories available</option>
                )}
              </select>
              {errors.categoryId && (
                <p className="text-danger-600 text-sm mt-1">
                  {errors.categoryId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-background-900 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add notes about this transaction..."
                rows={3}
                className="w-full px-3 py-2 border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
              />
            </div>

            {errors.submit && (
              <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-danger-600 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-background-200 rounded-lg text-background-900 font-medium hover:bg-background-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateTransaction.isPending}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {updateTransaction.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
