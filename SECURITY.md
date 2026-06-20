# Security Policy — GreenWallet AI

## Overview

GreenWallet AI is a **client-side-only** web application. No user data is transmitted to any server at any point. All computation, storage, and analysis happens in the user's browser.

---

## Threat Model

### Assets to protect
- User lifestyle input data (commute, electricity, food habits, family size)
- Derived financial estimates and personal letter content

### Trust boundaries
| Boundary | Description |
|---|---|
| User ↔ Browser | User inputs data; browser computes locally |
| Browser ↔ Network | **No boundary crossed** — zero network calls after page load |
| Browser ↔ LocalStorage | Challenge completion state only (non-sensitive) |

### Threats considered

| Threat | Risk | Mitigation |
|---|---|---|
| Data exfiltration | **None** — no server, no API | Zero network calls after load |
| XSS injection | Low | No innerHTML, no eval, React escapes by default |
| Malformed input | Low | Zod schema validation on all fields |
| localStorage tampering | Very low | Only non-sensitive challenge state stored |
| Prototype pollution | Very low | TypeScript strict mode, no `__proto__` access |
| Supply chain (npm) | Low | Minimal, well-audited dependencies only |

---

## Security Controls

### Input validation
All form inputs are validated against a Zod schema before processing:

```typescript
// src/types/form.ts
export const LifestyleFormSchema = z.object({
  commute: z.number().min(0).max(200),
  electricity: z.number().min(0).max(50000),
  // ...
})
```

Validation errors are surfaced in the UI and processing stops if validation fails.

### Input sanitization
Numeric inputs are parsed through a sanitizer that:
- Strips non-numeric characters
- Checks for finiteness before use
- Returns NaN (not a default) on failure

```typescript
// src/utils/sanitize.ts
export function parseNumericInput(value: string): number {
  const trimmed = value.trim().replace(/[^0-9.]/g, '')
  const parsed = parseFloat(trimmed)
  return isFinite(parsed) ? parsed : NaN
}
```

### LocalStorage safety
All localStorage operations are wrapped in try/catch to handle:
- Private browsing mode quota limits
- Malformed JSON from corrupted state
- Browser storage disabled policies

```typescript
export function safeLocalStorageGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}
```

### TypeScript strict mode
`tsconfig.json` enables:
- `"strict": true` (all strict checks)
- `"noUnusedLocals": true`
- `"noUnusedParameters": true`
- `"noFallthroughCasesInSwitch": true`

### No dangerous patterns
- No `dangerouslySetInnerHTML`
- No `eval()` or `new Function()`
- No dynamic script injection
- No user-controlled redirect targets
- React JSX escapes all string values by default

---

## Data Handling

### What is collected
**Nothing.** No analytics, no telemetry, no error tracking.

### What is stored locally
| Key | Content | Sensitivity |
|---|---|---|
| `ff_challenges_v1` | Object of `{challengeId: boolean}` | None |

### What is transmitted
**Nothing.** The app works entirely offline after the initial page load.

---

## HTTPS Deployment

When deployed to Vercel (recommended), the app is automatically served over HTTPS with:
- TLS 1.2+ enforced by Vercel's edge network
- HSTS headers provided by Vercel
- Automatic SSL certificate provisioning

For custom deployments, ensure HTTPS is enforced at the infrastructure level.

---

## Dependency Audit

Core dependencies and their security posture:

| Package | Version | Purpose | Notes |
|---|---|---|---|
| react | ^18.2 | UI framework | Actively maintained, XSS-safe by default |
| framer-motion | ^11.0 | Animation | No network calls, UI-only |
| recharts | ^2.12 | Charts | No network calls, rendering only |
| zod | ^3.22 | Validation | Schema validation library |

Run `npm audit` to check for known vulnerabilities in the installed dependency tree.

---

## Reporting a Vulnerability

If you discover a security issue in this project:

1. **Do not** open a public GitHub issue
2. Email the maintainer directly with details
3. Include reproduction steps if possible
4. Allow reasonable time for a fix before public disclosure

---

## Scope

Given that this is a zero-backend, zero-transmission application, the attack surface is limited to:
- The initial page load (HTTPS mitigates MITM)
- The build/deploy pipeline (supply chain)
- The browser's own security model

Standard web security best practices apply. The application does not handle authentication, payments, health data, or any regulated information category.
