import { Modal, Button } from '@/components/ui'
import { useDeleteContact } from '@/hooks/useContacts'
import type { Contact } from '@/types'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  contact: Contact
  onSuccess?: () => void
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  contact,
  onSuccess,
}: DeleteConfirmationModalProps) {
  const deleteMutation = useDeleteContact()

  const handleDelete = () => {
    deleteMutation.mutate(contact.id, {
      onSuccess: () => {
        onClose()
        onSuccess?.()
      },
    })
  }

  const fullName = `${contact.first_name} ${contact.last_name}`

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Contact"
      footer={
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="w-full sm:w-auto min-h-[48px] text-base"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={deleteMutation.isPending}
            disabled={deleteMutation.isPending}
            className="w-full sm:w-auto min-h-[48px] text-base"
          >
            Delete Contact
          </Button>
        </div>
      }
    >
      <p className="text-sm text-gray-600">
        Are you sure you want to delete{' '}
        <span className="font-semibold text-gray-900">{fullName}</span>? This action cannot be
        undone.
      </p>
    </Modal>
  )
}
