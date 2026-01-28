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
  footer?: ReactNode
}

export default function Modal({ isOpen, onClose, title, children, className, footer }: ModalProps) {
  // Handle escape key press and iOS viewport height
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const updateVH = () => {
      // Fix iOS viewport height issue
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      window.addEventListener('resize', updateVH)
      document.body.style.overflow = 'hidden'
      updateVH()
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('resize', updateVH)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
      onClick={onClose}
    >
      <div className="h-full flex items-center justify-center p-0 sm:p-4">
        <div
          className={cn(
            'relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg bg-white sm:rounded-lg shadow-xl flex flex-col',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          <div className="flex-shrink-0 flex items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 py-3 sm:py-4 sm:rounded-t-lg safe-area-top">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h2>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-10 w-10 p-0 flex-shrink-0 -mr-2"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content - Scrollable */}
          <div
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 pb-6"
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain'
            }}
          >
            {children}
          </div>

          {/* Footer - Fixed iOS-style bottom action bar */}
          {footer && (
            <div
              className="flex-shrink-0 border-t border-gray-200 bg-white px-4 sm:px-6 py-3 sm:rounded-b-lg safe-area-bottom"
              style={{
                paddingBottom: 'max(12px, env(safe-area-inset-bottom))'
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
