import { type ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export default function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Don't lock body scroll on mobile for better iOS compatibility
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      if (!isMobile) {
        document.body.style.overflow = 'hidden'
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-scroll"
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}
      onClick={onClose}
    >
      <div className="w-full min-h-screen flex items-start justify-center p-4 py-8">
        <div
          className={cn(
            'relative w-full max-w-lg rounded-lg bg-white shadow-xl mb-20',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
