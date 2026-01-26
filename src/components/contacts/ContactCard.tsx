import { useNavigate } from 'react-router-dom'
import { Mail, Phone, Building2, MapPin } from 'lucide-react'
import { Card } from '@/components/ui'
import { formatPhoneNumber } from '@/lib/utils'
import type { Contact } from '@/types'

interface ContactCardProps {
  contact: Contact
}

export default function ContactCard({ contact }: ContactCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/contacts/${contact.id}`)
  }

  const fullName = `${contact.first_name} ${contact.last_name}`
  const location = [contact.city, contact.state].filter(Boolean).join(', ')

  return (
    <Card
      hover
      className="cursor-pointer transition-all"
      onClick={handleClick}
    >
      {/* Name and Job Title */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{fullName}</h3>
        {contact.job_title && (
          <p className="text-sm text-gray-600">{contact.job_title}</p>
        )}
      </div>

      {/* Contact Details */}
      <div className="space-y-2">
        {/* Email */}
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-gray-400" />
          <a
            href={`mailto:${contact.email}`}
            className="text-primary-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {contact.email}
          </a>
        </div>

        {/* Phone */}
        {contact.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{formatPhoneNumber(contact.phone)}</span>
          </div>
        )}

        {/* Company */}
        {contact.company && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="h-4 w-4 text-gray-400" />
            <span>{contact.company}</span>
          </div>
        )}

        {/* Location */}
        {location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{location}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {contact.tags && contact.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {contact.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  )
}
