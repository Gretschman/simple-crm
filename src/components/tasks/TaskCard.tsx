import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui'
import type { Task, TaskPriority } from '@/types'
import { cn } from '@/lib/utils'
import { useUpdateTask } from '@/hooks/useTasks'

interface TaskCardProps {
  task: Task
  onClick?: () => void
}

const priorityConfig: Record<TaskPriority, { color: string; label: string }> = {
  low: { color: 'bg-neutral-100 text-neutral-700 border-neutral-300', label: 'Low' },
  medium: { color: 'bg-primary-100 text-primary-700 border-primary-300', label: 'Medium' },
  high: { color: 'bg-amber-100 text-amber-700 border-amber-300', label: 'High' },
  urgent: { color: 'bg-red-100 text-red-700 border-red-300', label: 'Urgent' },
}

const statusConfig = {
  todo: { color: 'bg-neutral-100 text-neutral-700', label: 'To Do' },
  in_progress: { color: 'bg-primary-100 text-primary-700', label: 'In Progress' },
  done: { color: 'bg-green-100 text-green-700', label: 'Done' },
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const updateTask = useUpdateTask()

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'

  const handleMarkComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateTask.mutate({
      id: task.id,
      input: { status: task.status === 'done' ? 'todo' : 'done' },
    })
  }

  const formatDueDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diffInMs = d.getTime() - now.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Tomorrow'
    if (diffInDays === -1) return 'Yesterday'
    if (diffInDays < 0) return `${Math.abs(diffInDays)} days ago`
    if (diffInDays < 7) return `In ${diffInDays} days`

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <Card
      hover
      className={cn(
        'cursor-pointer p-4 transition-all',
        task.status === 'done' && 'opacity-70'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Complete Checkbox */}
        <button
          onClick={handleMarkComplete}
          className={cn(
            'mt-0.5 flex-shrink-0 rounded-full p-1 transition-colors hover:bg-neutral-100',
            task.status === 'done' && 'text-green-600'
          )}
        >
          <CheckCircle2
            className={cn(
              'h-5 w-5',
              task.status === 'done' ? 'fill-current' : ''
            )}
          />
        </button>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className={cn(
            'text-base font-medium text-neutral-900 mb-1',
            task.status === 'done' && 'line-through'
          )}>
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Badges and Due Date */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Badge */}
            <span className={cn(
              'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
              priorityConfig[task.priority].color
            )}>
              {priorityConfig[task.priority].label}
            </span>

            {/* Status Badge */}
            <span className={cn(
              'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
              statusConfig[task.status].color
            )}>
              {statusConfig[task.status].label}
            </span>

            {/* Due Date */}
            {task.due_date && (
              <span className={cn(
                'inline-flex items-center gap-1 text-xs',
                isOverdue ? 'text-red-600 font-medium' : 'text-neutral-600'
              )}>
                {isOverdue ? <AlertCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                {formatDueDate(task.due_date)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
