'use client';

import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  RiRocketLine,
  RiCloseLine,
  RiWalletLine,
  RiExchangeLine,
  RiPieChartLine,
  RiArrowRightLine,
} from '@remixicon/react';

import { roboto } from '@/assets/fonts/fonts';

interface WelcomeModalProps {
  isOpen: boolean;
  onStartTutorial: () => void;
  onSkip: () => void;
  userName?: string;
}

export default function WelcomeModal({
  isOpen,
  onStartTutorial,
  onSkip,
  userName,
}: WelcomeModalProps) {
  const isBrowser = typeof window !== 'undefined';

  const features = useMemo(
    () => [
      {
        icon: <RiWalletLine className="w-5 h-5" />,
        title: 'Create Accounts',
        description: 'Track bank accounts, cash, and savings',
      },
      {
        icon: <RiExchangeLine className="w-5 h-5" />,
        title: 'Add Transactions',
        description: 'Record income, expenses, and transfers',
      },
      {
        icon: <RiPieChartLine className="w-5 h-5" />,
        title: 'View Analytics',
        description: 'See your finances at a glance',
      },
    ],
    [],
  );

  if (!isBrowser || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-10000 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onSkip}
      />

      <div className="relative bg-white dark:bg-stack-200 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in">
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 z-10 p-2 text-background-400 hover:text-background-600 dark:hover:text-background-300 transition-colors rounded-full hover:bg-background-100 dark:hover:bg-background-700"
          aria-label="Close"
        >
          <RiCloseLine className="w-5 h-5" />
        </button>

        <div className="bg-linear-to-br from-primary-600 via-primary-700 to-primary-800 px-8 py-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <h1 className={`${roboto.className} text-2xl font-bold mb-2`}>
              Welcome to FamilyFinance
            </h1>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          <div className="text-center">
            <h2
              className={`${roboto.className} text-lg font-semibold text-background-900 dark:text-primary-700 mb-2`}
            >
              Let's Get You Started
            </h2>
            <p className="text-background-500 dark:text-primary-600 text-sm">
              Take a quick 2-minute tour to learn how to use app and manage your
              finances effectively
            </p>
          </div>

          <div className="space-y-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-xl bg-background-50 dark:bg-primary-600"
              >
                <div className="w-10 h-10 bg-primary-100 dark:bg-background-100 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-background-900 dark:text-background-100">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-background-500 dark:text-background-200">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary-500 rounded-xl p-4 flex items-center justify-center">
            <p className="text-background-50 dark:text-stack-100 text-sm leading-relaxed">
              <strong>NOTE: </strong>The total balance of your accounts and
              analytics are calculated in UAH using current Monobank exchange
              rates
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={onStartTutorial}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Start Quick Tour
              <RiArrowRightLine className="w-5 h-5" />
            </button>
            <button
              onClick={onSkip}
              className="w-full text-background-500 hover:text-background-700 dark:hover:text-background-600 py-2 text-sm font-medium transition-colors"
            >
              Skip tour
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
