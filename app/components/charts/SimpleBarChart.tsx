interface ChartDataProps {
  label: string;
  value: number;
  color?: string | null;
  percentage?: number;
}

export default function SimpleBarChart({
  data,
  size = 'md',
}: {
  data: ChartDataProps[];
  size?: 'sm' | 'md' | 'lg';
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
  };

  const colors = [
    '#ffcb3a', // primary-500
    '#dd754a', // success-500
    '#f59e0b', // warning-500
    '#ef4444', // danger-500
    '#6b7280', // background-500
    '#8b5cf6', // purple-500
  ];

  return (
    <div className="flex items-center justify-center">
      <svg className={sizeClasses[size]} viewBox="0 0 100 100">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const cumulativePercentage = data
            .slice(0, index)
            .reduce((sum, prev) => sum + (prev.value / total) * 100, 0);
          const startAngle = (cumulativePercentage / 100) * 360 - 90;
          const endAngle = startAngle + angle;

          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

          const largeArc = angle > 180 ? 1 : 0;

          const pathData = [
            `M 50 50`,
            `L ${x1} ${y1}`,
            `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z',
          ].join(' ');

          return (
            <path
              key={index}
              d={pathData}
              fill={String(item.color || colors[index % colors.length])}
              stroke="white"
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </div>
  );
}
