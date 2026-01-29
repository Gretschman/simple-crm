import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Textarea, Button } from '@/components/ui'
import { taskSchema, type TaskFormData } from '@/lib/validations/task.schema'
import type { Task } from '@/types'
import { useContacts } from '@/hooks/useContacts'

interface TaskFormProps {
  defaultValues?: Partial<Task>
  onSubmit: (data: TaskFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
  renderActions?: (props: { onCancel: () => void; isSubmitting: boolean; isEdit: boolean }) => React.ReactNode
}

export default function TaskForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  renderActions,
}: TaskFormProps) {
  // Convert null to undefined for form defaults
  const formDefaults = defaultValues ? {
    title: defaultValues.title || '',
    description: defaultValues.description || '',
    status: defaultValues.status || 'todo',
    priority: defaultValues.priority || 'medium',
    due_date: defaultValues.due_date || '',
    assigned_to: defaultValues.assigned_to || '',
    contact_id: defaultValues.contact_id || '',
    tags: defaultValues.tags || [],
  } : {
    status: 'todo' as const,
    priority: 'medium' as const,
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: formDefaults,
  })

  const { data: contacts } = useContacts()

  const isEdit = !!defaultValues?.id

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="task-form">
      {/* Title */}
      <Input
        label="Title"
        {...register('title')}
        error={errors.title?.message}
        placeholder="Task title..."
        autoFocus
      />

      {/* Description */}
      <Textarea
        label="Description"
        {...register('description')}
        error={errors.description?.message}
        placeholder="Add details about this task..."
        rows={3}
      />

      {/* Status and Priority */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="w-full">
          <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Status
          </label>
          <select
            id="status"
            {...register('status')}
            className="w-full rounded-ios border border-neutral-300 bg-white px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          {errors.status && (
            <p className="mt-1.5 text-sm text-accent-600">{errors.status.message}</p>
          )}
        </div>

        <div className="w-full">
          <label htmlFor="priority" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Priority
          </label>
          <select
            id="priority"
            {...register('priority')}
            className="w-full rounded-ios border border-neutral-300 bg-white px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          {errors.priority && (
            <p className="mt-1.5 text-sm text-accent-600">{errors.priority.message}</p>
          )}
        </div>
      </div>

      {/* Due Date */}
      <Input
        label="Due Date"
        type="datetime-local"
        {...register('due_date')}
        error={errors.due_date?.message}
      />

      {/* Contact */}
      <div className="w-full">
        <label htmlFor="contact_id" className="mb-1.5 block text-sm font-medium text-neutral-700">
          Related Contact
        </label>
        <select
          id="contact_id"
          {...register('contact_id')}
          className="w-full rounded-ios border border-neutral-300 bg-white px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">None</option>
          {contacts?.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.first_name} {contact.last_name}
            </option>
          ))}
        </select>
        {errors.contact_id && (
          <p className="mt-1.5 text-sm text-accent-600">{errors.contact_id.message}</p>
        )}
      </div>

      {/* Form Actions - Only render if renderActions is not provided */}
      {!renderActions && (
        <div className="flex justify-end gap-3 pt-6 pb-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEdit ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      )}
    </form>
  )
}
