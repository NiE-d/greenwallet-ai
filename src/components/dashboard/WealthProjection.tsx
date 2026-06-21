import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { WealthMilestone } from '@/types/results'
import { formatINR } from '@/utils/formatters'
import { RECOVERABLE_SAVINGS_RATE } from '@/data/financialFactors'

interface WealthProjectionProps {
  milestones: WealthMilestone[]
  annualSavings: number
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="text-gray-500 text-xs mb-1">{label} year projection</p>
      <p className="font-bold text-brand-700">{formatINR(payload[0].value)}</p>
    </div>
  )
}

export function WealthProjection({ milestones, annualSavings }: WealthProjectionProps) {
  const data = milestones.map((m) => ({
    name: `${m.years}yr`,
    corpus: m.corpus,
  }))

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-800">
          Investment projection at 12% p.a.
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Redirecting {formatINR(annualSavings * RECOVERABLE_SAVINGS_RATE)} per year ({RECOVERABLE_SAVINGS_RATE * 100}% of recoverable waste)
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={data}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          aria-label="Area chart showing projected investment corpus growth from 1 to 20 years"
        >
          <defs>
            <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v: number) => `₹${Math.round(v / 100000)}L`}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="corpus"
            stroke="#16a34a"
            strokeWidth={2.5}
            fill="url(#corpusGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-3 mt-4">
        {milestones
          .filter((m) => [5, 10, 20].includes(m.years))
          .map((m) => (
            <motion.div
              key={m.years}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-gray-100 rounded-xl p-3 text-center"
            >
              <p className="text-xs text-gray-400 mb-1">{m.years} years</p>
              <p className="text-sm font-bold text-brand-700">{formatINR(m.corpus)}</p>
            </motion.div>
          ))}
      </div>
    </div>
  )
}
