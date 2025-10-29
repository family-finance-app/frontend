'use client';

import { ReactNode } from 'react';

interface FieldItem {
  label: string;
  content?: string | ReactNode;
  onClick?: () => void;
  type?: 'text' | 'button' | 'badge';
}

interface SettingsCardProps {
  header: string;
  description: string;
  icon?: string;
  fields?: FieldItem[];
  buttonText?: string;
  onButtonClick?: () => void;
  showButton?: boolean;
  children?: ReactNode;
  variant?: 'default' | 'link';
  hoverable?: boolean;
}

export default function SettingsCard({
  header,
  description,
  icon = '⚙️',
  fields = [],
  buttonText = 'Manage',
  onButtonClick,
  showButton = true,
  children,
  variant = 'default',
  hoverable = true,
}: SettingsCardProps) {
  const CardWrapper = variant === 'link' ? 'div' : 'div';

  const baseClasses =
    'bg-background-50 border border-background-200 rounded-2xl shadow-sm transition-all duration-200';
  const hoverClasses = hoverable
    ? 'hover:shadow-lg hover:scale-102 hover:bg-background-100'
    : '';
  const linkClasses = variant === 'link' ? 'cursor-pointer group' : '';

  return (
    <CardWrapper className={`${baseClasses} ${hoverClasses} ${linkClasses}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold text-background-900 mb-1 ${
                variant === 'link'
                  ? 'group-hover:text-primary-600 transition-colors'
                  : ''
              }`}
            >
              {header}
            </h3>
            <p className="text-sm text-background-600">{description}</p>
          </div>
          {icon && <div className="text-2xl ml-3">{icon}</div>}
        </div>

        {/* Fields */}
        {fields.length > 0 && (
          <div className="space-y-3 mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {fields.map((field, index) => (
              <FieldComponent key={index} field={field} />
            ))}
          </div>
        )}

        {/* Custom Children */}
        {children && (
          <div className="mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {children}
          </div>
        )}

        {/* Button */}
        {showButton && onButtonClick && (
          <button
            type="button"
            onClick={onButtonClick}
            className="w-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {buttonText}
          </button>
        )}

        {/* Link Arrow for variant="link" */}
        {variant === 'link' && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Click to {buttonText.toLowerCase()}
            </span>
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        )}
      </div>
    </CardWrapper>
  );
}

// Field Component - renders different field types
function FieldComponent({ field }: { field: FieldItem }) {
  const { label, content, onClick, type = 'text' } = field;

  // Text field
  if (type === 'text' && !onClick) {
    return (
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
          {label}
        </label>
        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
          {content || 'Not set'}
        </p>
      </div>
    );
  }

  // Button field (interactive)
  if (type === 'button' || onClick) {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {label}
        </span>
        {onClick ? (
          <button
            type="button"
            onClick={onClick}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
          >
            {content || 'Update'}
          </button>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {content}
          </span>
        )}
      </div>
    );
  }

  // Badge field (status display)
  if (type === 'badge') {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
          {content}
        </span>
      </div>
    );
  }

  return null;
}
