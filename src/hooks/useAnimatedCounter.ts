import { useEffect, useRef, useState } from 'react'

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
