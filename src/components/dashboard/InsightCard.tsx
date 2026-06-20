import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import type { Insight } from '@/types/results'
import { formatINR } from '@/utils/formatters'

interface Props {
  insight: Insight
  index: number
}

export function InsightCard({ insight, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white border border-gray-100 rounded-2xl p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <p className="text-sm font-semibold text-gray-900 leading-snug">{insight.title}</p>
        <Badge variant={insight.badgeType}>{formatINR(insight.monthlyLoss)}/mo</Badge>
      </div>

      {/* Equivalents — what this money could buy */}
      {insight.equivalents.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            That money could buy you…
          </p>
          <div className="flex flex-wrap gap-2">
            {insight.equivalents.map((eq) => (
              <motion.span
                key={eq.label}
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.28 }}
                className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl"
              >
                <span className="text-base leading-none">{eq.emoji}</span>
                <span className="tabular-nums text-gray-900">{eq.count}</span>
                <span className="text-gray-500">{eq.label}</span>
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed mb-3">{insight.description}</p>

      {/* Tip */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-3">
        <p className="text-xs font-semibold text-amber-700 mb-0.5">💡 Quick win</p>
        <p className="text-xs text-amber-800">{insight.savingTip}</p>
      </div>

      {/* CO2 */}
      <p className="text-xs text-brand-600 font-medium">🌿 {insight.co2Impact}</p>
    </motion.div>
  )
}
