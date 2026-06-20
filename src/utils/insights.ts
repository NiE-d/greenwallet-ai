import type { LifestyleForm } from '@/types/form'
import type { Insight } from '@/types/results'
import { getEquivalents } from '@/data/equivalents'
import { formatINR } from '@/utils/formatters'

interface CategoryAmounts {
  transportMonthly: number
  deliveryMonthly: number
  wasteMonthly: number
  electricityMonthly: number
  shoppingMonthly: number
}

export function generateInsights(
  form: LifestyleForm,
  amounts: CategoryAmounts,
): Insight[] {
  const insights: Insight[] = []

  // Transport insight
  if (form.transport === 'Car' && form.commute > 3) {
    const annual = amounts.transportMonthly * 12
    insights.push({
      id: 'transport',
      title: `You drove ${form.commute} km each way by car instead of taking public transport`,
      description: `Switching to the metro 4 days a week could save you ${formatINR(amounts.transportMonthly * 0.8)} per month. That's ${formatINR(annual * 0.8)} every year — enough to start a meaningful emergency fund for your family.`,
      monthlyLoss: amounts.transportMonthly,
      annualLoss: annual,
      equivalents: getEquivalents(amounts.transportMonthly, 5),
      savingTip: `Try taking public transport Monday–Thursday. Keep the car for Friday and weekends.`,
      co2Impact: `Prevents ~${Math.round(form.commute * 2 * 22 * 0.14 * 12)} kg CO₂ per year`,
      badgeType: 'red',
    })
  } else if (form.transport === 'Bike' && form.commute > 5) {
    const annual = amounts.transportMonthly * 12
    insights.push({
      id: 'transport',
      title: `Bike commuting over long distances adds fuel and maintenance costs`,
      description: `For distances above 5 km, a combination of metro + walking can save ${formatINR(amounts.transportMonthly * 0.6)} monthly while reducing fatigue.`,
      monthlyLoss: amounts.transportMonthly,
      annualLoss: annual,
      equivalents: getEquivalents(amounts.transportMonthly, 5),
      savingTip: `Consider metro for the main stretch and cycling for the last mile.`,
      co2Impact: `Saves ~${Math.round(form.commute * 2 * 22 * 0.01 * 12)} kg CO₂ per year`,
      badgeType: 'gold',
    })
  }

  // Food delivery insight
  if (form.deliveries > 2) {
    const annual = amounts.deliveryMonthly * 12
    insights.push({
      id: 'delivery',
      title: `${form.deliveries} food delivery orders per week carry hidden platform premiums`,
      description: `Platform fees, surge pricing, and delivery charges add 30–40% to the food cost. Cooking 3 of those meals at home could save ${formatINR(amounts.deliveryMonthly * 0.6)} per month — that's ${formatINR(annual * 0.6)} per year.`,
      monthlyLoss: amounts.deliveryMonthly,
      annualLoss: annual,
      equivalents: getEquivalents(amounts.deliveryMonthly, 5),
      savingTip: `Set a delivery budget of ${form.deliveries - 2} orders per week. Batch-cook on Sunday evenings.`,
      co2Impact: `Cuts ~${Math.round(form.deliveries * 4 * 0.5 * 12)} kg CO₂ from delivery vehicles annually`,
      badgeType: 'red',
    })
  }

  // Food wastage insight
  if (form.wastage !== 'Very low' && form.wastage !== 'Low') {
    const annual = amounts.wasteMonthly * 12
    insights.push({
      id: 'wastage',
      title: `Food wastage is the most overlooked household money drain`,
      description: `At a "${form.wastage}" wastage level, your household discards roughly ${formatINR(amounts.wasteMonthly)} of edible food every month. A weekly meal plan and a shopping list cut this by 40–60%.`,
      monthlyLoss: amounts.wasteMonthly,
      annualLoss: annual,
      equivalents: getEquivalents(amounts.wasteMonthly, 5),
      savingTip: `Plan 5 dinners on Sunday. Shop once with a strict list. Store leftovers front-and-center in the fridge.`,
      co2Impact: `Reduces ~${Math.round(amounts.wasteMonthly * 0.003 * 12)} kg CO₂ from food decomposition`,
      badgeType: 'red',
    })
  }

  // Electricity insight
  if (amounts.electricityMonthly > 100) {
    const annual = amounts.electricityMonthly * 12
    insights.push({
      id: 'electricity',
      title: `Your electricity bill is above the efficient household average`,
      description: `Setting the AC to 24°C (vs 18°C), switching to 5-star appliances, and using LED bulbs reduces consumption by 20–30%. That's ${formatINR(amounts.electricityMonthly * 0.25)} saved monthly, or ${formatINR(annual * 0.25)} per year.`,
      monthlyLoss: amounts.electricityMonthly,
      annualLoss: annual,
      equivalents: getEquivalents(amounts.electricityMonthly, 5),
      savingTip: `Set AC to 24°C. Use timer mode overnight. Replace one appliance with a 5-star rating this year.`,
      co2Impact: `Reduces ~${Math.round(form.electricity * 0.0008 * 12 * 0.25)} kg CO₂ annually`,
      badgeType: 'gold',
    })
  }

  // Shopping insight
  if (form.purchases > 3) {
    const annual = amounts.shoppingMonthly * 12
    insights.push({
      id: 'shopping',
      title: `${form.purchases} online purchases per month include significant impulse buying`,
      description: `Studies show 40% of online purchases are unplanned. A 24-hour "wishlist cooling-off" rule could recover ${formatINR(amounts.shoppingMonthly * 0.4)} monthly — building ${formatINR(annual * 0.4)} in annual savings instead.`,
      monthlyLoss: amounts.shoppingMonthly,
      annualLoss: annual,
      equivalents: getEquivalents(amounts.shoppingMonthly, 5),
      savingTip: `Add items to wishlist. Wait 24 hours. Delete anything that no longer feels urgent.`,
      co2Impact: `Cuts packaging, returns, and last-mile delivery emissions`,
      badgeType: 'gold',
    })
  }

  return insights
}
