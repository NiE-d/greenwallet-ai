import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavBar } from '@/components/layout/NavBar'

const STEPS = [
  { text: 'Analyzing spending habits…',         icon: '💸' },
  { text: 'Calculating hidden losses…',          icon: '🔍' },
  { text: 'Projecting family opportunities…',   icon: '👨‍👩‍👧' },
  { text: 'Estimating future savings…',          icon: '📈' },
  { text: 'Evaluating environmental impact…',   icon: '🌍' },
  { text: 'Building your GreenWallet…',    icon: '✨' },
]

interface Props { onDone: () => void }

export function LoadingPage({ onDone }: Props) {
  const [stepIndex, setStepIndex] = useState(0)
  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100)

  useEffect(() => {
    if (stepIndex >= STEPS.length - 1) {
      const t = setTimeout(onDone, 800)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStepIndex((i) => i + 1), 900)
    return () => clearTimeout(t)
  }, [stepIndex, onDone])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/70 via-white to-white">
      <NavBar page="loading" />

      <main className="flex flex-col items-center justify-center min-h-[84vh] px-6 text-center">

        {/* Spinner orb */}
        <div className="relative w-28 h-28 mb-8">
          {/* Outer pulse rings */}
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-green-300"
              animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.9, ease: 'easeOut' }}
            />
          ))}
          {/* Spinning ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border-4 border-green-100 border-t-green-500"
          />
          {/* Center icon */}
          <div className="absolute inset-5 rounded-full bg-green-50 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={stepIndex}
                initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.4, opacity: 0, rotate: 20 }}
                transition={{ duration: 0.3 }}
                className="text-2xl"
                role="img"
                aria-hidden="true"
              >
                {STEPS[stepIndex]?.icon}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Step text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-bold text-gray-900 mb-2"
            aria-live="polite"
            aria-atomic="true"
          >
            {STEPS[stepIndex]?.text}
          </motion.p>
        </AnimatePresence>

        <p className="text-sm text-gray-400 mb-8">
          Using behavioral patterns to personalise your report
        </p>

        {/* Progress bar */}
        <div className="w-72 h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-gray-400 mb-10 tabular-nums">{progress}% complete</p>

        {/* Steps checklist */}
        <div className="space-y-2.5 max-w-xs w-full text-left">
          {STEPS.map((step, i) => {
            const done = i < stepIndex
            const active = i === stepIndex
            return (
              <motion.div
                key={step.text}
                animate={{ opacity: i <= stepIndex ? 1 : 0.3 }}
                className="flex items-center gap-3 text-sm"
              >
                <div className={`
                  w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                  ${done ? 'bg-green-500' : active ? 'border-2 border-green-400 bg-green-50' : 'border border-gray-200 bg-white'}
                `}>
                  {done && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </motion.svg>
                  )}
                  {active && (
                    <motion.div
                      animate={{ scale: [0.6, 1, 0.6] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-green-500"
                    />
                  )}
                </div>
                <span className={
                  done ? 'text-green-700 font-medium line-through decoration-green-300'
                  : active ? 'text-gray-900 font-semibold'
                  : 'text-gray-400'
                }>
                  {step.text}
                </span>
              </motion.div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
