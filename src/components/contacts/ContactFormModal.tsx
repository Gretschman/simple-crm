import { Modal, Button } from '@/components/ui'
import ContactForm from './ContactForm'
import { useCreateContact, useUpdateContact } from '@/hooks/useContacts'
import type { Contact } from '@/types'
import type { ContactFormData } from '@/lib/validations/contact.schema'

interface ContactFormModalProps {
  isOpen: boolean
  onClose: () => void
  contact?: Contact
}

export default function ContactFormModal({ isOpen, onClose, contact }: ContactFormModalProps) {
  const createMutation = useCreateContact()
  const updateMutation = useUpdateContact()

  const isEditing = !!contact

  // Extract only form fields from contact, excluding database metadata
  const formDefaultValues = contact
    ? {
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.phone || '',
        company: contact.company || '',
        job_title: contact.job_title || '',
        address: contact.address || '',
        city: contact.city || '',
        state: contact.state || '',
        postal_code: contact.postal_code || '',
        country: contact.country || '',
        notes: contact.notes || '',
        tags: contact.tags,
      }
    : undefined

  const handleSubmit = (data: ContactFormData) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: contact.id, input: data },
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
      title={isEditing ? 'Edit Contact' : 'Add New Contact'}
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
            form="contact-form"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full sm:w-auto min-h-[48px] text-base"
          >
            {isEditing ? 'Update Contact' : 'Create Contact'}
          </Button>
        </div>
      }
    >
      <ContactForm
        defaultValues={formDefaultValues}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
        renderActions={() => null}
      />
    </Modal>
  )
}
