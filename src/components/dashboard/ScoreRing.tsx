import { motion } from 'framer-motion'
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter'

interface ScoreRingProps {
  monthlyWaste: number
}

function getScoreLabel(monthly: number): { label: string; color: string; ring: string } {
  if (monthly < 2000) return { label: 'Efficient', color: 'text-brand-600', ring: 'stroke-brand-500' }
  if (monthly < 5000) return { label: 'Room to grow', color: 'text-amber-600', ring: 'stroke-amber-400' }
  if (monthly < 10000) return { label: 'High leakage', color: 'text-orange-600', ring: 'stroke-orange-400' }
  return { label: 'Critical', color: 'text-red-600', ring: 'stroke-red-500' }
}

export function ScoreRing({ monthlyWaste }: ScoreRingProps) {
  const score = Math.min(99, Math.round(monthlyWaste / 700))
  const animated = useAnimatedCounter(score, 1400)
  const { label, color, ring } = getScoreLabel(monthlyWaste)
  const circumference = 2 * Math.PI * 44
  const offset = circumference - (animated / 99) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={ring}
            style={{ strokeDasharray: circumference }}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-gray-900 leading-none">{animated}</span>
          <span className="text-xs text-gray-400 font-medium mt-0.5">/ 99</span>
        </div>
      </div>
      <div className="text-center">
        <p className={`text-sm font-bold ${color}`}>{label}</p>
        <p className="text-xs text-gray-400">waste score</p>
      </div>
    </div>
  )
}
