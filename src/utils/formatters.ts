/**
 * Formats a number as an Indian Rupee amount with the ₹ symbol and
 * Indian-style digit grouping (e.g. 100000 → "₹1,00,000").
 *
 * @param amount - The amount in rupees. Will be rounded to the nearest whole rupee.
 */
export function formatINR(amount: number): string {
  return '₹' + Math.round(amount).toLocaleString('en-IN')
}

/**
 * Formats a number with Indian-style digit grouping, without a currency symbol.
 *
 * @param n - The number to format. Will be rounded to the nearest whole number.
 */
export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString('en-IN')
}

/**
 * Formats a CO2 mass in kilograms, automatically switching to tonnes for
 * large values (≥ 1000 kg) for readability.
 *
 * @param kg - The mass in kilograms.
 */
export function formatKg(kg: number): string {
  if (kg >= 1000) return (kg / 1000).toFixed(1) + ' tonnes'
  return Math.round(kg) + ' kg'
}

/**
 * Returns the singular or plural form of a word based on a count.
 *
 * @param n - The count determining which form to use.
 * @param singular - The singular form of the word.
 * @param plural - Optional explicit plural form. Defaults to `singular + 's'`.
 */
export function pluralize(n: number, singular: string, plural?: string): string {
  return n === 1 ? singular : (plural ?? singular + 's')
}
