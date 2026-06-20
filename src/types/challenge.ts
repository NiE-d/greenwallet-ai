export interface Challenge {
  id: string
  emoji: string
  title: string
  reward: string
  category: 'transport' | 'food' | 'electricity' | 'shopping' | 'general'
}

export interface ChallengeState {
  [id: string]: boolean
}
