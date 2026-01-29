import { Modal, Button } from '@/components/ui'
import TaskForm from './TaskForm'
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks'
import type { Task } from '@/types'
import type { TaskFormData } from '@/lib/validations/task.schema'

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task
}

export default function TaskFormModal({ isOpen, onClose, task }: TaskFormModalProps) {
  const createMutation = useCreateTask()
  const updateMutation = useUpdateTask()

  const isEditing = !!task

  // Extract only form fields from task, excluding database metadata
  const formDefaultValues = task
    ? {
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date || '',
        assigned_to: task.assigned_to || '',
        contact_id: task.contact_id || '',
        tags: task.tags || [],
      }
    : undefined

  const handleSubmit = (data: TaskFormData) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: task.id, input: data },
        {
          onSuccess: () => {
            onClose()
          },
        }
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onClose()
        },
      })
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Add New Task'}
      className="max-w-2xl"
      footer={
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 w-full">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto min-h-[48px] text-base"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="task-form"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full sm:w-auto min-h-[48px] text-base"
          >
            {isEditing ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      }
    >
      <TaskForm
        defaultValues={formDefaultValues}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
        renderActions={() => null}
      />
    </Modal>
  )
}
