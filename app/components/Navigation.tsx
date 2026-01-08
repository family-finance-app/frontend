'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { roboto } from '../assets/fonts/fonts';
import CreateTransactionForm from '@/components/transactions/CreateTransactionForm';
import Notifications from './Notifications';
import ColorModeSwitcher from './ColorModeSwitcher';
import ProfileAvatar from './ProfileAvatar';
import { RiAccountCircleFill, RiAddLine } from '@remixicon/react';
import Logo_light from './ui/Logo_light';
import Link from 'next/link';

export default function Navigation() {
  const [notifications] = useState(3);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleTransactionSuccess = (transactionId: number) => {
    setShowTransactionModal(false);
    showNotification(
      'success',
      `Transaction created successfully! ID: ${transactionId}`
    );
  };

  const handleTransactionError = () => {
    showNotification(
      'error',
      'Failed to create transaction. Please try again.'
    );
  };

  const handleTransactionCancel = () => {
    setShowTransactionModal(false);
  };

  return (
    <nav className="fixed z-30 w-full bg-primary-700/95 dark:bg-primary-800 backdrop-blur-md border-b border-primary-600">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-16 gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2 sm:ml-4 lg:ml-6">
              <div className="hidden md:block md:ml-8">
                <Link href="/dashboard">
                  <Logo_light responsive />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowTransactionModal(true)}
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-400 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <RiAddLine />
              <span className="font-medium">Add Transaction</span>
            </button>

            <div>
              <Notifications />
            </div>

            <div>
              <ColorModeSwitcher />
            </div>

            <div>
              <ProfileAvatar />
            </div>
          </div>
        </div>
      </div>

      {showTransactionModal &&
        createPortal(
          <div
            className="fixed inset-0 backdrop-blur-sm bg-background-900/10 z-100 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleTransactionCancel();
              }
            }}
          >
            <div className="bg-white dark:bg-stack-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-scale-in relative z-101">
              <div className="sticky top-0 bg-background-50 dark:bg-stack-200 border-b border-background-100 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2
                    className={`${roboto.className} text-xl font-semibold text-primary-800`}
                  >
                    Add New Transaction
                  </h2>
                  <button
                    onClick={handleTransactionCancel}
                    className="p-2 hover:bg-background-100 rounded-lg transition-colors"
                  >
                    {/* <svg
                      className="w-5 h-5 text-background-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg> */}
                  </button>
                </div>
              </div>
              <div className="p-6">
                <CreateTransactionForm
                  onSuccess={handleTransactionSuccess}
                  onCancel={handleTransactionCancel}
                  onError={handleTransactionError}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </nav>
  );
}
