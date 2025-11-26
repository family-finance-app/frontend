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
          className="px-4 py-2 border border-background-200 dark:border-background-400 rounded-md text-background-900 hover:bg-background-100 dark:hover:bg-background-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {cancelLabel}
        </button>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Loading...' : submitLabel}
      </button>
    </div>
  );
}
