import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { ChallengeState } from '@/types/challenge'

const STORAGE_KEY = 'gw_challenges_v1'

/**
 * Manages completion state for the "frugal challenges" shown on the
 * dashboard. State is persisted to localStorage so progress survives
 * page reloads and new sessions.
 *
 * @returns An object with the current state map, a `toggle` function to
 *          flip a challenge's completion status, an `isCompleted` lookup,
 *          and a `completedCount` summary.
 */
export function useChallenges() {
  const [state, setState] = useLocalStorage<ChallengeState>(STORAGE_KEY, {})

  const toggle = (id: string) => {
    setState((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const isCompleted = (id: string) => !!state[id]

  const completedCount = Object.values(state).filter(Boolean).length

  return { state, toggle, isCompleted, completedCount }
}
