import { type ClassValue, clsx } from 'clsx'

/**
 * Merge className strings with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/**
 * Format a phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')

  // Format based on length
  if (cleaned.length === 10) {
    // US format: (555) 555-5555
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    // US format with country code: +1 (555) 555-5555
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }

  // Return original if not a standard format
  return phone
}
