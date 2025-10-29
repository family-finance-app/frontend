interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon = '📭',
  title,
  description,
  action,
}: EmptyStateProps) {
  const Button = require('@/components/ui/Button').default;

  return (
    <div className="bg-white rounded-2xl border border-background-200 p-12 flex items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-background-900 mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-background-600 text-sm mb-4">{description}</p>
        )}
        {action && (
          <Button
            text={action.label}
            type="button"
            onClick={action.onClick}
            variant="outline"
            size="sm"
          />
        )}
      </div>
    </div>
  );
}
