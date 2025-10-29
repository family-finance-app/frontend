import { ReactNode } from 'react';

interface PageSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export default function PageSection({
  children,
  title,
  description,
  className = '',
}: PageSectionProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-financial border border-background-100 p-6 ${className}`}
    >
      {(title || description) && (
        <div className="mb-6 pb-6 border-b border-background-200">
          {title && (
            <h2 className="text-lg font-semibold text-background-900 mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-background-600">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
