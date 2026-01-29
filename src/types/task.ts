export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date?: string | null
  completed_at?: string | null
  assigned_to?: string | null
  contact_id?: string | null
  tags?: string[] | null
  created_at: string
  updated_at: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string
  assigned_to?: string
  contact_id?: string
  tags?: string[]
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string
  assigned_to?: string
  contact_id?: string
  tags?: string[]
}

export interface TaskFilters {
  search?: string
  status?: TaskStatus
  priority?: TaskPriority
  assignedTo?: string
  contactId?: string
  dueDateFrom?: string
  dueDateTo?: string
  sortBy?: 'created_at' | 'updated_at' | 'due_date' | 'priority' | 'title'
  sortOrder?: 'asc' | 'desc'
}
