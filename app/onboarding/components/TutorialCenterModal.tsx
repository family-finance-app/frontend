'use client';

import { createPortal } from 'react-dom';
import {
  RiCheckLine,
  RiCloseLine,
  RiArrowRightLine,
  RiMedalLine,
} from '@remixicon/react';

interface CenterModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  icon?: 'success' | 'complete' | 'info';
  onContinue: () => void;
  onSkip: () => void;
  continueLabel?: string;
  showConfetti?: boolean;
}

export default function TutorialCenterModal({
  isOpen,
  title,
  description,
  icon = 'success',
  onContinue,
  onSkip,
  continueLabel = 'Continue',
  showConfetti = false,
}: CenterModalProps) {
  const isBrowser = typeof window !== 'undefined';

  if (!isBrowser || !isOpen) return null;

  const icons = {
    success: (
      <div className="w-16 h-16 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <RiCheckLine className="w-8 h-8 text-success-600 dark:text-success-400" />
      </div>
    ),
    complete: (
      <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <RiMedalLine className="w-8 h-8 text-primary-600 dark:text-primary-400" />
      </div>
    ),
    info: null,
  };

  return createPortal(
    <div className="fixed inset-0 z-10000 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background-900/60 backdrop-blur-sm animate-fade-in" />

      <div className="relative bg-white dark:bg-stack-200 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-scale-in">
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 z-10 p-1.5 text-background-400 hover:text-background-600 dark:hover:text-background-300 transition-colors rounded-full hover:bg-background-100 dark:hover:bg-background-700"
          aria-label="Close"
        >
          <RiCloseLine className="w-5 h-5" />
        </button>

        <div className="px-6 py-8 text-center">
          <p className="text-background-500 dark:text-background-700 text-sm leading-relaxed mb-6">
            {description}
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={onContinue}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              {continueLabel}
              <RiArrowRightLine className="w-4 h-4" />
            </button>
            <button
              onClick={onSkip}
              className="w-full text-background-500 hover:text-background-700 dark:hover:text-background-300 py-2 text-sm font-medium transition-colors"
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
