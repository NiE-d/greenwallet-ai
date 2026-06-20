import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavBar } from '@/components/layout/NavBar'
import { RadioPillGroup } from '@/components/ui/RadioPill'
import {
  LifestyleFormSchema,
  DEFAULT_FORM,
  type LifestyleForm,
} from '@/types/form'
import { z } from 'zod'

const TRANSPORT_OPTIONS = ['Car', 'Bike', 'Metro', 'Bus', 'Walk'] as const
const WASTAGE_OPTIONS = ['Very low', 'Low', 'Medium', 'High', 'Very high'] as const

interface Props {
  onSubmit: (form: LifestyleForm) => void
}

type FormErrors = Partial<Record<keyof LifestyleForm, string>>

/* ─── Section wrapper ─────────────────────────────────────────── */
function Section({
  icon, label, color, children,
}: {
  icon: string
  label: string
  color: string
  children: React.ReactNode
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl border border-green-100 bg-white overflow-hidden shadow-sm"
      aria-label={label}
    >
      {/* Section header bar */}
      <div className={`flex items-center gap-3 px-5 py-3.5 ${color}`}>
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-green-800">{label}</span>
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
    </motion.section>
  )
}

/* ─── Input field ─────────────────────────────────────────────── */
function Field({
  label, name, value, onChange, min, max, unit, hint, error,
}: {
  label: string
  name: string
  value: number
  onChange: (name: string, val: number) => void
  min?: number
  max?: number
  unit?: string
  hint?: string
  error?: string
}) {
  const display = value === 0 ? '' : String(value)

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type="number"
          value={display}
          placeholder="0"
          min={min}
          max={max}
          onChange={(e) => {
            const raw = e.target.value
            if (raw === '') { onChange(name, 0); return }
            const n = parseFloat(raw)
            if (!isNaN(n)) onChange(name, n)
          }}
          aria-describedby={error ? `${name}-err` : hint ? `${name}-hint` : undefined}
          aria-invalid={!!error}
          className={`
            w-full px-4 py-3 rounded-xl border-2 text-sm font-medium text-gray-900 bg-white
            outline-none transition-all duration-150
            placeholder:text-gray-300 placeholder:font-normal
            focus:border-green-500 focus:ring-4 focus:ring-green-100
            ${error
              ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100'
              : 'border-gray-200 hover:border-green-300'
            }
            ${unit ? 'pr-14' : ''}
          `}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="err"
            id={`${name}-err`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs font-semibold text-red-600 flex items-center gap-1"
          >
            <span>⚠️</span> {error}
          </motion.p>
        ) : hint ? (
          <motion.p
            key="hint"
            id={`${name}-hint`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-400"
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

/* ─── Error summary banner ────────────────────────────────────── */
function ErrorBanner({ errors }: { errors: FormErrors }) {
  const msgs = Object.values(errors).filter(Boolean) as string[]
  if (msgs.length === 0) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-red-50 border-2 border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3"
      role="alert"
    >
      <span className="text-xl flex-shrink-0">⚠️</span>
      <div>
        <p className="text-sm font-bold text-red-700 mb-1">Please fix these before continuing:</p>
        <ul className="space-y-0.5">
          {msgs.map((m, i) => (
            <li key={i} className="text-xs text-red-600">• {m}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

/* ─── Main component ──────────────────────────────────────────── */
export function FormPage({ onSubmit }: Props) {
  const [form, setForm] = useState<LifestyleForm>(DEFAULT_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [attempted, setAttempted] = useState(false)

  const setField = (name: string, value: number | string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    if (attempted) {
      // Re-validate this field live after first submit attempt
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = () => {
    setAttempted(true)
    const result = LifestyleFormSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      ;(result.error as z.ZodError).errors.forEach((e) => {
        const key = e.path[0] as keyof LifestyleForm
        if (!fieldErrors[key]) fieldErrors[key] = e.message
      })
      setErrors(fieldErrors)
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    onSubmit(result.data)
  }

  const hasErrors = Object.values(errors).some(Boolean)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/60 via-white to-white">
      <NavBar page="form" />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"
            />
            2-minute lifestyle snapshot
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Tell us about your lifestyle
          </h1>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            The more honestly you fill this, the more accurate your savings report will be.
          </p>
        </motion.div>

        {/* Privacy notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm text-green-800 mb-8"
        >
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"
          />
          <span>
            <strong>100% private</strong> — Everything is calculated in your browser. No data leaves your device.
          </span>
        </motion.div>

        {/* Error banner */}
        <AnimatePresence>
          {hasErrors && (
            <div className="mb-6">
              <ErrorBanner errors={errors} />
            </div>
          )}
        </AnimatePresence>

        {/* Form sections */}
        <div className="space-y-5">

          {/* ── Transport ── */}
          <Section icon="🚗" label="Transportation" color="bg-green-50">
            <Field
              label="Daily commute distance (one way)"
              name="commute"
              value={form.commute}
              onChange={setField}
              min={0}
              max={500}
              unit="km"
              hint="How far do you travel to work or school each way?"
              error={errors.commute}
            />
            <RadioPillGroup
              label="Primary transport mode"
              name="transport"
              options={TRANSPORT_OPTIONS}
              value={form.transport}
              onChange={setField}
            />
          </Section>

          {/* ── Electricity ── */}
          <Section icon="⚡" label="Electricity" color="bg-emerald-50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field
                label="Monthly electricity bill"
                name="electricity"
                value={form.electricity}
                onChange={setField}
                min={0}
                unit="₹"
                hint="Check your last electricity bill"
                error={errors.electricity}
              />
              <Field
                label="AC usage per day"
                name="acHours"
                value={form.acHours}
                onChange={setField}
                min={0}
                max={24}
                unit="hrs"
                hint="Avg hours per day (0–24)"
                error={errors.acHours}
              />
              <Field
                label="Fan usage per day"
                name="fanHours"
                value={form.fanHours}
                onChange={setField}
                min={0}
                max={24}
                unit="hrs"
                hint="Avg hours per day (0–24)"
                error={errors.fanHours}
              />
            </div>
          </Section>

          {/* ── Food ── */}
          <Section icon="🍔" label="Food" color="bg-teal-50">
            <Field
              label="Food delivery orders per week"
              name="deliveries"
              value={form.deliveries}
              onChange={setField}
              min={0}
              hint="Swiggy, Zomato, or any delivery platform"
              error={errors.deliveries}
            />
            <RadioPillGroup
              label="Food wastage level"
              name="wastage"
              options={WASTAGE_OPTIONS}
              value={form.wastage}
              onChange={setField}
            />
          </Section>

          {/* ── Spending ── */}
          <Section icon="🛍️" label="Spending & Lifestyle" color="bg-green-50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field
                label="Online purchases per month"
                name="purchases"
                value={form.purchases}
                onChange={setField}
                min={0}
                hint="Any platform, any category"
                error={errors.purchases}
              />
              <Field
                label="Streaming per day"
                name="streamingHours"
                value={form.streamingHours}
                onChange={setField}
                min={0}
                max={24}
                unit="hrs"
                hint="Netflix, YouTube, etc. (0–24)"
                error={errors.streamingHours}
              />
              <Field
                label="Family size"
                name="familySize"
                value={form.familySize}
                onChange={setField}
                min={1}
                max={50}
                hint="People in your household"
                error={errors.familySize}
              />
            </div>
          </Section>
        </div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <motion.button
            type="button"
            onClick={handleSubmit}
            aria-label="Submit lifestyle data and build my report"
            whileHover={{ scale: 1.03, boxShadow: '0 16px 40px rgba(22,163,74,0.35)' }}
            whileTap={{ scale: 0.97 }}
            className="relative group inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold text-base px-10 py-4 rounded-full transition-colors shadow-xl shadow-green-900/20 overflow-hidden"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span className="relative">Build my GreenWallet</span>
            <motion.span
              className="relative"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </motion.button>
          <p className="text-xs text-gray-400">Takes about 5 seconds to compute your report.</p>
        </motion.div>
      </main>
    </div>
  )
}
