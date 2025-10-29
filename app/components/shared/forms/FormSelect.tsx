/**
 * FormSelect - переиспользуемый компонент для select полей
 */

import React from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  error,
  placeholder,
  required = false,
  disabled = false,
}: FormSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500
          dark:bg-gray-700 dark:text-white dark:border-gray-600
          transition-colors
          ${error ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}
          ${
            disabled
              ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-60'
              : ''
          }
        `}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
