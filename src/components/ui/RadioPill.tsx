import { motion } from 'framer-motion'

interface RadioPillGroupProps {
  label: string
  name: string
  options: readonly string[]
  value: string
  onChange: (name: string, value: string) => void
}

export function RadioPillGroup({ label, name, options, value, onChange }: RadioPillGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((opt) => {
          const selected = value === opt
          return (
            <motion.button
              key={opt}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(name, opt)}
              whileTap={{ scale: 0.93 }}
              whileHover={{ scale: 1.04 }}
              className={`
                px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400
                ${selected
                  ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-200'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700'
                }
              `}
            >
              {selected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mr-1.5"
                >
                  ✓
                </motion.span>
              )}
              {opt}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
