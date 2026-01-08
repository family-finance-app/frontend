import { jetbrainsMono, roboto } from '@/assets/fonts/fonts';
import { formatCurrencyAmount } from '@/utils/formatters';
import SimpleBarChart from '@/components/charts/SimpleBarChart';
import ProgressBar from '@/components/charts/ProgressBar';

interface ChartData {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

interface StatsCardProps {
  title: string;
  data: ChartData[];
  type?: 'pie' | 'bar' | 'line' | 'donut';
  showLegend?: boolean;
  height?: string;
  className?: string;
}

export default function StatsCard({
  title,
  data,
  type = 'bar',
  showLegend = true,
  height = 'h-64',
  className = '',
}: StatsCardProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const colorPalette: Array<
    'primary' | 'marzipan' | 'salmon' | 'smalt' | 'kashmir' | 'hazel'
  > = ['primary', 'marzipan', 'salmon', 'smalt', 'kashmir', 'hazel'];

  const colorToTailwind: Record<
    'primary' | 'marzipan' | 'salmon' | 'smalt' | 'kashmir' | 'hazel',
    string
  > = {
    primary: 'dark:bg-moss-100 bg-moss-400',
    marzipan: 'dark:bg-marzipan-200 bg-primary-600',
    salmon: 'bg-salmon-300',
    smalt: 'dark:bg-smalt-200 bg-smalt-400',
    kashmir: 'dark:bg-kashmir-100 bg-kashmir-400',
    hazel: 'bg-hazel-100',
  };

  return (
    <div
      className={`bg-white dark:bg-primary-600 rounded-2xl shadow-financial border border-background-100 dark:border-background-500 p-6 ${className}`}
    >
      <h3
        className={`${roboto.className} text-lg font-semibold text-background-900 mb-6 dark:text-background-100`}
      >
        {title}
      </h3>

      <div className={`${height} flex items-center justify-center`}>
        {type === 'pie' && <SimpleBarChart data={data} size="lg" />}
        {type === 'donut' && <SimpleBarChart data={data} size="lg" />}
        {(type === 'bar' || type === 'line') && (
          <div className="w-full space-y-4">
            {data.map((item, index) => (
              <ProgressBar
                key={index}
                label={item.label}
                value={item.value}
                max={total}
                color={colorPalette[index % colorPalette.length]}
              />
            ))}
          </div>
        )}
      </div>

      {showLegend && (
        <div className="mt-6 pt-6 border-t border-background-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 lg:gap-6">
            {data.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              const colorKey = colorPalette[index % colorPalette.length];
              const tailwindClass = colorToTailwind[colorKey];
              const shortLabel =
                item.label.length > 14
                  ? `${item.label.slice(0, 14)}…`
                  : item.label;

              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${tailwindClass}`} />
                  <div className="flex-1 min-w-0">
                    <div className="lg:hidden 2xl:block">
                      <p className="text-sm font-medium text-background-900 dark:text-background-100 truncate">
                        {item.label}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p
                          className={`${jetbrainsMono.className} text-sm text-background-600 dark:text-white`}
                        >
                          {formatCurrencyAmount(item.value)}
                        </p>
                        <span className="text-sm text-background-500 dark:text-background-100">
                          ({percentage}%)
                        </span>
                      </div>
                    </div>

                    <div className="hidden lg:flex 2xl:hidden items-center justify-between gap-4">
                      <p className="text-sm font-medium text-background-900 dark:text-background-100 truncate">
                        {shortLabel}
                      </p>
                      <span className="text-sm text-background-500 dark:text-background-100 whitespace-nowrap ml-4 min-w-14 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export { ProgressBar };
