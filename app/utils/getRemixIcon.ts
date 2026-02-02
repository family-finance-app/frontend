import * as RemixIcon from '@remixicon/react';

// reverts name of icon into RemixIcon component

export const getRemixIcon = (iconName?: string) => {
  if (!iconName || !iconName.startsWith('ri-')) return null;

  const pascalCase = iconName
    .substring(3)
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  const IconComponent = (RemixIcon as any)[`Ri${pascalCase}`];
  return IconComponent || null;
};
