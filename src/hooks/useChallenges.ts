import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { ChallengeState } from '@/types/challenge'

const STORAGE_KEY = 'gw_challenges_v1'

export function useChallenges() {
  const [state, setState] = useLocalStorage<ChallengeState>(STORAGE_KEY, {})

  const toggle = (id: string) => {
    setState((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const isCompleted = (id: string) => !!state[id]

  const completedCount = Object.values(state).filter(Boolean).length

  return { state, toggle, isCompleted, completedCount }
}
