'use client';

import { roboto } from '@/assets/fonts/fonts';

interface QuickActionButtonProps {
  id: string;
  label: string;
  description: string;
  color: 'success' | 'danger' | 'primary' | 'warning';
  href: string;
  onAction?: (id: string) => void;
}

export function QuickActionButton({
  id,
  label,
  description,
  color,
  href,
  onAction,
}: QuickActionButtonProps) {
  const colorMap = {
    success: {
      bg: 'bg-success-50 hover:bg-success-100',
      text: 'text-success-700',
      icon: 'text-success-600',
    },
    danger: {
      bg: 'bg-danger-50 hover:bg-danger-100',
      text: 'text-danger-700',
      icon: 'text-danger-600',
    },
    primary: {
      bg: 'bg-primary-50 hover:bg-primary-100',
      text: 'text-primary-700',
      icon: 'text-primary-600',
    },
    warning: {
      bg: 'bg-warning-50 hover:bg-warning-100',
      text: 'text-warning-700',
      icon: 'text-warning-600',
    },
  };

  const colors = colorMap[color];

  const ICONS = {
    income: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
    expense: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 12H4"
        />
      </svg>
    ),
    transfer: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    ),
    reports: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  };

  const icon = ICONS[id as keyof typeof ICONS];

  const handleClick = () => {
    if (onAction) {
      onAction(id);
    } else if (href !== '#') {
      window.location.href = href;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-4 ${colors.bg} ${colors.text} rounded-xl transition-all duration-200 group hover:scale-105`}
    >
      <div className="text-center">
        <div className={`w-8 h-8 mx-auto mb-2 ${colors.icon}`}>{icon}</div>
        <p className="font-medium">{label}</p>
        <p className={`text-xs ${colors.icon} mt-1`}>{description}</p>
      </div>
    </button>
  );
}

interface QuickActionsSectionProps {
  onActionClick?: (actionId: string) => void;
}

export function QuickActionsSection({
  onActionClick,
}: QuickActionsSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-financial border border-background-100 p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* {QUICK_ACTIONS_CONFIG.map((action) => (
          <QuickActionButton
            key={action.id}
            id={action.id}
            label={action.label}
            description={action.description}
            color={action.color as 'success' | 'danger' | 'primary' | 'warning'}
            href={action.href}
            onAction={onActionClick}
          />
        ))} */}
      </div>
    </div>
  );
}
