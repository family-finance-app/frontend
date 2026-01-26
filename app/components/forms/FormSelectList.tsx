interface FormSelectListProps {
  label?: {
    type: string;
    text: string;
    clasname?: string;
  };
  id?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string | number; label: string }>;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function FormSelectList({
  label,
  id,
  name,
  value,
  onChange,
  options,
  error,
  placeholder,
  required = false,
  disabled = false,
}: FormSelectListProps) {
  return (
    <div>
      <label
        htmlFor={label?.type}
        className="block text-sm font-medium text-gray-700 dark:text-primary-800 mb-1"
      >
        {label?.text}
        {required && <span className="text-danger-700 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          w-full pl-4 py-2.5 border rounded-md
          focus:outline-none focus:ring-2 focus:ring-background-100 dark:focus:ring-primary-600
           dark:text-primary-800 dark:border-background-800
          transition-colors
          ${
            error
              ? 'border-danger-700 dark:border-danger-700'
              : 'border-gray-300'
          }
          ${
            disabled
              ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-60'
              : ''
          }
        `}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-danger-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
