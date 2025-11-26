interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  color?: 'primary' | 'marzipan' | 'salmon' | 'smalt' | 'kashmir' | 'hazel';
  showPercentage?: boolean;
}

export default function ProgressBar({
  label,
  value,
  max,
  color = 'primary',
  showPercentage = false,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    primary: 'dark:bg-moss-100 bg-moss-400',
    marzipan: 'dark:bg-marzipan-200 bg-primary-600',
    salmon: 'bg-salmon-300',
    smalt: 'dark:bg-smalt-200 bg-smalt-400',
    kashmir: 'dark:bg-kashmir-100 bg-kashmir-400',
    hazel: 'bg-hazel-100',
  };

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-background-700 dark:text-background-100">
          {label}
        </span>
      </div>
      <div className="w-full bg-background-200 dark:bg-primary-500 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
