import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Textarea, Button } from '@/components/ui'
import { contactSchema, type ContactFormData } from '@/lib/validations/contact.schema'
import type { Contact } from '@/types'

interface ContactFormProps {
  defaultValues?: Partial<Contact>
  onSubmit: (data: ContactFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
  renderActions?: (props: { onCancel: () => void; isSubmitting: boolean; isEdit: boolean }) => React.ReactNode
}

export default function ContactForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  renderActions,
}: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: defaultValues || {},
  })

  const isEdit = !!defaultValues?.email

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="contact-form">
      {/* Name Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="First Name"
          {...register('first_name')}
          error={errors.first_name?.message}
          placeholder="John"
        />
        <Input
          label="Last Name"
          {...register('last_name')}
          error={errors.last_name?.message}
          placeholder="Doe"
        />
      </div>

      {/* Email */}
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder="john.doe@example.com"
      />

      {/* Phone */}
      <Input
        label="Phone"
        type="tel"
        {...register('phone')}
        error={errors.phone?.message}
        placeholder="+1-555-0123"
      />

      {/* Company and Job Title */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Company"
          {...register('company')}
          error={errors.company?.message}
          placeholder="Acme Corp"
        />
        <Input
          label="Job Title"
          {...register('job_title')}
          error={errors.job_title?.message}
          placeholder="Sales Manager"
        />
      </div>

      {/* Address */}
      <Textarea
        label="Address"
        {...register('address')}
        error={errors.address?.message}
        placeholder="123 Main St"
        rows={2}
      />

      {/* City, State, Postal Code */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="City"
          {...register('city')}
          error={errors.city?.message}
          placeholder="San Francisco"
        />
        <Input
          label="State"
          {...register('state')}
          error={errors.state?.message}
          placeholder="CA"
        />
        <Input
          label="Postal Code"
          {...register('postal_code')}
          error={errors.postal_code?.message}
          placeholder="94105"
        />
      </div>

      {/* Country */}
      <Input
        label="Country"
        {...register('country')}
        error={errors.country?.message}
        placeholder="United States"
      />

      {/* Notes */}
      <Textarea
        label="Notes"
        {...register('notes')}
        error={errors.notes?.message}
        placeholder="Additional notes about this contact..."
        rows={4}
      />

      {/* Form Actions - Only render if renderActions is not provided */}
      {!renderActions && (
        <div className="flex justify-end gap-3 pt-6 pb-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEdit ? 'Update Contact' : 'Create Contact'}
          </Button>
        </div>
      )}
    </form>
  )
}
