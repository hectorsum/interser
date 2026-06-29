import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden print:block print:h-auto print:overflow-visible" style={{ background: '#f5f3f0', fontFamily: 'var(--font-montserrat)' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto md:ml-[255px] print:ml-0 print:overflow-visible">
        {children}
      </main>
    </div>
  )
}
