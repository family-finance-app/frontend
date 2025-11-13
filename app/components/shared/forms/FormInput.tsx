import React from 'react';

interface FormInputProps {
  label?: {
    type: string;
    text: string;
  };
  name: string;
  type?: string;
  id?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FormInput({
  label,
  name,
  type = 'text',
  id,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
}: FormInputProps) {
  return (
    <div>
      <label
        htmlFor={label?.type}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label?.text}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        {...(id && { id })}
        value={value}
        onChange={(e) => onChange(e)}
        placeholder={placeholder}
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
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
