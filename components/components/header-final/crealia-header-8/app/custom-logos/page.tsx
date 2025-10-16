import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

export default function CustomLogosPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-6 text-balance text-3xl font-bold">Custom Logos</h1>
            <p className="text-muted-foreground">Create professional logos for your brand.</p>
          </div>
        </main>
      </div>
    </div>
  )
}
