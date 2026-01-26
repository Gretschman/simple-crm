import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
            <Users className="h-8 w-8" />
            <span className="text-xl font-bold">Simple CRM</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
            >
              Contacts
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
