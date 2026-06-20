import { motion, AnimatePresence } from 'framer-motion'
import type { Challenge } from '@/types/challenge'

interface Props {
  challenge: Challenge
  completed: boolean
  onToggle: () => void
}

export function ChallengeCard({ challenge, completed, onToggle }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onToggle}
      role="checkbox"
      aria-checked={completed}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle()
        }
      }}
      className={`
        relative cursor-pointer rounded-2xl p-5 border transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400
        ${completed
          ? 'bg-brand-50 border-brand-200'
          : 'bg-white border-gray-100 hover:border-gray-200'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{challenge.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-snug ${completed ? 'text-brand-800' : 'text-gray-900'}`}>
            {challenge.title}
          </p>
          <p className={`text-xs mt-1 ${completed ? 'text-brand-600' : 'text-brand-600'}`}>
            {challenge.reward}
          </p>
        </div>
        <div className={`
          w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center
          ${completed ? 'bg-brand-500 border-brand-500' : 'border-gray-300'}
        `}>
          <AnimatePresence>
            {completed && (
              <motion.svg
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-3 h-3 text-white"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
      </div>
      {completed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-brand-500 font-medium mt-2"
        >
          ✅ Challenge accepted!
        </motion.p>
      )}
    </motion.div>
  )
}
