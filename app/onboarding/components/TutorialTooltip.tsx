'use client';

import { ReactNode } from 'react';
import {
  RiCloseLine,
  RiArrowRightLine,
  RiSkipForwardLine,
} from '@remixicon/react';

import TutorialProgress from './TutorialProgress';

import { roboto } from '@/assets/fonts/fonts';

interface TutorialTooltipProps {
  title: string;
  description: string;
  progress: { current: number; total: number; percentage: number };
  onNext: () => void;
  onSkip: () => void;
  onClose: () => void;
  isLastStep?: boolean;
  showNavigation?: boolean;
  icon?: ReactNode;
  actionLabel?: string;
}

export default function TutorialTooltip({
  title,
  description,
  progress,
  onNext,
  onSkip,
  onClose,
  isLastStep = false,
  showNavigation = true,
  icon,
  actionLabel,
}: TutorialTooltipProps) {
  return (
    <div className="bg-white dark:bg-stack-200 rounded-2xl shadow-2xl border border-background-100 dark:border-background-700 overflow-hidden">
      <div className="bg-linear-to-r from-primary-600 to-primary-700 px-5 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                {icon}
              </div>
            )}
            <h3
              className={`${roboto.className} text-lg font-semibold text-white leading-tight`}
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 -mr-1 -mt-1"
            aria-label="Close tutorial"
          >
            <RiCloseLine className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        <p className="text-background-600 dark:text-primary-700 text-sm leading-relaxed">
          {description}
        </p>

        <TutorialProgress {...progress} />

        {showNavigation && (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onSkip}
              className="text-background-500 hover:text-background-700 dark:hover:text-background-300 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              <RiSkipForwardLine className="w-4 h-4" />
              Skip tour
            </button>

            <button
              onClick={onNext}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl active:scale-95"
            >
              {isLastStep ? 'Finish' : actionLabel || 'Next'}
              <RiArrowRightLine className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
