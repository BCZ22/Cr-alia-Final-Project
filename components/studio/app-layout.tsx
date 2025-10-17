"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Undo2, Redo2, Save, Download, Settings, Bell, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  sidebar: React.ReactNode
  topbar?: React.ReactNode
  preview: React.ReactNode
  properties: React.ReactNode
  timeline: React.ReactNode
  onExport?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onSave?: () => void
  currentProject?: {
    id: string
    name: string
    modified: boolean
  }
}

export function AppLayout({
  sidebar,
  topbar,
  preview,
  properties,
  timeline,
  onExport,
  onUndo,
  onRedo,
  onSave,
  currentProject,
}: AppLayoutProps) {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string
      type: "info" | "success" | "warning" | "error"
      message: string
    }>
  >([])

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Topbar */}
      <div className="h-14 border-b flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">
            {currentProject?.name || "Untitled Project"}
            {currentProject?.modified && <span className="text-muted-foreground ml-2">•</span>}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onUndo} aria-label="Undo" title="Undo (Ctrl+Z)">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onRedo} aria-label="Redo" title="Redo (Ctrl+Shift+Z)">
            <Redo2 className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button variant="ghost" size="icon" onClick={onSave} aria-label="Save" title="Save (Ctrl+S)">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="default" size="sm" onClick={onExport} aria-label="Export" title="Export (Ctrl+E)">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Custom Topbar */}
      {topbar && <div className="border-b bg-card">{topbar}</div>}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r bg-card overflow-y-auto">{sidebar}</div>

        {/* Center: Preview + Properties */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            {/* Preview Area */}
            <div className="flex-1 overflow-auto bg-muted/20">{preview}</div>

            {/* Properties Panel */}
            <div className="w-80 border-l bg-card overflow-y-auto">{properties}</div>
          </div>

          {/* Timeline */}
          <div className="h-64 border-t bg-card">{timeline}</div>
        </div>
      </div>

      {/* Notification Center */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                "p-4 rounded-lg shadow-lg flex items-start gap-3 min-w-[300px] max-w-[400px]",
                notif.type === "error" && "bg-destructive text-destructive-foreground",
                notif.type === "success" && "bg-green-600 text-white",
                notif.type === "warning" && "bg-yellow-600 text-white",
                notif.type === "info" && "bg-blue-600 text-white",
              )}
            >
              <p className="flex-1 text-sm">{notif.message}</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 -mt-1"
                onClick={() => dismissNotification(notif.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
