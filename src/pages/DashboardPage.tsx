import { Card } from '@/components/ui'
import { LayoutDashboard, Users, Building2, CheckSquare } from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    {
      name: 'Total Contacts',
      value: '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Companies',
      value: '0',
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Active Tasks',
      value: '0',
      icon: CheckSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-8 w-8 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name} hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`rounded-full p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Welcome Message */}
      <Card>
        <div className="text-center py-12">
          <LayoutDashboard className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Welcome to Simple CRM</h3>
          <p className="mt-2 text-sm text-gray-600">
            Your dashboard will display key metrics and insights as you add contacts, companies, and tasks.
          </p>
        </div>
      </Card>
    </div>
  )
}
