/**
 * getCurrencySymbol - получить символ валюты
 */
export function getCurrencySymbol(currency?: string): string {
  if (!currency) return '';
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    UAH: '₴',
  };
  return symbols[currency] || currency;
}
