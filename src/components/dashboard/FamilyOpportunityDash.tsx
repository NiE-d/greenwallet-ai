import { motion } from 'framer-motion'
import type { FamilyGoal } from '@/types/results'
import { formatINR } from '@/utils/formatters'
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter'

function GoalCard({ goal, index }: { goal: FamilyGoal; index: number }) {
  const animated = useAnimatedCounter(goal.value, 1200)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="bg-white border border-gray-100 rounded-2xl p-5"
    >
      <div className="text-2xl mb-3">{goal.emoji}</div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
        {goal.label}
      </p>
      <p className="text-2xl font-extrabold text-brand-700 tracking-tight">
        {formatINR(animated)}
      </p>
      <p className="text-xs text-gray-400 mt-1">{goal.note}</p>
    </motion.div>
  )
}

export function FamilyOpportunityDash({ goals }: { goals: FamilyGoal[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {goals.map((goal, i) => (
        <GoalCard key={goal.label} goal={goal} index={i} />
      ))}
    </div>
  )
}
