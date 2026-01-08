'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';
import Link from 'next/link';

interface BalanceWidgetProps {
  totalBalance: string;
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
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInfoOpen) return;

    const handleOutside = (event: MouseEvent | TouchEvent) => {
      if (!infoRef.current) return;
      if (!infoRef.current.contains(event.target as Node)) {
        setIsInfoOpen(false);
      }
    };

    document.addEventListener('click', handleOutside);
    document.addEventListener('touchstart', handleOutside);

    return () => {
      document.removeEventListener('click', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isInfoOpen]);

  return (
    <div
      className={`bg-linear-to-br from-primary-600 to-primary-700 rounded-3xl p-8 text-white relative overflow-hidden ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <Image src="/background.svg" fill alt="balance widget background" />
      </div>

      {/* Main Balance Section */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p
                className={`${roboto.className} text-primary-100 text-sm uppercase tracking-wider font-medium`}
              >
                Total Balance
              </p>
              <div className="relative group" ref={infoRef}>
                <button
                  type="button"
                  onClick={() => setIsInfoOpen((prev) => !prev)}
                  className="text-primary-200 hover:text-white transition-colors text-sm leading-none"
                  aria-expanded={isInfoOpen}
                  aria-controls="total-balance-tooltip"
                >
                  ⓘ
                </button>
                <div
                  id="total-balance-tooltip"
                  className={`absolute left-0 top-full mt-2 ${
                    isInfoOpen ? 'block' : 'hidden'
                  } md:group-hover:block bg-primary-900/95 border border-primary-700 text-primary-50 text-sm rounded-lg px-4 py-3 whitespace-normal z-80 w-52 backdrop-blur-sm shadow-lg`}
                >
                  Total balance of all accounts in UAH equivalent, calculated at
                  current exchange rates
                </div>
              </div>
            </div>
            <h2
              className={`${jetbrainsMono.className} text-4xl lg:text-5xl font-bold mb-3`}
            >
              {totalBalance}
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
              <div className="flex items-center space-x-3">
                <div>
                  <p className="font-medium text-white">
                    {account.balance} {account.currency}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <Link
            href="/accounts"
            className="bg-white/10 rounded-xl backdrop-blur-sm py-1 px-3 text-xs"
          >
            ... view all accounts
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
    </div>
  );
}
