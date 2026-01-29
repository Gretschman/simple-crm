import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TaskCard from './TaskCard'
import type { Task, TaskStatus } from '@/types'
import { useUpdateTask } from '@/hooks/useTasks'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskListProps {
  tasks: Task[]
  isLoading?: boolean
  viewMode: 'list' | 'kanban'
  onTaskClick?: (task: Task) => void
}

interface SortableTaskCardProps {
  task: Task
  onClick?: () => void
}

function SortableTaskCard({ task, onClick }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={onClick} />
    </div>
  )
}

export default function TaskList({ tasks, isLoading, viewMode, onTaskClick }: TaskListProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const updateTask = useUpdateTask()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: any) => {
    const task = tasks.find(t => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    // Check if dropped on a different column
    const task = tasks.find(t => t.id === taskId)
    if (task && task.status !== newStatus) {
      updateTask.mutate({
        id: taskId,
        input: { status: newStatus },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">
          {viewMode === 'kanban' ? 'No tasks yet. Create your first task to get started!' : 'No tasks found'}
        </p>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick?.(task)} />
        ))}
      </div>
    )
  }

  // Kanban View
  const columns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'todo', label: 'To Do', color: 'bg-neutral-100' },
    { id: 'in_progress', label: 'In Progress', color: 'bg-primary-100' },
    { id: 'done', label: 'Done', color: 'bg-green-100' },
  ]

  const tasksByStatus = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter(task => task.status === column.id)
    return acc
  }, {} as Record<TaskStatus, Task[]>)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col">
            <div className={cn(
              'rounded-ios-lg p-3 mb-3 border border-neutral-200',
              column.color
            )}>
              <h3 className="font-semibold text-sm text-neutral-800">
                {column.label}
                <span className="ml-2 text-neutral-600">
                  ({tasksByStatus[column.id]?.length || 0})
                </span>
              </h3>
            </div>

            <SortableContext
              items={tasksByStatus[column.id]?.map(t => t.id) || []}
              strategy={verticalListSortingStrategy}
              id={column.id}
            >
              <div className="flex-1 space-y-3 min-h-[200px] p-2 rounded-ios-lg border-2 border-dashed border-neutral-200">
                {tasksByStatus[column.id]?.map((task) => (
                  <SortableTaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick?.(task)}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
