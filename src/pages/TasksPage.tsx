import { Card } from '@/components/ui'
import { CheckSquare } from 'lucide-react'

export default function TasksPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckSquare className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        </div>
      </div>

      {/* Empty State */}
      <Card>
        <div className="text-center py-12">
          <CheckSquare className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Tasks feature coming soon</h3>
          <p className="mt-2 text-sm text-gray-600">
            Track follow-ups, meetings, and action items for your contacts and deals.
          </p>
        </div>
      </Card>
    </div>
  )
}
