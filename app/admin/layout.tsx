import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f5f3f0', fontFamily: 'var(--font-montserrat)' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto md:ml-[255px]">
        {children}
      </main>
    </div>
  )
}
