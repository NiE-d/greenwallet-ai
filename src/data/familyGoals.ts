import type { FamilyGoal } from '@/types/results'

export function buildFamilyGoals(annualWaste: number, familySize: number): FamilyGoal[] {
  const saved = annualWaste * 0.6
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
