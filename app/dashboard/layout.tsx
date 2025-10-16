'use client'

import { AppLayout } from '@/components/components/header-final/crealia-header-8/components/app-layout'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
