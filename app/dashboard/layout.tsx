'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Home,
  Package2,
  Settings,
  PanelLeft,
  Search,
  Users2,
  LineChart,
  Package,
} from 'lucide-react'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { CrealiaLogo } from '@/crealia-logo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()

  return (
    <SidebarProvider>
      <div className="app-layout">
        <aside className="app-sidebar">
          <Sidebar>
            <SidebarHeader>
              <CrealiaLogo />
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <Link href="/dashboard">
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <Package className="h-4 w-4" />
                      Projets
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <LineChart className="h-4 w-4" />
                      Analytics
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <Users2 className="h-4 w-4" />
                      Communauté
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/account">
                      <Settings className="h-4 w-4" />
                      Paramètres
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
        </aside>

        <header className="app-header flex items-center gap-4 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger className="md:hidden" />

          <div className="w-full flex-1">
            {/* Vous pouvez ajouter un fil d'ariane ou un titre de page ici */}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    width={36}
                    height={36}
                    alt="Avatar"
                  />
                ) : (
                  <Users2 className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Paramètres</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="app-main">{children}</main>
      </div>
    </SidebarProvider>
  )
}
