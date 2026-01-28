'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

import Link from 'next/link';

import { roboto } from '../../assets/fonts/fonts';

import { CreateTransactionModal } from '@/(main layout)/transactions';

import { Notifications } from '@/notifications';

import { ColorModeSwitcher } from '@/theme';

import { ProfileAvatar } from '@/(main layout)/settings/profile';

import { RiAddLine, RiMenuLine } from '@remixicon/react';

import { Logo_light } from '@/components/ui';

export default function Navigation() {
  const [notifications] = useState(3);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const handleTransactionSuccess = (transactionId: number) => {
    setShowTransactionModal(false);
    window.dispatchEvent(
      new CustomEvent('transaction:success', {
        detail: `Transaction created successfully! ID: ${transactionId}`,
      }),
    );
  };

  const handleTransactionError = () => {
    window.dispatchEvent(
      new CustomEvent('transaction:error', {
        detail: 'Failed to create transaction. Please try again.',
      }),
    );
  };

  const handleTransactionCancel = () => {
    setShowTransactionModal(false);
  };

  return (
    <nav className="fixed z-30 w-full bg-primary-700/95 dark:bg-primary-800 backdrop-blur-md border-b border-primary-600">
      <div className="w-full px-2 sm:px-4 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              id="toggleSidebarMobile"
              className="lg:hidden p-2 text-white hover:bg-primary-600 rounded-lg transition-colors"
              onClick={() => {
                const event = new CustomEvent('toggleSidebar');
                window.dispatchEvent(event);
              }}
              aria-label="Toggle sidebar"
            >
              <RiMenuLine />
            </button>

            <div className="hidden sm:block">
              <Link href="/dashboard">
                <Logo_light responsive />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <button
              onClick={() => setShowTransactionModal(true)}
              className="flex items-center justify-center md:space-x-2 p-1.5 sm:p-2 md:px-4 md:py-2 bg-primary-500 hover:bg-primary-400 text-white rounded-lg md:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Add transaction"
            >
              <RiAddLine className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden md:inline font-medium text-sm">
                Add Transaction
              </span>
            </button>

            <div className="scale-90 sm:scale-100">
              <Notifications />
            </div>

            <div className="scale-90 sm:scale-100">
              <ColorModeSwitcher />
            </div>

            <div className="scale-90 sm:scale-100">
              <ProfileAvatar />
            </div>
          </div>
        </div>
      </div>

      {showTransactionModal &&
        createPortal(
          <div
            className="fixed inset-0 backdrop-blur-sm bg-background-900/10 z-100 flex items-center justify-center p-2 sm:p-4 overflow-hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleTransactionCancel();
              }
            }}
          >
            <div className="bg-white dark:bg-stack-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] flex flex-col animate-scale-in relative z-101">
              <div className="shrink-0 bg-background-50 dark:bg-stack-200 border-b border-background-100 px-4 sm:px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2
                    className={`${roboto.className} text-lg sm:text-xl font-semibold text-primary-800`}
                  >
                    Add New Transaction
                  </h2>
                  <button
                    onClick={handleTransactionCancel}
                    className="p-2 hover:bg-background-100 dark:hover:bg-background-600 rounded-lg transition-colors"
                    aria-label="Close"
                  >
                    <span className="text-2xl leading-none text-background-600 dark:text-background-300">
                      ×
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
                <CreateTransactionModal
                  onSuccess={handleTransactionSuccess}
                  onCancel={handleTransactionCancel}
                  onError={handleTransactionError}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </nav>
  );
}
