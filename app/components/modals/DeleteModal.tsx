'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { roboto } from '@/assets/fonts/fonts';

import { Button, ErrorMessage } from '@/components';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string | null;
  isLoading?: boolean;
  error?: string | null;
  warningMessage?: string;
  additionalInfo?: string;
  confirmButtonText?: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  isLoading = false,
  error,
  warningMessage,
  additionalInfo,
  confirmButtonText = 'Delete Forever',
}: DeleteModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen || !itemName || !mounted) return null;

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const defaultWarningMessage = `This action cannot be undone. ${
    title.includes('Account') ? 'All transaction history for' : ''
  } ${itemName} will be permanently deleted.`;

  return createPortal(
    <div
      className="fixed inset-0 backdrop-blur-sm bg-background-900/10 z-100 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-stack-200 rounded-2xl shadow-2xl max-w-md w-full animate-scale-in relative z-101  dark:border-danger-700">
        <div className="border-b border-danger-200 dark:border-danger-700 p-6 bg-warning-500 dark:bg-warning-600 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2
              className={`${roboto.className} text-xl font-medium text-warning-50 dark:text-warning-50`}
            >
              {title}
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {error && <ErrorMessage message={error} />}

          <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-700 p-4 rounded-lg">
            <p className="text-danger-900 dark:text-danger-800 font-semibold">
              Warning!
            </p>
            <p className="text-danger-800 text-sm mt-2">
              {warningMessage || defaultWarningMessage}
            </p>
          </div>
        </div>

        <div className=" dark:border-background-600 p-6 flex items-center gap-3">
          <Button
            text="Cancel"
            type="button"
            variant="cancel"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            text={isLoading ? 'Deleting...' : confirmButtonText}
            type="button"
            variant="danger"
            size="md"
            onClick={onConfirm}
            disabled={isLoading || !!error}
            className="flex-1"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
