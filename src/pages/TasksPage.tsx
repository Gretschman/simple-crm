import { useState, useEffect } from 'react'
import { CheckSquare, Plus, LayoutGrid, List as ListIcon } from 'lucide-react'
import { Button } from '@/components/ui'
import { TaskList, TaskFormModal, TaskFilters } from '@/components/tasks'
import { useTasks } from '@/hooks/useTasks'
import type { Task, TaskStatus, TaskPriority, TaskFilters as TaskFiltersType } from '@/types'

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>(() => {
    return (localStorage.getItem('taskViewMode') as 'list' | 'kanban') || 'list'
  })

  const [filters, setFilters] = useState<TaskFiltersType>({
    sortBy: 'created_at',
    sortOrder: 'desc',
  })
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Build filters object for query
  const queryFilters: TaskFiltersType = {
    ...filters,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
    search: searchQuery || undefined,
  }

  const { data: tasks, isLoading } = useTasks(queryFilters)

  // Save view mode preference
  useEffect(() => {
    localStorage.setItem('taskViewMode', viewMode)
  }, [viewMode])

  const handleAddTask = () => {
    setSelectedTask(undefined)
    setIsModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTask(undefined)
  }

  const handleStatusChange = (status: TaskStatus | 'all') => {
    setStatusFilter(status)
  }

  const handlePriorityChange = (priority: TaskPriority | 'all') => {
    setPriorityFilter(priority)
  }

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy: sortBy as any }))
  }

  const taskCount = tasks?.length || 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <CheckSquare className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Tasks</h1>
            <p className="text-sm text-neutral-600 mt-1">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-white rounded-ios border border-neutral-300 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-500 text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="List View"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-primary-500 text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Kanban View"
            >
              <ListIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Add Task Button */}
          <Button onClick={handleAddTask} className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-ios border border-neutral-300 bg-white px-4 py-3 pl-10 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
        <CheckSquare className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
      </div>

      {/* Filters */}
      <TaskFilters
        selectedStatus={statusFilter}
        onStatusChange={handleStatusChange}
        selectedPriority={priorityFilter}
        onPriorityChange={handlePriorityChange}
        sortBy={filters.sortBy}
        onSortChange={handleSortChange}
      />

      {/* Task List */}
      <TaskList
        tasks={tasks || []}
        isLoading={isLoading}
        viewMode={viewMode}
        onTaskClick={handleEditTask}
      />

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
      />
    </div>
  )
}
