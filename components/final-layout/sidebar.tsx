"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ImageIcon,
  SparklesIcon,
  FileImageIcon,
  VideoIcon,
  PaletteIcon,
  LogOutIcon as LogoIcon,
  LayoutGridIcon,
} from "lucide-react"

const tools = [
  {
    name: "Text to Image",
    href: "/text-to-image",
    icon: ImageIcon,
  },
  {
    name: "Image Enhancer",
    href: "/image-enhancer",
    icon: SparklesIcon,
  },
  {
    name: "Cover Images",
    href: "/cover-images",
    icon: FileImageIcon,
  },
  {
    name: "YouTube Thumbnails",
    href: "/youtube-thumbnails",
    icon: VideoIcon,
  },
  {
    name: "AI Illustrations",
    href: "/ai-illustrations",
    icon: PaletteIcon,
  },
  {
    name: "Custom Logos",
    href: "/custom-logos",
    icon: LogoIcon,
  },
  {
    name: "Social Banners",
    href: "/social-banners",
    icon: LayoutGridIcon,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-muted/10 p-4">
      <nav className="space-y-2">
        <div className="mb-4">
          <h2 className="mb-2 px-4 text-sm font-semibold text-muted-foreground">Outils de création</h2>
        </div>
        {tools.map((tool) => {
          const Icon = tool.icon
          const isActive = pathname === tool.href
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {tool.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
