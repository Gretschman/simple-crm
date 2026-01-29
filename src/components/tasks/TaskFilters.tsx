import { cn } from '@/lib/utils'
import type { TaskStatus, TaskPriority } from '@/types'

interface TaskFiltersProps {
  selectedStatus?: TaskStatus | 'all'
  onStatusChange: (status: TaskStatus | 'all') => void
  selectedPriority?: TaskPriority | 'all'
  onPriorityChange: (priority: TaskPriority | 'all') => void
  sortBy?: string
  onSortChange: (sortBy: string) => void
}

export default function TaskFilters({
  selectedStatus = 'all',
  onStatusChange,
  selectedPriority = 'all',
  onPriorityChange,
  sortBy = 'created_at',
  onSortChange,
}: TaskFiltersProps) {
  const statusOptions: { value: TaskStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ]

  const priorityOptions: { value: TaskPriority | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ]

  const sortOptions = [
    { value: 'created_at', label: 'Created Date' },
    { value: 'due_date', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title' },
  ]

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Status Filter Chips */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-neutral-700">Status</label>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusChange(option.value)}
              className={cn(
                'px-4 py-2 rounded-ios text-sm font-medium transition-all',
                selectedStatus === option.value
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Filter and Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Priority Filter */}
        <div className="flex flex-col gap-2">
          <label htmlFor="priority-filter" className="text-sm font-medium text-neutral-700">
            Priority
          </label>
          <select
            id="priority-filter"
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
            className="w-full rounded-ios border border-neutral-300 bg-white px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="flex flex-col gap-2">
          <label htmlFor="sort-by" className="text-sm font-medium text-neutral-700">
            Sort By
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full rounded-ios border border-neutral-300 bg-white px-3 py-2.5 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
