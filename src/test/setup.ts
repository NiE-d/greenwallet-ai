import { afterEach } from 'vitest'

// jsdom provides a real localStorage implementation automatically when
// Vitest's environment is set to 'jsdom' (see vitest.config.ts).
// We just need to reset it between tests so localStorage-dependent
// tests stay deterministic and isolated from each other.
afterEach(() => {
  localStorage.clear()
})
