interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type: 'button' | 'submit' | 'reset';
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'brown'
    | 'outline'
    | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function Button({
  text,
  onClick,
  disabled,
  type,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
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
      'bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white focus:ring-primary-500 shadow-lg hover:shadow-xl border-primary-600',
    secondary:
      'bg-background-600 hover:bg-background-700 disabled:bg-background-300 text-white focus:ring-background-500 shadow-lg hover:shadow-xl border-background-600',
    success:
      'bg-success-600 hover:bg-success-700 disabled:bg-success-300 text-white focus:ring-success-500 shadow-lg hover:shadow-xl border-success-600',
    danger:
      'bg-danger-600 hover:bg-danger-700 disabled:bg-danger-300 text-white focus:ring-danger-500 shadow-lg hover:shadow-xl border-danger-600',
    brown:
      'bg-brown-600 hover:bg-brown-700 disabled:bg-brown-300 text-white focus:ring-brown-500 shadow-lg hover:shadow-xl border-brown-600',
    outline:
      'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 disabled:border-primary-300 disabled:text-primary-300',
    ghost:
      'text-primary-600 hover:bg-primary-50 focus:ring-primary-500 disabled:text-primary-300',
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
        text
      )}
    </button>
  );
}
