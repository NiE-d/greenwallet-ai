export interface BreakdownItem {
  category: string
  monthly: number
  annual: number
  percentage: number
  color: string
  emoji: string
}

export interface Equivalent {
  emoji: string
  label: string
  count: number
}

export interface Insight {
  id: string
  title: string
  description: string
  monthlyLoss: number
  annualLoss: number
  equivalents: Equivalent[]
  savingTip: string
  co2Impact: string
  badgeType: 'red' | 'gold' | 'green'
}

export interface FamilyGoal {
  emoji: string
  label: string
  value: number
  note: string
}

export interface WealthMilestone {
  years: number
  corpus: number
}

export interface ComputedResults {
  monthlyWaste: number
  annualWaste: number
  topCategory: BreakdownItem
  breakdown: BreakdownItem[]
  insights: Insight[]
  familyGoals: FamilyGoal[]
  wealthMilestones: WealthMilestone[]
  co2Annual: number
  treesEquivalent: number
  carKmEquivalent: number
  familySize: number
  monthlySavingsPotential: number
}
