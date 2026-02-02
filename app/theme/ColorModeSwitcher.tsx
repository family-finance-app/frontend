'use client';

import { useCallback } from 'react';
import { useColorTheme } from '@/hooks/useColorTheme';
import { RiMoonLine, RiSunLine } from '@remixicon/react';

export default function ColorModeSwitcher() {
  const colorTheme = useColorTheme();
  const isDark = colorTheme === 'dark';

  const toggleTheme = useCallback(() => {
    if (typeof window === 'undefined') return;

    const nextTheme = isDark ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    localStorage.setItem('theme', nextTheme);
  }, [isDark]);

  return (
    <div>
      <button
        onClick={toggleTheme}
        className="relative p-2 text-white/80 hover:text-white hover:bg-primary-600 rounded-lg transition-colors duration-200 dark:text-background-300 dark:hover:text-white dark:hover:bg-primary-500"
      >
        {isDark ? <RiSunLine /> : <RiMoonLine />}
      </button>
    </div>
  );
}
