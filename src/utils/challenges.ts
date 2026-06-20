import type { LifestyleForm } from '@/types/form'
import type { Challenge } from '@/types/challenge'
import { formatINR } from '@/utils/formatters'

export function generateChallenges(form: LifestyleForm): Challenge[] {
  const challenges: Challenge[] = []

  if (form.transport === 'Car' || form.transport === 'Bike') {
    const saving = form.commute * 2 * 4 * 3
    challenges.push({
      id: 'ch_metro',
      emoji: '🚇',
      title: 'Use public transport 4 days this week',
      reward: `Saves ${formatINR(saving)} this week`,
      category: 'transport',
    })

    challenges.push({
      id: 'ch_walk',
      emoji: '🚶',
      title: 'Walk or cycle for all trips under 2 km today',
      reward: 'Saves fuel + improves health',
      category: 'transport',
    })
  }

  if (form.deliveries > 2) {
    const saving = Math.round(form.deliveries * 90 * 0.6)
    challenges.push({
      id: 'ch_cook',
      emoji: '🍳',
      title: 'Cook dinner 3 times this week instead of ordering',
      reward: `Saves ${formatINR(saving)} this month`,
      category: 'food',
    })
  }

  challenges.push({
    id: 'ch_meal',
    emoji: '🗒️',
    title: 'Plan all meals for next week on Sunday',
    reward: 'Reduces food waste by 40–50%',
    category: 'food',
  })

  if (form.acHours > 3) {
    challenges.push({
      id: 'ch_ac',
      emoji: '🌡️',
      title: 'Set AC to 24°C for the next 7 days',
      reward: 'Saves ~₹120 on your electricity bill',
      category: 'electricity',
    })
  }

  if (form.purchases > 3) {
    const saving = Math.round(form.purchases * 200)
    challenges.push({
      id: 'ch_buy',
      emoji: '⏸️',
      title: 'Apply the 24-hour rule before every purchase this week',
      reward: `Could save ${formatINR(saving)} this month`,
      category: 'shopping',
    })
  }

  challenges.push({
    id: 'ch_lights',
    emoji: '💡',
    title: 'Turn off all lights and fans when leaving any room for 7 days',
    reward: 'Builds a permanent habit worth ₹50–100/month',
    category: 'electricity',
  })

  challenges.push({
    id: 'ch_reuse',
    emoji: '♻️',
    title: 'Use a reusable bottle and bag every day this week',
    reward: 'Saves packaging + ₹50 in bottled water',
    category: 'general',
  })

  return challenges.slice(0, 6)
}
