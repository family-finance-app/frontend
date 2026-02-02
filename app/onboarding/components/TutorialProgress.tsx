'use client';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  percentage: number;
}

export default function TutorialProgress({
  current,
  total,
  percentage,
}: ProgressIndicatorProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs text-background-500">
        <span>
          Step {current} of {total}
        </span>
        <span>{percentage}% complete</span>
      </div>
      <div className="h-1.5 bg-background-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
