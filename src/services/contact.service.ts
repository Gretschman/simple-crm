import { supabase } from '@/lib/supabase'
import type { Contact, CreateContactInput, UpdateContactInput, ContactFilters } from '@/types'

export const contactService = {
  /**
   * Get all contacts with optional filtering and sorting
   */
  async getAll(filters?: ContactFilters): Promise<Contact[]> {
    let query = supabase
      .from('contacts')
      .select('*')

    // Apply search filter
    if (filters?.search && filters.search.trim() !== '') {
      const searchTerm = `%${filters.search}%`
      query = query.or(
        `first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm},company.ilike.${searchTerm}`
      )
    }

    // Apply sorting
    const sortOrder = filters?.sortOrder === 'desc' ? { ascending: false } : { ascending: true }

    switch (filters?.sortBy) {
      case 'name':
        query = query.order('last_name', sortOrder).order('first_name', sortOrder)
        break
      case 'company':
        query = query.order('company', { ...sortOrder, nullsFirst: false })
        break
      case 'created_at':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch contacts: ${error.message}`)
    }

    return data || []
  },

  /**
   * Get a single contact by ID
   */
  async getById(id: string): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch contact: ${error.message}`)
    }

    if (!data) {
      throw new Error('Contact not found')
    }

    return data
  },

  /**
   * Create a new contact
   */
  async create(input: CreateContactInput): Promise<Contact> {
    // Convert empty strings to null for optional fields
    const cleanedInput = {
      ...input,
      phone: input.phone?.trim() || null,
      company: input.company?.trim() || null,
      job_title: input.job_title?.trim() || null,
      address: input.address?.trim() || null,
      city: input.city?.trim() || null,
      state: input.state?.trim() || null,
      postal_code: input.postal_code?.trim() || null,
      country: input.country?.trim() || null,
      notes: input.notes?.trim() || null,
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert(cleanedInput)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create contact: ${error.message}`)
    }

    return data
  },

  /**
   * Update an existing contact
   */
  async update(id: string, input: UpdateContactInput): Promise<Contact> {
    // Convert empty strings to null for optional fields
    const cleanedInput = {
      ...input,
      phone: input.phone?.trim() || null,
      company: input.company?.trim() || null,
      job_title: input.job_title?.trim() || null,
      address: input.address?.trim() || null,
      city: input.city?.trim() || null,
      state: input.state?.trim() || null,
      postal_code: input.postal_code?.trim() || null,
      country: input.country?.trim() || null,
      notes: input.notes?.trim() || null,
    }

    const { data, error } = await supabase
      .from('contacts')
      .update(cleanedInput)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update contact: ${error.message}`)
    }

    return data
  },

  /**
   * Delete a contact
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete contact: ${error.message}`)
    }
  },
}
