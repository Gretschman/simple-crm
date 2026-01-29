import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500, 'Title must be less than 500 characters'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  due_date: z.string().optional(),
  assigned_to: z.string().uuid().optional().or(z.literal('')),
  contact_id: z.string().uuid().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
})

export type TaskFormData = z.infer<typeof taskSchema>
