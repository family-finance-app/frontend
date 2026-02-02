interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type: 'button' | 'submit' | 'reset';
  variant?:
    | 'primary'
    | 'background'
    | 'warning'
    | 'danger'
    | 'outline'
    | 'cancel';
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
    'font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 inline-flex items-center justify-center';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
  };

  const colorStyles = {
    primary:
      'bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white focus:ring-primary-500 shadow-lg hover:shadow-xl',
    background:
      'hover:bg-background-300 disabled:bg-background-300 text-primary-800 focus:ring-background-300',
    warning:
      'bg-warning-600 hover:bg-brown-700 disabled:bg-brown-300 text-white focus:ring-brown-500 shadow-lg hover:shadow-xl',
    danger:
      'hover:bg-danger-600 disabled:bg-danger-300 text-danger-800 hover:text-white focus:ring-danger-600 borderbg-white border  border-danger-600 text-danger-600 hover:bg-danger-600 hover:text-danger-600 dark:bg-stack-200 dark:border dark:border-danger-700 dark:hover:bg-danger-700 dark:hover:text-background-100',
    outline:
      'hover:bg-brown-700 disabled:bg-brown-300 text-primary-800 shadow-lg hover:shadow-xl border-2 border-primary-700 dark:bg-background-100 hover:bg-background-200',
    cancel:
      'px-4 py-2 border border-background-200 dark:border-background-400 rounded-md text-background-900 hover:bg-background-100 dark:hover:bg-background-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
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
      {disabled ? <>Processing...</> : <>{text}</>}
    </button>
  );
}
