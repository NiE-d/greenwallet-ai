import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from 0 up to `target` using an ease-out-cubic curve,
 * driven by `requestAnimationFrame` for smooth 60fps updates. Used for the
 * dashboard's animated metric counters (waste score, rupee amounts, etc.).
 *
 * @param target - The final value to animate toward.
 * @param duration - Animation duration in milliseconds. Defaults to 1200ms.
 * @param enabled - When false, skips the animation and jumps straight to
 *                  `target` (e.g. to respect `prefers-reduced-motion`).
 * @returns The current animated value, updated on every frame.
 */
export function useAnimatedCounter(
  target: number,
  duration = 1200,
  enabled = true,
): number {
  const [current, setCurrent] = useState(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      setCurrent(target)
      return
    }

    const start = performance.now()
    const from = 0

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(from + (target - from) * eased))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration, enabled])

  return current
}
