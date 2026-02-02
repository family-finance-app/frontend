import { RiLogoutBoxRLine, RiLoader2Line } from '@remixicon/react';

interface ButtonSignoutProps {
  onclick: () => void;
  disabled: boolean;
  className?: string;
  iconColor?: string;
  iconSize?: string;
}

export default function Button_signout({
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
      className={`flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:text-primary-600 dark:hover:text-background-300 text-sm lg:text-lg md:text-md ${
        className || defaultClassName
      }`}
    >
      {disabled ? (
        <RiLoader2Line className="text-stack-700 w-5 h-5" />
      ) : (
        <RiLogoutBoxRLine
          className={`${`text-${iconColor}` || 'text-stack-600'} ${
            iconSize || 'w-5 h-5'
          } text-center`}
        />
      )}
      <span>{disabled ? 'Signing out...' : 'Sign Out'}</span>
    </button>
  );
}
