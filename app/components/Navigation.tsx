'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { roboto } from '../assets/fonts/fonts';
import CreateTransactionForm from '@/components/transactions/CreateTransactionForm';
import Notifications from './Notifications';
import ColorModeSwitcher from './ColorModeSwitcher';
import ProfileAvatar from './ProfileAvatar';

export default function Navigation() {
  const [notifications] = useState(3);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    console.log('Transaction created successfully with ID:', transactionId);
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
    <nav className="fixed z-30 w-full bg-primary-700/95 backdrop-blur-md border-b border-primary-600">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Brand */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-300 to-primary-500 rounded-lg flex items-center justify-center">
                <span
                  className={`${roboto.className} text-white font-bold text-lg`}
                >
                  F
                </span>
              </div>
              <h1
                className={`${roboto.className} text-white font-bold text-xl tracking-tight hidden sm:block`}
              >
                FamilyFinance
              </h1>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Quick Add Transaction Button */}
            <button
              onClick={() => setShowTransactionModal(true)}
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-400 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="font-medium">Add Transaction</span>
            </button>

            {/* Notifications */}
            <Notifications />

            <ColorModeSwitcher />

            {/* Profile Avatar */}
            <ProfileAvatar />
          </div>
        </div>
      </div>

      {/* Transaction Modal Portal */}
      {mounted &&
        showTransactionModal &&
        createPortal(
          <div
            className="fixed inset-0 backdrop-blur-sm bg-background-900/10 z-[100] flex items-center justify-center p-4"
            onClick={(e) => {
              // Закрываем модальное окно при клике на фон
              if (e.target === e.currentTarget) {
                handleTransactionCancel();
              }
            }}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-scale-in relative z-[101]">
              <div className="sticky top-0 bg-white border-b border-background-100 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2
                    className={`${roboto.className} text-xl font-semibold text-background-900`}
                  >
                    Add New Transaction
                  </h2>
                  <button
                    onClick={handleTransactionCancel}
                    className="p-2 hover:bg-background-100 rounded-lg transition-colors"
                  >
                    <svg
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
                    </svg>
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

      {/* Notification Portal */}
      {mounted &&
        notification &&
        createPortal(
          <div className="fixed top-20 right-4 z-[200] animate-slide-in">
            <div
              className={`px-6 py-4 rounded-xl shadow-lg border ${
                notification.type === 'success'
                  ? 'bg-success-50 border-success-200 text-success-800'
                  : 'bg-danger-50 border-danger-200 text-danger-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {notification.type === 'success' ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
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
                    </svg>
                  )}
                </div>
                <p className="text-sm font-medium">{notification.message}</p>
                <button
                  onClick={() => setNotification(null)}
                  className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
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
                  </svg>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </nav>
  );
}
