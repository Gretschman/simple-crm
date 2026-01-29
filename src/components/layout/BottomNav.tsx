import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Building2, CheckSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/contacts', icon: Users, label: 'Contacts' },
  { path: '/companies', icon: Building2, label: 'Companies' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 block md:hidden bg-white border-t border-neutral-200 shadow-top">
      <div className="flex items-center justify-around h-16 pb-safe">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path

          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                isActive
                  ? 'text-primary-500'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <Icon className={cn('h-6 w-6', isActive && 'stroke-[2.5]')} />
              <span className={cn('text-xs', isActive && 'font-semibold')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
