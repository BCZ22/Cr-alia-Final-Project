"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

export interface NativeTabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function NativeTabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
}: NativeTabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")
  const value = controlledValue !== undefined ? controlledValue : internalValue

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [controlledValue, onValueChange],
  )

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn("", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export interface NativeTabsListProps {
  children: React.ReactNode
  className?: string
}

export function NativeTabsList({ children, className }: NativeTabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  )
}

export interface NativeTabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function NativeTabsTrigger({ value, children, className }: NativeTabsTriggerProps) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("NativeTabsTrigger must be used within NativeTabs")

  const isActive = context.value === value

  return (
    <button
      type="button"
      onClick={() => context.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-background/50",
        className,
      )}
    >
      {children}
    </button>
  )
}

export interface NativeTabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function NativeTabsContent({ value, children, className }: NativeTabsContentProps) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("NativeTabsContent must be used within NativeTabs")

  if (context.value !== value) return null

  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      {children}
    </div>
  )
}
