import { motion } from 'framer-motion'
import { formatKg, formatNumber } from '@/utils/formatters'

interface PlanetImpactProps {
  co2Annual: number
  treesEquivalent: number
  carKmEquivalent: number
}

const stats = (co2: number, trees: number, km: number) => [
  { emoji: '💨', value: formatKg(co2), label: 'CO₂ prevented annually', desc: 'By improving your highest-impact habits' },
  { emoji: '🌳', value: `${trees} trees`, label: 'Equivalent tree impact', desc: `Same CO₂ absorption as planting ${trees} trees` },
  { emoji: '🚗', value: `${formatNumber(km)} km`, label: 'Car journey equivalent', desc: 'The road-trip distance this CO₂ represents' },
]

export function PlanetImpact({ co2Annual, treesEquivalent, carKmEquivalent }: PlanetImpactProps) {
  const items = stats(co2Annual, treesEquivalent, carKmEquivalent)

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="bg-brand-50 border border-brand-100 rounded-2xl p-5 text-center"
          >
            <div className="text-3xl mb-2">{item.emoji}</div>
            <p className="text-xl font-extrabold text-brand-700 tracking-tight">{item.value}</p>
            <p className="text-xs font-semibold text-brand-600 mt-1">{item.label}</p>
            <p className="text-xs text-gray-400 mt-1 leading-snug">{item.desc}</p>
          </motion.div>
        ))}
      </div>
      <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-sm text-brand-800">
        🌿{' '}
        <strong>The planet is a bonus.</strong> Environmental impact here is the natural side effect
        of making smarter financial decisions — not a burden or a guilt trip. You save money first.
        The planet wins automatically.
      </div>
    </div>
  )
}
