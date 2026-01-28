import { Link, useNavigate } from 'react-router-dom'
import { Users, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function Header() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Failed to log out')
    }
  }

  return (
    <header className="border-b border-warm-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors">
            <Users className="h-8 w-8" />
            <span className="text-xl font-bold text-warm-800">Simple CRM</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-warm-700 transition-colors hover:text-primary-600"
            >
              Contacts
            </Link>
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-warm-600">{user.email}</span>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
