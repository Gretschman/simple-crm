import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Building2, CheckSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Contacts',
    href: '/',
    icon: Users,
  },
  {
    name: 'Companies',
    href: '/companies',
    icon: Building2,
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
  },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16">
      <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive
                      ? 'text-primary-600'
                      : 'text-gray-400 group-hover:text-primary-600'
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
