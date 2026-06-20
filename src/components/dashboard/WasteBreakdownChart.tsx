import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { BreakdownItem } from '@/types/results'
import { formatINR } from '@/utils/formatters'

interface Props {
  breakdown: BreakdownItem[]
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: BreakdownItem; value: number }> }) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-900">
        {item.emoji} {item.category}
      </p>
      <p className="text-gray-500">Monthly: {formatINR(item.monthly)}</p>
      <p className="text-gray-500">Annual: {formatINR(item.annual)}</p>
      <p className="text-gray-400 text-xs">{item.percentage}% of total waste</p>
    </div>
  )
}

export function WasteBreakdownChart({ breakdown }: Props) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
      <p className="text-sm font-semibold text-gray-700 mb-4">Monthly waste breakdown</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={breakdown}
          margin={{ top: 4, right: 4, left: 0, bottom: 4 }}
          aria-label="Bar chart showing monthly waste by category"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => `₹${Math.round(v / 1000)}k`}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          <Bar dataKey="monthly" radius={[6, 6, 0, 0]}>
            {breakdown.map((entry) => (
              <Cell key={entry.category} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 mt-3">
        {breakdown.map((item) => (
          <div key={item.category} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ background: item.color }}
            />
            {item.emoji} {item.category}
          </div>
        ))}
      </div>
    </div>
  )
}
