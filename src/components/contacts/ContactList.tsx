import { UserX } from 'lucide-react'
import { Spinner, EmptyState, Button } from '@/components/ui'
import ContactCard from './ContactCard'
import type { Contact } from '@/types'

interface ContactListProps {
  contacts: Contact[] | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  onAddContact: () => void
}

export default function ContactList({
  contacts,
  isLoading,
  isError,
  error,
  onAddContact,
}: ContactListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-800">
          {error?.message || 'Failed to load contacts. Please try again.'}
        </p>
      </div>
    )
  }

  // Empty state
  if (!contacts || contacts.length === 0) {
    return (
      <EmptyState
        icon={UserX}
        title="No contacts found"
        description="Get started by adding your first contact."
        action={
          <Button onClick={onAddContact}>
            Add Contact
          </Button>
        }
      />
    )
  }

  // Contacts grid
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  )
}
