import type { ReactNode } from 'react'

type BadgeVariant = 'red' | 'gold' | 'green' | 'gray' | 'blue'

const styles: Record<BadgeVariant, string> = {
  red: 'bg-red-50 text-red-700',
  gold: 'bg-amber-50 text-amber-700',
  green: 'bg-brand-50 text-brand-700',
  gray: 'bg-gray-100 text-gray-600',
  blue: 'bg-blue-50 text-blue-700',
}

export function Badge({
  children,
  variant = 'gray',
}: {
  children: ReactNode
  variant?: BadgeVariant
}) {
  return (
    <span
      className={`inline-block text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${styles[variant]}`}
    >
      {children}
    </span>
  )
}
