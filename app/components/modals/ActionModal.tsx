import { createPortal } from 'react-dom';
import { useState, useEffect, ReactNode } from 'react';

import { Button } from '@/components';

import { roboto } from '@/assets/fonts/fonts';

interface ActionButton {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  variant?:
    | 'primary'
    | 'background'
    | 'warning'
    | 'danger'
    | 'outline'
    | 'cancel';
  action: () => void;
  disabled?: boolean;
}

interface ActionModalProps {
  modalTitle: string;
  data: ReactNode | ReactNode[];
  actionButtons: ActionButton[];
  error?: string;
  onClose: () => void;
  isOpen: boolean;
  modalWarning?: string;
}

export default function ActionModal({
  modalTitle,
  data,
  actionButtons,
  error,
  onClose,
  isOpen,
  modalWarning,
}: ActionModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 backdrop-blur-sm bg-background-900/10 z-100 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-stack-200 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto animate-scale-in relative z-101">
        <div className="sticky top-0 bg-background-50 dark:bg-stack-200 border-b border-background-100 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2
              className={`${roboto.className} text-xl font-semibold text-primary-800`}
            >
              {modalTitle}
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-xl border border-background-100 dark:border-background-700 p-4 bg-background-50 dark:bg-stack-200">
            {Array.isArray(data)
              ? data.map((item, index) => <div key={index}>{item}</div>)
              : data}
          </div>

          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
              <p className="text-danger-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            {actionButtons.map((button, index) => (
              <Button
                key={`${button.text}-${index}`}
                text={button.text}
                onClick={button.action}
                disabled={button.disabled}
                type={button.type || 'button'}
                variant={button.variant || 'primary'}
                fullWidth={true}
              />
            ))}

            {modalWarning && (
              <p className="text-xs text-danger-600 dark:text-danger-600">
                {modalWarning}
              </p>
            )}
          </div>

          <Button
            text="Cancel"
            onClick={onClose}
            type="button"
            variant="cancel"
            fullWidth={true}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
