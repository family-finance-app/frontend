'use client';

import { roboto } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button_financial';

interface DeleteAccountModalProps {
  accountName: string | null;
  isOpen: boolean;
  isLoading?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteAccountModal({
  accountName,
  isOpen,
  isLoading = false,
  error,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) {
  if (!isOpen || !accountName) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white shadow-2xl max-w-md w-full animate-scale-in border-3 border-danger-200">
        <div className="border-b border-danger-100 p-6 bg-danger-50">
          <h2
            className={`${roboto.className} text-2xl font-bold text-danger-900`}
          >
            Delete Account
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-danger-50 border border-danger-200 p-4 rounded-lg">
              <p className="text-danger-900 font-semibold">❌ Error</p>
              <p className="text-danger-800 text-sm mt-2">{error}</p>
            </div>
          )}

          <div className="bg-danger-50 border border-danger-200 p-4">
            <p className="text-danger-900 font-semibold">⚠️ Warning</p>
            <p className="text-danger-800 text-sm mt-2">
              This action cannot be undone. All transaction history for{' '}
              <strong>{accountName}</strong> will be permanently deleted from
              your account.
            </p>
          </div>

          <div className="bg-background-50 border border-background-200 p-4">
            <p className="text-background-700 text-sm">
              Make sure you have backed up any important information before
              proceeding.
            </p>
          </div>
        </div>

        <div className="border-t border-background-100 p-6 flex items-center space-x-3">
          <Button
            text="Cancel"
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            text={isLoading ? 'Deleting...' : 'Delete Forever'}
            type="button"
            variant="danger"
            size="md"
            onClick={onConfirm}
            disabled={isLoading || !!error}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
