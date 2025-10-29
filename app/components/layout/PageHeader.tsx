import { roboto } from '@/assets/fonts/fonts';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'outline' | 'danger';
  };
}

export default function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  const Button = require('@/components/ui/Button').default;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1
          className={`${roboto.className} text-2xl md:text-3xl font-bold text-background-900`}
        >
          {title}
        </h1>
        {description && (
          <p className="text-background-600 mt-1">{description}</p>
        )}
      </div>
      {action && (
        <div className="mt-4 md:mt-0">
          <Button
            text={action.label}
            type="button"
            onClick={action.onClick}
            variant={action.variant || 'primary'}
          />
        </div>
      )}
    </div>
  );
}
