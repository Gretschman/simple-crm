import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { contactService } from '@/services/contact.service'
import type { Contact, CreateContactInput, UpdateContactInput, ContactFilters } from '@/types'
import toast from 'react-hot-toast'

const QUERY_KEY = 'contacts'

/**
 * Hook to fetch all contacts with optional filters
 */
export function useContacts(filters?: ContactFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => contactService.getAll(filters),
  })
}

/**
 * Hook to fetch a single contact by ID
 */
export function useContact(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => contactService.getById(id),
    enabled: !!id,
  })
}

/**
 * Hook to create a new contact
 */
export function useCreateContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateContactInput) => contactService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Contact created successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create contact')
    },
  })
}

/**
 * Hook to update an existing contact
 */
export function useUpdateContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateContactInput }) =>
      contactService.update(id, input),
    onSuccess: (data: Contact) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, data.id] })
      toast.success('Contact updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update contact')
    },
  })
}

/**
 * Hook to delete a contact
 */
export function useDeleteContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => contactService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Contact deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete contact')
    },
  })
}
