import { useEffect, useState } from 'react';

type ColorTheme = 'light' | 'dark';

export const useColorTheme = () => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const updateTheme = () => {
      const nextTheme: ColorTheme = root.classList.contains('dark')
        ? 'dark'
        : 'light';
      setColorTheme(nextTheme);
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return colorTheme;
};
