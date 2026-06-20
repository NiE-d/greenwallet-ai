import { z } from 'zod'

export const TransportMode = z.enum(['Car', 'Bike', 'Metro', 'Bus', 'Walk'])
export type TransportMode = z.infer<typeof TransportMode>

export const WastageLevel = z.enum(['Very low', 'Low', 'Medium', 'High', 'Very high'])
export type WastageLevel = z.infer<typeof WastageLevel>

export const LifestyleFormSchema = z.object({
  commute: z
    .number({ invalid_type_error: 'Enter a number' })
    .min(0, 'Must be 0 or more')
    .max(500, 'Max 500 km'),
  transport: TransportMode,
  electricity: z
    .number({ invalid_type_error: 'Enter a number' })
    .min(0, 'Must be 0 or more')
    .max(100000, 'Seems too high'),
  acHours: z
    .number({ invalid_type_error: 'Enter a number' })
    .min(0, 'Must be 0 or more')
    .max(24, 'Cannot exceed 24 hrs/day'),
  fanHours: z
    .number({ invalid_type_error: 'Enter a number' })
    .min(0, 'Must be 0 or more')
    .max(24, 'Cannot exceed 24 hrs/day'),
  deliveries: z
    .number({ invalid_type_error: 'Enter a number' })
    .min(0, 'Must be 0 or more')
    .max(200, 'Max 200 orders'),
  wastage: WastageLevel,
  purchases: z
    .number({ invalid_type_error: 'Enter a number' })
    .min(0, 'Must be 0 or more')
    .max(10000, 'Max 10,000 purchases'),
  streamingHours: z
    .number({ invalid_type_error: 'Enter a number' })
    .min(0, 'Must be 0 or more')
    .max(24, 'Cannot exceed 24 hrs/day'),
  familySize: z
    .number({ invalid_type_error: 'Enter a number' })
    .min(1, 'At least 1 person')
    .max(50, 'Max 50 members'),
})

export type LifestyleForm = z.infer<typeof LifestyleFormSchema>

// Sensible defaults so form isn't blank on load
export const DEFAULT_FORM: LifestyleForm = {
  commute: 0,
  transport: 'Car',
  electricity: 0,
  acHours: 0,
  fanHours: 0,
  deliveries: 0,
  wastage: 'Medium',
  purchases: 0,
  streamingHours: 0,
  familySize: 1,
}

// Realistic sample profile used by "See example report"
export const SAMPLE_FORM: LifestyleForm = {
  commute: 12,
  transport: 'Car',
  electricity: 2500,
  acHours: 6,
  fanHours: 10,
  deliveries: 4,
  wastage: 'Medium',
  purchases: 8,
  streamingHours: 3,
  familySize: 4,
}
