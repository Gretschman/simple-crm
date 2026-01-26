export interface FileAttachment {
  name: string
  url: string
  size: number
  type: string
  uploaded_at: string
}

export interface Contact {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  company?: string
  job_title?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  notes?: string
  tags?: string[]
  attachments?: FileAttachment[]
  created_at: string
  updated_at: string
}

export interface CreateContactInput {
  first_name: string
  last_name: string
  email: string
  phone?: string
  company?: string
  job_title?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  notes?: string
  tags?: string[]
}

export interface UpdateContactInput {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  company?: string
  job_title?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  notes?: string
  tags?: string[]
  attachments?: FileAttachment[]
}

export interface ContactFilters {
  search?: string
  sortBy?: 'name' | 'company' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}
