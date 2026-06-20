import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

type Page = 'home' | 'form' | 'loading' | 'dashboard'

interface NavBarProps {
  page: Page
  onReset?: () => void
}

export function NavBar({ page, onReset }: NavBarProps) {
  const isHome = page === 'home'

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        isHome
          ? 'bg-white/80 backdrop-blur-xl border-gray-100/60'
          : 'bg-white/95 backdrop-blur-md border-gray-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <motion.div
            className="relative w-6 h-6"
            whileHover={{ scale: 1.15, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-brand-400 opacity-30"
              animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <div className="absolute inset-0.5 rounded-full bg-brand-500" />
          </motion.div>
          <span className="font-bold text-gray-900 text-base tracking-tight">
            GreenWallet{' '}
            <span className="text-brand-600">AI</span>
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {page === 'dashboard' && onReset ? (
            <Button variant="outline" size="sm" onClick={onReset}>
              ← Start over
            </Button>
          ) : page === 'form' ? (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"
            >
              Step 1 of 1 — Fill your profile
            </motion.span>
          ) : (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100"
            >
              🔒 No data ever leaves your device
            </motion.span>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
