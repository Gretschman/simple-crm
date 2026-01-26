import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from '@/lib/query-client'
import { MainLayout } from '@/components/layout'
import { ContactsPage, ContactDetailPage, NotFoundPage } from '@/pages'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<ContactsPage />} />
            <Route path="/contacts/:id" element={<ContactDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
          },
          success: {
            iconTheme: {
              primary: '#2563eb',
              secondary: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  )
}

export default App
