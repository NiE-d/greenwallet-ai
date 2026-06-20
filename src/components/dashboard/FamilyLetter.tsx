import { motion } from 'framer-motion'
import { formatINR } from '@/utils/formatters'

interface Props {
  annualWaste: number
  years10Corpus: number
  years20Corpus: number
  familySize: number
}

export function FamilyLetter({ annualWaste, years10Corpus, years20Corpus, familySize }: Props) {
  const recoverable = Math.round(annualWaste * 0.6)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-50 to-brand-50 border border-brand-100 rounded-2xl p-6 sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
        Personal financial letter — generated from your lifestyle
      </p>

      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
        <p className="text-base text-gray-900 font-medium">Dear Future Family,</p>

        <p>
          The choices we make today quietly shape the life you live tomorrow. Right now,
          approximately{' '}
          <strong className="text-gray-900 font-bold">{formatINR(annualWaste)}</strong> flows out of
          our household every year in avoidable waste — food that goes to landfill, traffic idling,
          peak-hour delivery fees, and small impulse purchases that add up invisibly.
        </p>

        <p>
          If we redirect just{' '}
          <strong className="text-brand-700 font-bold">{formatINR(recoverable)}</strong> of that
          every year into a disciplined SIP investment at 12% annual returns — which is achievable
          with a balanced index fund — the math becomes extraordinary.
        </p>

        <div className="bg-white border border-brand-100 rounded-xl px-5 py-4 my-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">In 10 years</p>
              <p className="text-xl font-extrabold text-brand-700">{formatINR(years10Corpus)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">In 20 years</p>
              <p className="text-xl font-extrabold text-brand-700">{formatINR(years20Corpus)}</p>
            </div>
          </div>
        </div>

        <p>
          That's your college education funded. That's a medical emergency covered without a loan.
          That's the family vacation we always talked about — actually happening. For a family of{' '}
          {familySize}, these aren't numbers on a screen. They're futures made possible by small,
          consistent choices.
        </p>

        <p>
          Every rupee rescued from waste is a rupee of freedom. We're choosing freedom, one habit at
          a time.
        </p>

        <p className="text-sm text-gray-400 italic mt-6">
          With love and intention,
          <br />
          Your family — choosing better today.
        </p>
      </div>
    </motion.div>
  )
}
