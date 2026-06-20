export function formatINR(amount: number): string {
  return '₹' + Math.round(amount).toLocaleString('en-IN')
}

export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString('en-IN')
}

export function formatKg(kg: number): string {
  if (kg >= 1000) return (kg / 1000).toFixed(1) + ' tonnes'
  return Math.round(kg) + ' kg'
}

export function pluralize(n: number, singular: string, plural?: string): string {
  return n === 1 ? singular : (plural ?? singular + 's')
}
