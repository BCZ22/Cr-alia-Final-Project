'use client'

import { AppLayout } from '@/components/crealia-header-final/app-layout'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
