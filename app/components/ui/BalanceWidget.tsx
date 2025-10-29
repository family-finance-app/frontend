import { ReactNode } from 'react';
import { roboto, jetbrainsMono } from '../../assets/fonts/fonts';

interface BalanceWidgetProps {
  totalBalance: number;
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    balance: number;
    icon: string;
    currency: string;
  }>;
  className?: string;
}

export default function BalanceWidget({
  totalBalance,
  accounts,
  className = '',
}: BalanceWidgetProps) {
  const formatCurrency = (amount: number) => {
    // Ensure amount is a valid number, default to 0 if NaN
    const validAmount = isNaN(amount) ? 0 : amount;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
    }).format(validAmount);
  };

  const formatPercentage = (percentage: number) => {
    const validPercentage = isNaN(percentage) ? 0 : percentage;
    return `${validPercentage > 0 ? '+' : ''}${validPercentage.toFixed(1)}%`;
  };

  return (
    <div
      className={`bg-linear-to-br from-primary-600 to-primary-700 rounded-3xl p-8 text-white relative overflow-hidden ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Balance Section */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p
              className={`${roboto.className} text-primary-100 text-sm uppercase tracking-wider font-medium mb-2`}
            >
              Total Balance
            </p>
            <h2
              className={`${jetbrainsMono.className} text-4xl lg:text-5xl font-bold mb-3`}
            >
              {formatCurrency(totalBalance)}
            </h2>
          </div>

          {/* Balance Icon */}
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            UAH
          </div>
        </div>

        {/* Account Breakdown */}
        <div className="space-y-3">
          <p
            className={`${roboto.className} text-primary-100 text-sm uppercase tracking-wider font-medium mb-4`}
          >
            From your accounts
          </p>

          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between py-3 px-4 bg-white/10 rounded-xl backdrop-blur-sm"
            >
              <div className="flex items-center space-x-3">
                <div>
                  <p className="font-medium text-white">{account.name}</p>
                  <p className="text-xs text-primary-100">{account.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
    </div>
  );
}
