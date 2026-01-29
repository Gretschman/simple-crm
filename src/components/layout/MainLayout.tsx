import { type ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-primary-100">
      <Header />
      <Sidebar />
      {/* Main content with left margin for sidebar on desktop */}
      <main className="md:pl-64 pt-18 pb-20 md:pb-6">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8 pb-safe">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
