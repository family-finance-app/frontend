/**
 * FormActions - компонент для кнопок формы
 */

import React from 'react';

interface FormActionsProps {
  onSubmit?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

export function FormActions({
  onCancel,
  isLoading = false,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
}: FormActionsProps) {
  return (
    <div className="flex gap-2 justify-end">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {cancelLabel}
        </button>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Loading...' : submitLabel}
      </button>
    </div>
  );
}
