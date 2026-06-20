export interface EquivalentItem {
  emoji: string
  label: string
  cost: number // in INR
}

export const EQUIVALENTS: EquivalentItem[] = [
  // Daily treats
  { emoji: '☕', label: 'Starbucks latte',        cost: 350 },
  { emoji: '☕', label: 'Starbucks cold brew',    cost: 400 },
  { emoji: '🍵', label: 'café cappuccino',        cost: 180 },
  { emoji: '☕', label: 'filter coffee',           cost: 60  },
  { emoji: '🧋', label: 'bubble tea',             cost: 220 },
  { emoji: '🥤', label: 'fresh juice',            cost: 80  },

  // Food
  { emoji: '🍔', label: 'burger meal',            cost: 220 },
  { emoji: '🍕', label: 'pizza slice',            cost: 120 },
  { emoji: '🍕', label: 'full pizza',             cost: 400 },
  { emoji: '🌮', label: 'burrito bowl',           cost: 280 },
  { emoji: '🍜', label: 'bowl of ramen',          cost: 350 },
  { emoji: '🍱', label: 'biryani meal',           cost: 160 },
  { emoji: '🍦', label: 'ice cream tub',          cost: 130 },
  { emoji: '🍰', label: 'slice of cake',          cost: 180 },
  { emoji: '🍫', label: 'chocolate bar',          cost: 50  },
  { emoji: '🥐', label: 'bakery croissant',       cost: 90  },

  // Entertainment
  { emoji: '🎬', label: 'movie ticket',           cost: 300 },
  { emoji: '🎵', label: 'days of Spotify',        cost: 7   },
  { emoji: '📺', label: 'months of Netflix',      cost: 649 },
  { emoji: '🎮', label: 'mobile game top-up',     cost: 500 },
  { emoji: '🎲', label: 'board game rental',      cost: 200 },

  // Books & learning
  { emoji: '📚', label: 'paperback book',         cost: 300 },
  { emoji: '📖', label: 'e-book',                 cost: 120 },
  { emoji: '🎓', label: 'online course lesson',   cost: 150 },

  // Fitness & health
  { emoji: '🏋️', label: 'gym session',           cost: 120 },
  { emoji: '🧘', label: 'yoga class',             cost: 200 },
  { emoji: '💊', label: 'vitamin supplement',     cost: 30  },
  { emoji: '🏃', label: 'running shoe fund',      cost: 3000},

  // Transport & micro
  { emoji: '🚕', label: 'Uber/Ola ride',          cost: 150 },
  { emoji: '🚇', label: 'metro ride',             cost: 40  },
  { emoji: '⛽', label: 'litre of petrol',        cost: 105 },

  // Savings & goals
  { emoji: '🌱', label: 'SIP investment day',     cost: 100 },
  { emoji: '💳', label: 'credit card EMI saved',  cost: 500 },
  { emoji: '🏦', label: 'emergency fund day',     cost: 200 },
]

export interface ComputedEquivalent {
  emoji: string
  label: string
  count: number
}

/**
 * Returns the most interesting mix of equivalents for a given monthly amount.
 * Picks items that produce satisfying "wow" counts — not too small, not too large.
 * Shows a variety of categories (treats, entertainment, fitness).
 */
export function getEquivalents(amount: number, count = 5): ComputedEquivalent[] {
  if (amount <= 0) return []

  const candidates = EQUIVALENTS
    .filter((e) => e.cost <= amount)
    .map((e) => ({
      emoji: e.emoji,
      label: e.label,
      count: Math.floor(amount / e.cost),
    }))
    .filter((e) => e.count >= 1)

  // Score each: favour counts in range 2–300 (interesting, not trivial or ridiculous)
  const scored = candidates.map((e) => {
    let score = 0
    if (e.count >= 2 && e.count <= 30)  score += 10   // sweet spot
    if (e.count >= 31 && e.count <= 300) score += 6   // large but legible
    if (e.count > 300) score += 2                      // extreme (Spotify days etc.)
    if (e.count === 1) score += 1
    return { ...e, score }
  })

  // Deduplicate by label prefix (avoid two coffees)
  const seen = new Set<string>()
  const deduped = scored.filter((e) => {
    const key = e.label.split(' ')[0]
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return deduped
    .sort((a, b) => b.score - a.score || b.count - a.count)
    .slice(0, count)
}
