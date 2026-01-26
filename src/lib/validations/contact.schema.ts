import { z } from 'zod'

// Helper to transform null/undefined to empty string for optional fields
const optionalString = (maxLength?: number, fieldName?: string) => {
  const schema = maxLength
    ? z.string().max(maxLength, `${fieldName || 'Field'} must be less than ${maxLength} characters`)
    : z.string()

  return z.preprocess(
    (val) => (val === null || val === undefined ? '' : val),
    z.union([schema, z.literal('')]).optional()
  )
}

export const contactSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),

  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),

  phone: optionalString(20, 'Phone number'),
  company: optionalString(200, 'Company name'),
  job_title: optionalString(100, 'Job title'),
  address: optionalString(),
  city: optionalString(100, 'City'),
  state: optionalString(50, 'State'),
  postal_code: optionalString(20, 'Postal code'),
  country: optionalString(100, 'Country'),
  notes: optionalString(),

  tags: z
    .array(z.string())
    .optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
