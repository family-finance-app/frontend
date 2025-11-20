'use client';

import { useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
}

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState<Notification[]>([]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/80 hover:text-white hover:bg-primary-600 rounded-lg transition-colors duration-200 dark:text-background-300 dark:hover:text-white dark:hover:bg-primary-500"
      >
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
            d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-background-800 rounded-2xl shadow-2xl border border-background-100 dark:border-background-700 z-50 animate-scale-in">
            <div className="p-4 border-b border-background-100 dark:border-background-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-background-900 dark:text-background-100">
                  Notifications
                </h3>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-background-100 dark:bg-background-700 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-background-400 dark:text-background-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-3.293-3.293a1 1 0 01-.293-.707V9a6 6 0 10-12 0v4c0 .265-.105.52-.293.707L5 17h5m5 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <p className="text-background-600 dark:text-background-400 text-sm">
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-background-50 dark:border-background-700 hover:bg-background-50 dark:hover:bg-background-700 transition-colors cursor-pointer ${
                      !notification.read
                        ? 'bg-primary-50/50 dark:bg-primary-900/20'
                        : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          notification.type === 'success'
                            ? 'bg-success-100 dark:bg-success-900/30'
                            : notification.type === 'warning'
                            ? 'bg-warning-100 dark:bg-warning-900/30'
                            : notification.type === 'error'
                            ? 'bg-danger-100 dark:bg-danger-900/30'
                            : 'bg-primary-100 dark:bg-primary-900/30'
                        }`}
                      >
                        {notification.type === 'success' && (
                          <svg
                            className="w-4 h-4 text-success-600 dark:text-success-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {notification.type === 'warning' && (
                          <svg
                            className="w-4 h-4 text-warning-600 dark:text-warning-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {notification.type === 'error' && (
                          <svg
                            className="w-4 h-4 text-danger-600 dark:text-danger-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {notification.type === 'info' && (
                          <svg
                            className="w-4 h-4 text-primary-600 dark:text-primary-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-background-900 dark:text-background-100">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full shrink-0"></div>
                          )}
                        </div>
                        <p className="text-sm text-background-600 dark:text-background-300 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-background-400 dark:text-background-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-background-100 dark:border-background-700">
              <button className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
