interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type: 'button' | 'submit' | 'reset';
  variant?: 'cancel';
}
export default function Button({
  text,
  onClick,
  disabled,
  type,
  variant,
}: ButtonProps) {
  let className = '';
  if (variant === 'cancel') {
    className =
      'bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md';
  } else {
    switch (type) {
      case 'submit':
        className =
          'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md';
        break;
      case 'reset':
        className = '';
        break;
      case 'button':
        className =
          'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md';
        break;
      default:
        className = 'button-class';
        break;
    }
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
