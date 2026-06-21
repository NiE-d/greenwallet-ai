/**
 * Shared financial assumption constants.
 *
 * These were previously hardcoded as the literal `0.6` independently in
 * compute.ts, familyGoals.ts, challenges.ts, insights.ts, FamilyLetter.tsx,
 * and WealthProjection.tsx. Consolidating them here means the assumption
 * only needs to be changed in one place, and its meaning is documented once.
 */

/**
 * The fraction of identified monthly/annual waste that a typical household
 * can realistically redirect into savings or investments. Used as the basis
 * for wealth projections, family opportunity goals, and savings-potential
 * figures shown throughout the dashboard.
 */
export const RECOVERABLE_SAVINGS_RATE = 0.6
