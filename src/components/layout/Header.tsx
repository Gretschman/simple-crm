import { Link, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import CapyCrocLogo from '@/components/ui/CapyCrocLogo'
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
    <header className="border-b border-neutral-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity group">
            <CapyCrocLogo className="h-10 w-10 sm:h-12 sm:w-12 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-bold text-neutral-800">Simple CRM</span>
              <span className="hidden sm:inline text-xs text-neutral-500 -mt-1">Riding the wave of productivity</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2 sm:gap-6">
            <Link
              to="/contacts"
              className="text-xs sm:text-sm font-medium text-neutral-700 transition-colors hover:text-primary-600"
            >
              Contacts
            </Link>
            {user && (
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="hidden md:inline text-sm text-neutral-600">{user.email}</span>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Exit</span>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
