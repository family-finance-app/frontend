import { RiLogoutBoxRLine, RiLoader2Line } from '@remixicon/react';

interface ButtonSignoutProps {
  onclick: () => void;
  disabled: boolean;
  className?: string;
  iconColor?: string;
  iconSize?: string;
}

export function Button_signout({
  onclick,
  disabled,
  className,
  iconColor,
  iconSize,
}: ButtonSignoutProps) {
  const defaultClassName = 'text-sm text-danger-600 hover:bg-danger-50';

  return (
    <button
      onClick={onclick}
      disabled={disabled}
      className={`${
        className || defaultClassName
      } w-full text-left px-4 py-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {disabled ? (
        <RiLoader2Line className="text-stack-700 w-5 h-5" />
      ) : (
        <RiLogoutBoxRLine
          className={`${`text-${iconColor}` || 'text-danger-600'} ${
            iconSize || 'w-5 h-5'
          } text-center`}
        />
      )}
      <span>{disabled ? 'Signing out...' : 'Sign Out'}</span>
    </button>
  );
}
