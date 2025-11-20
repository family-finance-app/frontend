// Tremor Raw chartColors [v0.1.0]

export type ColorUtility = 'bg' | 'stroke' | 'fill' | 'text';

export const chartColors = {
  moss: {
    // green
    bg: 'bg-moss-400',
    stroke: 'stroke-moss-400',
    fill: 'fill-moss-400',
    text: 'text-primary-500',
  },
  hazel: {
    // light green to yellow
    bg: 'bg-hazel-200',
    stroke: 'stroke-hazel-200',
    fill: 'fill-hazel-200',
    text: 'text-hazel-200',
  },
  salmon: {
    // light orange
    bg: 'bg-salmon-300',
    stroke: 'stroke-salmon-400',
    fill: 'fill-salmon-200',
    text: 'text-salmon-300',
  },
  kashmir_light: {
    // grey-blue
    bg: 'bg-kashmir-500',
    stroke: 'stroke-kashmir-500',
    fill: 'fill-kashmir-300',
    text: 'text-kashmir-500',
  },
  kashmir: {
    bg: 'bg-kashmir-500',
    stroke: 'stroke-kashmir-500',
    fill: 'fill-kashmir-500',
    text: 'text-kashmir-500',
  },
  primary: {
    bg: 'bg-primary-300',
    stroke: 'stroke-primary-300',
    fill: 'fill-primary-300',
    text: 'text-primary-300',
  },
  pink: {
    bg: 'bg-marzipan-200',
    stroke: 'stroke-marzipan-200',
    fill: 'fill-marzipan-200',
    text: 'text-marzipan-200',
  },
  moss_light: {
    bg: 'bg-moss-100',
    stroke: 'stroke-moss-100',
    fill: 'fill-moss-100',
    text: 'text-moss-100',
  },
  fuchsia_pink: {
    bg: 'bg-pink-300',
    stroke: 'stroke-pink-300pink-300',
    fill: 'fill-pink-300',
    text: 'text-pink-300',
  },
} as const satisfies {
  [color: string]: {
    [key in ColorUtility]: string;
  };
};

export type AvailableChartColorsKeys = keyof typeof chartColors;

export const AvailableChartColors: AvailableChartColorsKeys[] = Object.keys(
  chartColors
) as Array<AvailableChartColorsKeys>;

export const constructCategoryColors = (
  categories: string[],
  colors: AvailableChartColorsKeys[]
): Map<string, AvailableChartColorsKeys> => {
  const categoryColors = new Map<string, AvailableChartColorsKeys>();
  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length]);
  });
  return categoryColors;
};

export const getColorClassName = (
  color: AvailableChartColorsKeys,
  type: ColorUtility
): string => {
  const fallbackColor = {
    bg: 'bg-gray-500',
    stroke: 'stroke-gray-500',
    fill: 'fill-gray-500',
    text: 'text-gray-500',
  };
  return chartColors[color]?.[type] ?? fallbackColor[type];
};

// Tremor Raw getYAxisDomain [v0.0.0]

export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined
) => {
  const minDomain = autoMinValue ? 'auto' : minValue ?? 0;
  const maxDomain = maxValue ?? 'auto';
  return [minDomain, maxDomain];
};

// Tremor Raw hasOnlyOneValueForKey [v0.1.0]

export function hasOnlyOneValueForKey(
  array: any[],
  keyToCheck: string
): boolean {
  const val: any[] = [];

  for (const obj of array) {
    if (Object.prototype.hasOwnProperty.call(obj, keyToCheck)) {
      val.push(obj[keyToCheck]);
      if (val.length > 1) {
        return false;
      }
    }
  }

  return true;
}
