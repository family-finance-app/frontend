'use client';

import { roboto } from '@/assets/fonts/fonts';
import { getRemixIcon } from '@/utils/getRemixIcon';
import * as RemixIcon from '@remixicon/react';

interface FormSelectGridProps {
  label?: {
    htmlFor: string;
    text: string;
    clasname?: string;
  };
  name: string;
  id?: string;
  value: string | number;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    icon?: string;
  }>;
  onChange: (value: string) => void;
  error?: string;
  classname?: string;
}

export default function FormSelectGrid({
  label,
  name,
  value,
  options,
  onChange,
  error,
  classname,
}: FormSelectGridProps) {
  return (
    <div>
      <label
        htmlFor={label?.htmlFor}
        className={`${roboto.className} block text-sm font-semibold text-background-900 mb-3`}
      >
        {label?.text}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option) => {
          const Icon = getRemixIcon(option.icon);
          const isRemixIcon = typeof Icon === 'function';

          return (
            <label
              key={option.value}
              className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:bg-background-50 ${
                value === option.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-300 dark:hover:bg-primary-400 ring-2 ring-primary-200'
                  : 'border-background-300 bg-white dark:bg-stack-200 dark:hover:bg-primary-400 hover:border-background-400'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
                required
              />
              <div className="flex items-center space-x-3 flex-1">
                {Icon && (
                  <div className="w-10 h-10 bg-background-100  rounded-lg flex items-center justify-center">
                    {isRemixIcon ? (
                      <Icon className="w-5 h-5 text-primary-700 dark:text-primary-800" />
                    ) : (
                      <span className="text-2xl leading-none">{Icon}</span>
                    )}
                  </div>
                )}
                <div>
                  <p className="font-medium text-primary-800">{option.label}</p>
                  {option.description && (
                    <p className="text-sm text-background-600 dark:text-stack-600">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
              {value === option.value && (
                <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                  <RemixIcon.RiCheckLine className="text-white w-4" />
                </div>
              )}
            </label>
          );
        })}
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
