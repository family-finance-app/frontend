interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'background' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: 'search' | 'edit' | 'delete';
}

export default function Button({
  text,
  onClick,
  disabled,
  type,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
}: ButtonProps) {
  const baseStyles =
    'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 inline-flex items-center justify-center';

  // Size variants
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
  };

  // Color variants
  const colorStyles = {
    primary:
      'bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white focus:ring-primary-500 shadow-lg hover:shadow-xl',
    background:
      'hover:bg-background-300 disabled:bg-background-300 text-primary-800 focus:ring-background-300',
    warning:
      'bg-warning-600 hover:bg-brown-700 disabled:bg-brown-300 text-white focus:ring-brown-500 shadow-lg hover:shadow-xl',
    danger:
      'hover:bg-danger-600 disabled:bg-danger-300 text-primary-800 hover:text-white focus:ring-danger-600',
    outline:
      'hover:bg-brown-700 disabled:bg-brown-300 text-primary-800 focus:ring-brown-500 shadow-lg hover:shadow-xl border-2 border-primary-700',
  };

  const iconVariants = {
    search: (
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    edit: (
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    delete: (
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    ),
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${colorStyles[variant]} ${widthStyle} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled}
      className={combinedClassName}
      onClick={onClick}
    >
      {disabled ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          {icon && iconVariants[icon]}
          {text}
        </>
      )}
    </button>
  );
}
