import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  FileText,
} from 'lucide-react'
import { Button, Card, Spinner } from '@/components/ui'
import { ContactFormModal, DeleteConfirmationModal } from '@/components/contacts'
import { useContact } from '@/hooks/useContacts'
import { formatDate, formatPhoneNumber } from '@/lib/utils'

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { data: contact, isLoading, isError } = useContact(id!)

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !contact) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Contact not found</h2>
        <p className="mt-2 text-gray-600">The contact you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/')} className="mt-6">
          <ArrowLeft className="h-5 w-5" />
          Back to Contacts
        </Button>
      </div>
    )
  }

  const fullName = `${contact.first_name} ${contact.last_name}`
  const fullAddress = [contact.address, contact.city, contact.state, contact.postal_code, contact.country]
    .filter(Boolean)
    .join(', ')

  const handleDeleteSuccess = () => {
    navigate('/')
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/')}>
        <ArrowLeft className="h-5 w-5" />
        Back to Contacts
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
          {contact.job_title && (
            <p className="mt-1 text-lg text-gray-600">{contact.job_title}</p>
          )}
          {contact.company && (
            <p className="mt-1 text-sm text-gray-500">{contact.company}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-5 w-5" />
            Edit
          </Button>
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 className="h-5 w-5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Tags */}
      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {contact.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Contact Information */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Details Card */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Contact Details</h2>
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-primary-600 hover:underline"
                >
                  {contact.email}
                </a>
              </div>
            </div>

            {/* Phone */}
            {contact.phone && (
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-gray-900"
                  >
                    {formatPhoneNumber(contact.phone)}
                  </a>
                </div>
              </div>
            )}

            {/* Company */}
            {contact.company && (
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Company</p>
                  <p className="text-gray-900">{contact.company}</p>
                </div>
              </div>
            )}

            {/* Location */}
            {fullAddress && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-gray-900">{fullAddress}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Additional Information Card */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Additional Information</h2>
          <div className="space-y-4">
            {/* Notes */}
            {contact.notes && (
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="whitespace-pre-wrap text-gray-900">{contact.notes}</p>
                </div>
              </div>
            )}

            {/* Created Date */}
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Added</p>
                <p className="text-gray-900">{formatDate(contact.created_at)}</p>
              </div>
            </div>

            {/* Updated Date */}
            {contact.updated_at !== contact.created_at && (
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-gray-900">{formatDate(contact.updated_at)}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Edit Modal */}
      <ContactFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        contact={contact}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        contact={contact}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
