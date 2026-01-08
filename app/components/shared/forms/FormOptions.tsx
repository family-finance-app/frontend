import { roboto } from '@/assets/fonts/fonts';

interface FormOptionsProps {
  label: string;
  options: any[];
  onChoose: () => void;
  key: string | number;
}

export default function FormOptions({
  label,
  options,
  onChoose,
  key,
}: FormOptionsProps) {
  return (
    <div>
      <label
        className={`${roboto.className} block text-sm font-medium text-background-900 dark:text-primary-800 mb-2`}
      >
        {label}
      </label>
      <div className="flex gap-3">
        {options.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChoose()}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              key === type
                ? 'bg-primary-600 text-background-50'
                : 'bg-background-100 text-background-700 hover:bg-background-200 dark:hover:bg-primary-600 dark:hover:text-background-100'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
