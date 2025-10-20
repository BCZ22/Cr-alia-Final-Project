import type React from "react"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div style={{ paddingTop: "72px" }}>{children}</div>
    </div>
  )
}




