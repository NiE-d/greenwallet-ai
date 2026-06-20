import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HomePage } from '@/pages/HomePage'
import { FormPage } from '@/pages/FormPage'
import { LoadingPage } from '@/pages/LoadingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { compute } from '@/utils/compute'
import { DEFAULT_FORM, SAMPLE_FORM, type LifestyleForm } from '@/types/form'
import type { ComputedResults } from '@/types/results'

type Page = 'home' | 'form' | 'loading' | 'dashboard'

type PageVariant = {
  initial: { opacity: number; y?: number; x?: number; scale?: number }
  animate: { opacity: number; y?: number; x?: number; scale?: number }
  exit: { opacity: number; y?: number; x?: number; scale?: number }
}

const variants: Record<Page, PageVariant> = {
  home:      { initial: { opacity: 0, y: 24, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -24, scale: 1.01 } },
  form:      { initial: { opacity: 0, x: 48 },              animate: { opacity: 1, x: 0 },            exit: { opacity: 0, x: -48 } },
  loading:   { initial: { opacity: 0, scale: 0.96 },        animate: { opacity: 1, scale: 1 },        exit: { opacity: 0, scale: 1.04 } },
  dashboard: { initial: { opacity: 0, y: 32 },              animate: { opacity: 1, y: 0 },            exit: { opacity: 0, y: -20 } },
}

export default function App() {
  const [page, setPage]           = useState<Page>('home')
  const [form, setForm]           = useState<LifestyleForm>(DEFAULT_FORM)
  const [results, setResults]     = useState<ComputedResults | null>(null)
  const [isExample, setIsExample] = useState(false)

  const handleFormSubmit = (data: LifestyleForm) => {
    setForm(data)
    setIsExample(false)
    setResults(compute(data))
    setPage('loading')
  }

  const handleLoadingDone = () => {
    setPage('dashboard')
  }

  // "See example report" — populate a realistic sample profile and jump
  // straight to a fully computed dashboard (skips the form + loader).
  const handleExample = () => {
    setForm(SAMPLE_FORM)
    setResults(compute(SAMPLE_FORM))
    setIsExample(true)
    setPage('dashboard')
  }

  const handleReset = () => {
    setPage('home')
    setForm(DEFAULT_FORM)
    setResults(null)
    setIsExample(false)
  }

  const v = variants[page]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        initial={v.initial}
        animate={v.animate}
        exit={v.exit}
        transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {page === 'home' && (
          <HomePage onStart={() => setPage('form')} onExample={handleExample} />
        )}
        {page === 'form' && (
          <FormPage onSubmit={handleFormSubmit} />
        )}
        {page === 'loading' && (
          <LoadingPage onDone={handleLoadingDone} />
        )}
        {page === 'dashboard' && results && (
          <DashboardPage
            results={results}
            form={form}
            onReset={handleReset}
            isExample={isExample}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
