import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { taskService } from '@/services/task.service'
import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from '@/types'
import toast from 'react-hot-toast'

const QUERY_KEY = 'tasks'

/**
 * Hook to fetch all tasks with optional filters
 */
export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => taskService.getAll(filters),
  })
}

/**
 * Hook to fetch a single task by ID
 */
export function useTask(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => taskService.getById(id),
    enabled: !!id,
  })
}

/**
 * Hook to create a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTaskInput) => taskService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Task created successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create task')
    },
  })
}

/**
 * Hook to update an existing task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      taskService.update(id, input),
    onSuccess: (data: Task) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, data.id] })
      toast.success('Task updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update task')
    },
  })
}

/**
 * Hook to delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => taskService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Task deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete task')
    },
  })
}
