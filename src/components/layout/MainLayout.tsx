import { type ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-warm-50">
      <Header />
      <Sidebar />
      {/* Main content with left margin for sidebar on desktop */}
      <main className="md:pl-64 pt-16">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8 pb-safe">
          {children}
        </div>
      </main>
    </div>
  )
}
