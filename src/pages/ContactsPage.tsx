import { useState } from 'react'
import { Plus, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui'
import { ContactList, SearchBar, ContactFormModal } from '@/components/contacts'
import { useContacts } from '@/hooks/useContacts'
import type { ContactFilters } from '@/types'

export default function ContactsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState<ContactFilters>({
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  })

  const { data: contacts, isLoading, isError, error } = useContacts(filters)

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }

  const handleSortChange = (sortBy: ContactFilters['sortBy']) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sortOptions = [
    { value: 'name' as const, label: 'Name' },
    { value: 'company' as const, label: 'Company' },
    { value: 'created_at' as const, label: 'Date Added' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your contacts and relationships
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-5 w-5" />
          Add Contact
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="flex-1">
          <SearchBar
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Search by name, email, or company..."
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex gap-2">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={filters.sortBy === option.value ? 'primary' : 'secondary'}
                onClick={() => handleSortChange(option.value)}
                className="text-xs"
              >
                {option.label}
                {filters.sortBy === option.value && (
                  <ArrowUpDown className="h-3 w-3" />
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      {contacts && contacts.length > 0 && (
        <p className="text-sm text-gray-600">
          {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'} found
        </p>
      )}

      {/* Contact List */}
      <ContactList
        contacts={contacts}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onAddContact={() => setIsModalOpen(true)}
      />

      {/* Create Contact Modal */}
      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
