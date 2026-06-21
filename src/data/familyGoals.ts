import type { FamilyGoal } from '@/types/results'
import { RECOVERABLE_SAVINGS_RATE } from '@/data/financialFactors'

/**
 * Translates a household's annual waste figure into a set of concrete
 * family opportunity goals (education, medical, vacation, investment, etc.),
 * each expressed as a rupee amount the family could realistically work toward.
 *
 * @param annualWaste - Total estimated avoidable annual spending.
 * @param familySize - Number of people in the household, used for note copy.
 * @returns Six {@link FamilyGoal} entries with computed rupee values.
 */
export function buildFamilyGoals(annualWaste: number, familySize: number): FamilyGoal[] {
  const saved = annualWaste * RECOVERABLE_SAVINGS_RATE
  return [
    {
      emoji: '🎓',
      label: 'Education fund',
      value: Math.round(saved * 3),
      note: '3-year saving potential',
    },
    {
      emoji: '🏥',
      label: 'Medical emergency fund',
      value: Math.round(saved * 0.5),
      note: `Covers ${familySize} family members`,
    },
    {
      emoji: '🏖️',
      label: 'Annual family vacation',
      value: Math.round(saved * 0.3),
      note: 'Allocated per year',
    },
    {
      emoji: '📈',
      label: 'Monthly SIP investment',
      value: Math.round((saved / 12) * 0.4),
      note: 'Monthly contribution',
    },
    {
      emoji: '🚗',
      label: 'Vehicle down payment',
      value: Math.round(saved * 2),
      note: '2-year saving goal',
    },
    {
      emoji: '🏠',
      label: 'Home loan EMI top-up',
      value: Math.round(saved / 12),
      note: 'Per month extra payment',
    },
  ]
}
