'use client';

import { useState } from 'react';
import { CreateTransactionFormData } from '@/types/transaction';
import { useCategories } from '@/api/categories/queries';
import { useAccounts } from '@/api/accounts/queries';
import { useCreateTransaction } from '@/api/transactions/mutations';
import Button from '../ui/Button';

interface CreateTransactionFormProps {
  onSuccess?: (transactionId: number) => void;
  onCancel?: () => void;
}

export default function CreateTransactionForm({
  onSuccess,
  onCancel,
}: CreateTransactionFormProps) {
  const { data: categories } = useCategories();
  const { data: accounts } = useAccounts();
  const createMutation = useCreateTransaction();

  const [formData, setFormData] = useState<CreateTransactionFormData>({
    type: 'EXPENSE',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    accountId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoriesArray = Array.isArray(categories) ? categories : [];
  const accountsArray = Array.isArray(accounts) ? accounts : [];

  const filteredCategories = categoriesArray.filter((cat) => {
    if (formData.type === 'TRANSFER') return true;
    return cat.type.toUpperCase() === formData.type;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const transactionData = {
        accountId: Number(formData.accountId),
        type: formData.type as 'INCOME' | 'EXPENSE' | 'TRANSFER',
        amount: Number(formData.amount),
        category: formData.categoryId,
        date: formData.date,
      };

      const result = await createMutation.mutateAsync(transactionData);

      setFormData({
        type: 'EXPENSE',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        categoryId: '',
        accountId: '',
      });

      onSuccess?.(result.id);
    } catch (error) {
      if (error && typeof error === 'object' && 'details' in error) {
        const backendErrors: Record<string, string> = {};
        const details = error.details as Array<{
          path: string[];
          message: string;
        }>;
        details.forEach((err) => {
          backendErrors[err.path[0]] = err.message;
        });
        setErrors(backendErrors);
      } else {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to create transaction';
        setErrors({ general: message });
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error message*/}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Transaction type selection logics*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Transaction Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  type: e.target.value,
                  categoryId: '',
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>

          {/* Account selection logics*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account
            </label>
            <select
              value={formData.accountId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  accountId: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Choose account</option>
              {accountsArray.map((account) => (
                <option key={account.account.id} value={account.account.id}>
                  {account.account.title} ({account.account.type}) -{' '}
                  {account.account.currency}
                </option>
              ))}
            </select>
            {errors.accountId && (
              <p className="text-sm text-red-600 mt-1">{errors.accountId}</p>
            )}
          </div>

          {/* Category selection logics*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({
                  ...formData,
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
            {errors.categoryId && (
              <p className="text-sm text-red-600 mt-1">{errors.categoryId}</p>
            )}
          </div>

          {/* Enter transaction amount*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: e.target.value,
                })
              }
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
            {errors.amount && (
              <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Enter date of transaction */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        {/* Buttons*/}
        <div className="flex gap-3">
          {/* Submit form button */}
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="submit"
            text="Create Transaction"
          />
          <Button
            type="button"
            onClick={onCancel}
            disabled={createMutation.isPending}
            variant={'cancel'}
            text="Cancel"
          />
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
    </>
  );
}
