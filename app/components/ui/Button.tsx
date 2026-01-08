interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type: 'button' | 'submit' | 'reset';
  variant?: 'cancel' | 'primary' | 'secondary';
}

export default function Button({
  text,
  onClick,
  disabled,
  type,
  variant = 'primary',
}: ButtonProps) {
  let className = '';

  const baseStyles =
    'px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';

  switch (variant) {
    case 'cancel':
      className = `${baseStyles} bg-background-200 hover:bg-background-300 text-background-800 focus:ring-background-500`;
      break;
    case 'secondary':
      className = `${baseStyles} bg-primary-100 hover:bg-primary-200 text-primary-800 focus:ring-primary-500`;
      break;
    case 'primary':
    default:
      className = `${baseStyles} bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-background-50 focus:ring-primary-500 shadow-lg hover:shadow-xl`;
      break;
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={className}
      onClick={onClick}
    >
      {disabled ? 'Please wait...' : text}
    </button>
  );
}
