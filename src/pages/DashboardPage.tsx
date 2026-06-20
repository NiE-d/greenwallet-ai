import { motion } from 'framer-motion'
import { NavBar } from '@/components/layout/NavBar'
import { PrivacyBar } from '@/components/layout/PrivacyBar'
import { MetricCard } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ScoreRing } from '@/components/dashboard/ScoreRing'
import { WasteBreakdownChart } from '@/components/dashboard/WasteBreakdownChart'
import { InsightCard } from '@/components/dashboard/InsightCard'
import { FamilyOpportunityDash } from '@/components/dashboard/FamilyOpportunityDash'
import { WealthProjection } from '@/components/dashboard/WealthProjection'
import { FamilyLetter } from '@/components/dashboard/FamilyLetter'
import { PlanetImpact } from '@/components/dashboard/PlanetImpact'
import { ChallengeCard } from '@/components/dashboard/ChallengeCard'
import type { ComputedResults } from '@/types/results'
import { formatINR } from '@/utils/formatters'
import { generateChallenges } from '@/utils/challenges'
import { useChallenges } from '@/hooks/useChallenges'
import type { LifestyleForm } from '@/types/form'

interface Props {
  results: ComputedResults
  form: LifestyleForm
  onReset: () => void
  isExample?: boolean
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="text-xl font-extrabold text-gray-900 tracking-tight mb-1"
    >
      {children}
    </motion.h2>
  )
}

function SectionSub({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-400 mb-5">{children}</p>
}

function Divider() {
  return (
    <div className="relative my-10">
      <hr className="border-green-100" />
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-0 bg-white px-3">
        <div className="w-2 h-2 rounded-full bg-green-300" />
      </div>
    </div>
  )
}

export function DashboardPage({ results, form, onReset, isExample = false }: Props) {
  const { isCompleted, toggle } = useChallenges()
  const challenges = generateChallenges(form)

  const years10 = results.wealthMilestones.find((m) => m.years === 10)?.corpus ?? 0
  const years20 = results.wealthMilestones.find((m) => m.years === 20)?.corpus ?? 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-white">
      <NavBar page="dashboard" onReset={onReset} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <ScoreRing monthlyWaste={results.monthlyWaste} />
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mt-5 mb-1">
            Your GreenWallet Report
          </h1>
          <p className="text-sm text-gray-500">
            Here's what your lifestyle is really costing — and what it could build instead.
          </p>
        </motion.div>

        <div className="mb-6">
          <PrivacyBar />
        </div>

        {/* Example report banner */}
        {isExample && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-amber-50 border-2 border-amber-200 rounded-2xl px-5 py-4 mb-6"
          >
            <span className="text-xl flex-shrink-0">👀</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-800 mb-0.5">This is a sample report</p>
              <p className="text-xs text-amber-700">
                Based on: 12 km car commute · ₹2,500 electricity · 4 deliveries/week · family of 4.{' '}
                <button
                  onClick={onReset}
                  className="underline font-semibold hover:text-amber-900 transition-colors"
                >
                  Analyse your own lifestyle →
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* ── SECTION 1: Money ── */}
        <SectionHeading>💸 Money impact</SectionHeading>
        <SectionSub>Your avoidable monthly and annual lifestyle leakage.</SectionSub>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <MetricCard
            label="Monthly waste"
            value={formatINR(results.monthlyWaste)}
            sub="avoidable leakage"
          />
          <MetricCard
            label="Annual waste"
            value={formatINR(results.annualWaste)}
            sub="slipping away yearly"
            accent
          />
          <MetricCard
            label="Biggest leak"
            value={results.topCategory.emoji + ' ' + results.topCategory.category}
            sub={`${results.topCategory.percentage}% of total`}
          />
          <MetricCard
            label="Recoverable"
            value={formatINR(results.monthlySavingsPotential)}
            sub="realistic monthly saving"
          />
        </div>

        <WasteBreakdownChart breakdown={results.breakdown} />

        <Divider />

        {/* ── SECTION 2: Insights ── */}
        <SectionHeading>🔍 Personalized insights</SectionHeading>
        <SectionSub>Exactly what's leaking — and how to plug it, in practical terms.</SectionSub>

        <div className="space-y-4">
          {results.insights.map((insight, i) => (
            <InsightCard key={insight.id} insight={insight} index={i} />
          ))}
        </div>

        <Divider />

        {/* ── SECTION 3: Family ── */}
        <SectionHeading>👨‍👩‍👧 Family opportunity dashboard</SectionHeading>
        <SectionSub>
          What your annual savings of {formatINR(results.annualWaste * 0.6)} could do for your
          family of {results.familySize}.
        </SectionSub>

        <FamilyOpportunityDash goals={results.familyGoals} />

        <Divider />

        {/* ── SECTION 4: Wealth ── */}
        <SectionHeading>📈 Future wealth projection</SectionHeading>
        <SectionSub>Redirect recovered savings into investments and watch them compound.</SectionSub>

        <WealthProjection
          milestones={results.wealthMilestones}
          annualSavings={results.annualWaste}
        />

        <Divider />

        {/* ── SECTION 5: Letter ── */}
        <SectionHeading>✉️ A letter to your future family</SectionHeading>
        <SectionSub>Generated from your actual lifestyle data.</SectionSub>

        <FamilyLetter
          annualWaste={results.annualWaste}
          years10Corpus={years10}
          years20Corpus={years20}
          familySize={results.familySize}
        />

        <Divider />

        {/* ── SECTION 6: Planet ── */}
        <SectionHeading>🌍 Your planet impact</SectionHeading>
        <SectionSub>Environmental wins as a natural side effect of smarter financial choices.</SectionSub>

        <PlanetImpact
          co2Annual={results.co2Annual}
          treesEquivalent={results.treesEquivalent}
          carKmEquivalent={results.carKmEquivalent}
        />

        <Divider />

        {/* ── SECTION 7: Challenges ── */}
        <SectionHeading>🏆 GreenWallet challenges</SectionHeading>
        <SectionSub>Small actions this week. Tap to mark done — progress is saved.</SectionSub>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              completed={isCompleted(challenge.id)}
              onToggle={() => toggle(challenge.id)}
            />
          ))}
        </div>

        {/* Methodology disclaimer */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 mb-6 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            All calculations are illustrative estimates intended for awareness and educational
            purposes. Results are based on simplified assumptions and should not be considered
            financial advice.
          </p>
        </div>

        <div className="text-center pt-4 pb-8">
          <Button variant="outline" onClick={onReset}>
            ← Recalculate with new inputs
          </Button>
        </div>
      </main>
    </div>
  )
}
