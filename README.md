# GreenWallet AI

> **Save money. Secure your family's future. Help the planet accidentally.**

A behavioral economics-driven lifestyle analyzer that reveals hidden financial waste, projects family wealth opportunities, and surfaces environmental impact as a positive side effect — all running 100% client-side.

---

## Problem Statement

Traditional carbon footprint platforms fail because they rely on guilt and CO₂ numbers to change behavior. People don't make decisions primarily on environmental impact — they make decisions based on money, family, and personal goals.

**GreenWallet AI** flips the motivation stack:

| Old approach | Our approach |
|---|---|
| Show CO₂ numbers first | Show money lost first |
| Environmental guilt | Financial opportunity |
| Vague "reduce footprint" | Specific rupee amounts |
| Global metrics | Personal family goals |
| Annual averages | Daily habit changes |

Carbon reduction appears as a natural, positive side effect of better financial decisions.

---

## Behavioral Economics Approach

The app takes users through a deliberate psychological journey:

```
Money lost today
      ↓
Things you could have bought (equivalents)
      ↓
Family opportunity cost (education, healthcare, vacations)
      ↓
Future wealth potential (SIP projections)
      ↓
Planet impact (last — positive framing only)
```

Each stage builds emotional resonance before the next. By the time users see CO₂ data, they're already committed to change for financial reasons.

---

## Features

- **Lifestyle form** — 10 inputs across transport, electricity, food, and spending with Zod validation
- **Cinematic analysis loader** — animated 6-step sequence with progress tracking
- **Money impact dashboard** — animated score ring, metric cards, and Recharts bar chart
- **Personalized insights** — specific rupee amounts, real-world equivalents, and actionable tips
- **Family opportunity calculator** — education fund, medical buffer, vacation, SIP contributions
- **Wealth projection chart** — Recharts area chart with 6 milestones (1–20 years)
- **Future family letter** — emotionally personalized, generated from actual data
- **Planet impact section** — CO₂, trees, and car-km in positive framing, shown last
- **Frugal challenges** — 6 personalized weekly challenges with localStorage persistence
- **Privacy first** — zero data transmission, everything computed in-browser

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion 11 |
| Charts | Recharts 2 |
| Validation | Zod 3 |
| Persistence | LocalStorage |
| Deployment | Vercel (zero config) |

---

## Project Structure

```
src/
├── components/
│   ├── ui/           # Button, Card, Badge, InputField, RadioPill
│   ├── layout/       # NavBar, PrivacyBar
│   └── dashboard/    # ScoreRing, InsightCard, WealthProjection, etc.
├── pages/            # HomePage, FormPage, LoadingPage, DashboardPage
├── hooks/            # useLocalStorage, useAnimatedCounter, useChallenges
├── utils/            # compute, insights, challenges, formatters, sanitize
├── data/             # equivalents, co2Factors, familyGoals
└── types/            # form, results, challenge
```

---

## Installation

```bash
git clone https://github.com/yourname/greenwallet-ai
cd greenwallet-ai
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deployment

**Vercel (recommended):**

```bash
npm install -g vercel
vercel
```

Or push to GitHub and connect to Vercel — zero configuration required. No environment variables needed.

**Manual build:**

```bash
npm run build
# Output in /dist — deploy to any static host
```

---

## Accessibility

- Semantic HTML throughout (`<main>`, `<section>`, `<nav>`, `aria-label`)
- All interactive elements have accessible names
- `aria-live` on loading step announcements
- `aria-checked` on challenge checkboxes
- `role="radiogroup"` on pill selectors
- Keyboard navigation on all interactive elements (`tabIndex`, `onKeyDown`)
- `focus-visible` ring on keyboard navigation only
- `prefers-reduced-motion` respected in `index.css`
- Color contrast meets WCAG AA throughout

---

## Security

See [SECURITY.md](./SECURITY.md) for full threat model and security practices.

Summary:
- No data transmission of any kind
- Zod schema validation on all user inputs
- Input sanitization before numeric parsing
- Safe localStorage read/write with try/catch
- No eval, no innerHTML, no external API calls
- TypeScript strict mode enabled

---

## Computation Model

### Transport waste
- Car vs metro cost differential: ₹3.50/km vs ₹0.50/km
- Based on commute distance × working days per month

### Food delivery waste
- Platform/delivery markup estimated at ~30–40% of food cost
- ₹90 per order in excess platform fees

### Food wastage
- Mapped from qualitative level to monthly INR estimate
- Ranges from ₹200 (Very low) to ₹1,400 (Very high)

### Electricity waste
- Excess above ₹400 baseline efficiency threshold
- AC penalty for usage above 3 hrs/day

### Wealth projection
- Assumes 60% of recoverable waste is investable
- 12% p.a. return (realistic for balanced Indian index fund)
- Formula: `savings × years × (1 + rate)^(years × 0.5)`

### CO₂ factors
- Car: 0.17 kg/km, Bike: 0.04 kg/km, Metro: 0.03 kg/km
- Electricity: 0.0008 kg per ₹ (Indian grid average)
- Food delivery: 0.5 kg per order
- Tree absorption: 21 kg CO₂/year

---

## Methodology Disclaimer

All calculations are illustrative estimates intended for awareness and educational purposes.
Results are based on simplified assumptions and should not be considered financial advice.

---

## Future Improvements

- [ ] PDF export of the full report
- [ ] Challenge streaks and history
- [ ] City-specific transport cost adjustments
- [ ] Household vs individual mode
- [ ] Shareable report card (image generation)
- [ ] Progressive Web App (offline support)
