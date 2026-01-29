import { supabase } from '@/lib/supabase'
import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from '@/types'

export const taskService = {
  /**
   * Get all tasks with optional filtering and sorting
   */
  async getAll(filters?: TaskFilters): Promise<Task[]> {
    let query = supabase
      .from('tasks')
      .select('*')

    // Apply search filter
    if (filters?.search && filters.search.trim() !== '') {
      const searchTerm = `%${filters.search}%`
      query = query.or(
        `title.ilike.${searchTerm},description.ilike.${searchTerm}`
      )
    }

    // Apply status filter
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    // Apply priority filter
    if (filters?.priority) {
      query = query.eq('priority', filters.priority)
    }

    // Apply assigned_to filter
    if (filters?.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo)
    }

    // Apply contact_id filter
    if (filters?.contactId) {
      query = query.eq('contact_id', filters.contactId)
    }

    // Apply due date range filter
    if (filters?.dueDateFrom) {
      query = query.gte('due_date', filters.dueDateFrom)
    }
    if (filters?.dueDateTo) {
      query = query.lte('due_date', filters.dueDateTo)
    }

    // Apply sorting
    const sortOrder = filters?.sortOrder === 'desc' ? { ascending: false } : { ascending: true }

    switch (filters?.sortBy) {
      case 'due_date':
        query = query.order('due_date', { ...sortOrder, nullsFirst: false })
        break
      case 'priority':
        // Custom priority sorting: urgent > high > medium > low
        query = query.order('priority', sortOrder)
        break
      case 'title':
        query = query.order('title', sortOrder)
        break
      case 'updated_at':
        query = query.order('updated_at', sortOrder)
        break
      case 'created_at':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`)
    }

    return data || []
  },

  /**
   * Get a single task by ID
   */
  async getById(id: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch task: ${error.message}`)
    }

    if (!data) {
      throw new Error('Task not found')
    }

    return data
  },

  /**
   * Create a new task
   */
  async create(input: CreateTaskInput): Promise<Task> {
    // Convert empty strings to null for optional fields
    const cleanedInput = {
      ...input,
      description: input.description?.trim() || null,
      due_date: input.due_date || null,
      assigned_to: input.assigned_to || null,
      contact_id: input.contact_id || null,
      tags: input.tags || null,
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert(cleanedInput)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`)
    }

    return data
  },

  /**
   * Update an existing task
   */
  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    // Convert empty strings to null for optional fields
    const cleanedInput = {
      ...input,
      description: input.description?.trim() || null,
      due_date: input.due_date || null,
      assigned_to: input.assigned_to || null,
      contact_id: input.contact_id || null,
      tags: input.tags || null,
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(cleanedInput)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update task: ${error.message}`)
    }

    return data
  },

  /**
   * Delete a task
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`)
    }
  },
}
