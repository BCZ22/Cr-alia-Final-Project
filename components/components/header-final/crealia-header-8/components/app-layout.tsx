import { CrealiaLogo } from "./crealia-logo"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { ThemeProvider } from "./theme-provider"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}
