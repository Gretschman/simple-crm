import { Card, Spinner } from '@/components/ui'
import { LayoutDashboard, Users, Building2, CheckSquare } from 'lucide-react'
import { useContacts } from '@/hooks/useContacts'

export default function DashboardPage() {
  const { data: contacts, isLoading } = useContacts()

  // Get unique companies from contacts
  const uniqueCompanies = new Set(
    contacts?.filter(c => c.company).map(c => c.company)
  ).size

  const stats = [
    {
      name: 'Total Contacts',
      value: contacts?.length || 0,
      icon: Users,
      color: 'text-blue-700',
      bgColor: 'bg-blue-200',
    },
    {
      name: 'Companies',
      value: uniqueCompanies,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Active Tasks',
      value: 0,
      icon: CheckSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

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

      {/* Welcome Message or Recent Activity */}
      {contacts && contacts.length > 0 ? (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Contacts</span>
              <span className="text-sm font-medium text-gray-900">{contacts.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Unique Companies</span>
              <span className="text-sm font-medium text-gray-900">{uniqueCompanies}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Latest Contact</span>
              <span className="text-sm font-medium text-gray-900">
                {contacts[0]?.first_name} {contacts[0]?.last_name}
              </span>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-center py-12">
            <LayoutDashboard className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Welcome to Simple CRM</h3>
            <p className="mt-2 text-sm text-gray-600">
              Get started by adding your first contact. Your dashboard will display key metrics and insights.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
