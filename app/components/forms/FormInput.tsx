import React from 'react';

interface FormInputProps {
  label?: {
    type: string;
    text: string;
    clasname?: string;
  };
  span?: string;
  name: string;
  type?: string;
  id?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  classname?: 'auth' | 'internal';
}

export default function FormInput({
  label,
  span,
  name,
  type = 'text',
  id,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  classname,
}: FormInputProps) {
  return (
    <div>
      <label
        htmlFor={label?.type}
        className={`block text-sm font-medium mb-1 ${
          classname === 'internal'
            ? 'text-gray-700 dark:text-background-800'
            : 'text-background-800 dark:text-background-300'
        }`}
      >
        {label?.text}
      </label>
      <div className="relative">
        {span && (
          <span className="absolute pr-4 left-4 top-1/2 transform -translate-y-1/2 text-background-500 font-medium">
            {span}
          </span>
        )}
        <input
          type={type}
          name={name}
          {...(id && { id })}
          value={value}
          onChange={(e) => onChange(e)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full ${
            span ? 'pl-8' : 'pl-4'
          } pr-4 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 ${
            classname === 'internal'
              ? 'focus:ring-background-100 dark:focus:ring-primary-600 dark:text-primary-800 dark:border-background-800'
              : 'bg-background-200 dark:bg-background-100 focus:ring-primary-500 dark:focus:ring-primary-500 dark:border-background-100'
          }  
          ${
            error
              ? 'border-danger-700 dark:border-danger-700'
              : 'border-gray-300'
          }
          ${
            disabled
              ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-60'
              : ''
          }
        `}
        />
      </div>

      {error && classname === 'internal' ? (
        <p className="text-danger-600 text-sm mt-1">{error}</p>
      ) : (
        <p className="text-danger-600 dark:text-danger-200 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
