import { motion } from 'framer-motion'

export function PrivacyBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm text-green-800"
    >
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"
      />
      <span>
        <strong className="font-bold">Privacy First</strong> — Your data is computed entirely in
        your browser. Nothing is sent to any server, ever.
      </span>
    </motion.div>
  )
}
