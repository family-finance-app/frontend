'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface SpotlightProps {
  targetId: string;
  isActive: boolean;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  padding?: number;
}

export default function TutorialSpotlight({
  targetId,
  isActive,
  children,
  position = 'bottom',
  padding = 8,
}: SpotlightProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    if (!isActive || !targetId || !isBrowser) return;

    const updatePosition = () => {
      const element = document.getElementById(targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      }
    };

    updatePosition();

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    const observer = new MutationObserver(updatePosition);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      observer.disconnect();
    };
  }, [targetId, isActive, isBrowser]);

  if (!isBrowser || !isActive || !targetRect) return null;

  const getTooltipPosition = () => {
    if (!targetRect) return { top: 0, left: 0 };

    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const margin = 16;

    switch (position) {
      case 'top':
        return {
          top: targetRect.top - tooltipHeight - margin,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
        };
      case 'bottom':
        return {
          top: targetRect.bottom + margin,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
        };
      case 'left':
        return {
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.left - tooltipWidth - margin,
        };
      case 'right':
        return {
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.right + margin,
        };
      default:
        return {
          top: targetRect.bottom + margin,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
        };
    }
  };

  const tooltipPosition = getTooltipPosition();

  const clampedPosition = {
    top: Math.max(16, Math.min(tooltipPosition.top, window.innerHeight - 220)),
    left: Math.max(16, Math.min(tooltipPosition.left, window.innerWidth - 336)),
  };

  return createPortal(
    <>
      <div
        className="fixed z-50 rounded-xl border-2 border-primary-400 shadow-[0_0_20px_rgba(99,102,241,0.5)] animate-pulse pointer-events-none"
        style={{
          top: targetRect.top - padding,
          left: targetRect.left - padding,
          width: targetRect.width + padding * 2,
          height: targetRect.height + padding * 2,
        }}
      />

      <div
        ref={tooltipRef}
        className="fixed z-50 w-80 animate-fade-in"
        style={{
          top: clampedPosition.top,
          left: clampedPosition.left,
        }}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}
