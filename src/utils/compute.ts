import type { LifestyleForm } from '@/types/form'
import type { BreakdownItem, ComputedResults, WealthMilestone } from '@/types/results'
import { CO2_FACTORS } from '@/data/co2Factors'
import { buildFamilyGoals } from '@/data/familyGoals'
import { generateInsights } from '@/utils/insights'

const WORKING_DAYS_PER_MONTH = 22
const CAR_COST_PER_KM = 3.5
const METRO_COST_PER_KM = 0.5

const WASTAGE_MONTHLY: Record<string, number> = {
  'Very low': 200,
  'Low': 350,
  'Medium': 600,
  'High': 950,
  'Very high': 1400,
}

function computeTransport(form: LifestyleForm): { monthly: number; co2Monthly: number } {
  const dailyDistance = form.commute * 2
  const monthlyDistance = dailyDistance * WORKING_DAYS_PER_MONTH

  if (form.transport === 'Car') {
    return {
      monthly: monthlyDistance * (CAR_COST_PER_KM - METRO_COST_PER_KM),
      co2Monthly: monthlyDistance * CO2_FACTORS.carPerKm,
    }
  }
  if (form.transport === 'Bike') {
    return {
      monthly: monthlyDistance * 0.8,
      co2Monthly: monthlyDistance * CO2_FACTORS.bikePerKm,
    }
  }
  return { monthly: 0, co2Monthly: monthlyDistance * CO2_FACTORS.metroPerKm }
}

function computeElectricity(form: LifestyleForm): { monthly: number; co2Monthly: number } {
  const baseline = 400
  const excess = Math.max(0, form.electricity - baseline)
  const acPenalty = Math.max(0, form.acHours - 3) * 120
  const monthly = excess * 0.3 + acPenalty
  const co2Monthly = form.electricity * CO2_FACTORS.electricityPerRupee
  return { monthly, co2Monthly }
}

function computeFood(form: LifestyleForm): { delivery: number; waste: number; co2Monthly: number } {
  const deliveryMonthly = form.deliveries * 4 * 90
  const wastageMonthly = WASTAGE_MONTHLY[form.wastage] ?? 600
  const co2Monthly =
    form.deliveries * 4 * CO2_FACTORS.deliveryPerOrder +
    wastageMonthly * CO2_FACTORS.foodWastePerRupee
  return { delivery: deliveryMonthly, waste: wastageMonthly, co2Monthly }
}

function computeShopping(form: LifestyleForm): number {
  return Math.max(0, (form.purchases - 2) * 450)
}

function buildBreakdown(
  transportMonthly: number,
  electricityMonthly: number,
  deliveryMonthly: number,
  wasteMonthly: number,
  shoppingMonthly: number,
  totalMonthly: number,
): BreakdownItem[] {
  const items: Array<Omit<BreakdownItem, 'percentage' | 'annual'>> = [
    { category: 'Transport', monthly: transportMonthly, color: '#f59e0b', emoji: '🚗' },
    { category: 'Food delivery', monthly: deliveryMonthly, color: '#ef4444', emoji: '🍔' },
    { category: 'Food wastage', monthly: wasteMonthly, color: '#f97316', emoji: '🗑️' },
    { category: 'Electricity', monthly: electricityMonthly, color: '#8b5cf6', emoji: '⚡' },
    { category: 'Impulse shopping', monthly: shoppingMonthly, color: '#06b6d4', emoji: '🛍️' },
  ]

  return items
    .filter((i) => i.monthly > 0)
    .map((i) => ({
      ...i,
      annual: i.monthly * 12,
      percentage: totalMonthly > 0 ? Math.round((i.monthly / totalMonthly) * 100) : 0,
    }))
    .sort((a, b) => b.monthly - a.monthly)
}

function buildWealthMilestones(annualSavings: number): WealthMilestone[] {
  const investable = annualSavings * 0.6
  const rate = 0.12
  return [1, 3, 5, 10, 15, 20].map((years) => ({
    years,
    corpus: Math.round(investable * years * Math.pow(1 + rate, years * 0.5)),
  }))
}

export function compute(form: LifestyleForm): ComputedResults {
  const transport = computeTransport(form)
  const electricity = computeElectricity(form)
  const food = computeFood(form)
  const shopping = computeShopping(form)

  const monthlyWaste = Math.round(
    transport.monthly + electricity.monthly + food.delivery + food.waste + shopping,
  )
  const annualWaste = monthlyWaste * 12

  const co2Annual = Math.round(
    (transport.co2Monthly + electricity.co2Monthly + food.co2Monthly) * 12,
  )

  const breakdown = buildBreakdown(
    Math.round(transport.monthly),
    Math.round(electricity.monthly),
    Math.round(food.delivery),
    Math.round(food.waste),
    Math.round(shopping),
    monthlyWaste,
  )

  const topCategory = breakdown[0] ?? {
    category: 'Food wastage',
    monthly: 0,
    annual: 0,
    percentage: 0,
    color: '#f97316',
    emoji: '🗑️',
  }

  const insights = generateInsights(form, {
    transportMonthly: Math.round(transport.monthly),
    deliveryMonthly: Math.round(food.delivery),
    wasteMonthly: Math.round(food.waste),
    electricityMonthly: Math.round(electricity.monthly),
    shoppingMonthly: Math.round(shopping),
  })

  const familyGoals = buildFamilyGoals(annualWaste, form.familySize)
  const wealthMilestones = buildWealthMilestones(annualWaste)

  return {
    monthlyWaste,
    annualWaste,
    topCategory,
    breakdown,
    insights,
    familyGoals,
    wealthMilestones,
    co2Annual,
    treesEquivalent: Math.round(co2Annual / CO2_FACTORS.treeCO2PerYear),
    carKmEquivalent: Math.round(co2Annual / CO2_FACTORS.carEmissionPerKm),
    familySize: form.familySize,
    monthlySavingsPotential: Math.round(monthlyWaste * 0.6),
  }
}
