import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-gray-900">Page not found</h2>
      <p className="mt-2 max-w-md text-gray-600">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button onClick={() => navigate('/')} className="mt-8">
        <Home className="h-5 w-5" />
        Go to Homepage
      </Button>
    </div>
  )
}
