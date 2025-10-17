"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CustomSelectItem {
  value: string
  label: string
  description?: string
  badge?: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface CustomSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  items: CustomSelectItem[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function CustomSelect({
  value,
  onValueChange,
  items,
  placeholder = "Select...",
  className,
  disabled = false,
}: CustomSelectProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const selectedItem = items.find((item) => item.value === value)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setOpen(!open)
    } else if (e.key === "Escape") {
      setOpen(false)
      buttonRef.current?.focus()
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      if (!open) {
        setOpen(true)
      }
    }
  }

  const handleSelect = (itemValue: string) => {
    onValueChange?.(itemValue)
    setOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <div className={cn("relative inline-block w-full", className)} ref={ref}>
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="custom-select-listbox"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedItem ? (
            <>
              {selectedItem.icon && <span className="shrink-0">{selectedItem.icon}</span>}
              <span className="truncate">{selectedItem.label}</span>
              {selectedItem.badge && (
                <span className="ml-auto shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs">
                  {selectedItem.badge}
                </span>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={cn("ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          id="custom-select-listbox"
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
        >
          {items.map((item) => (
            <li
              key={item.value}
              role="option"
              aria-selected={value === item.value}
              aria-disabled={item.disabled}
              onClick={() => !item.disabled && handleSelect(item.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  !item.disabled && handleSelect(item.value)
                }
              }}
              tabIndex={0}
              className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors",
                item.disabled
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                value === item.value && "bg-accent text-accent-foreground",
              )}
            >
              <div className="flex flex-1 items-center gap-2">
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <div className="flex flex-1 flex-col">
                  <span className="font-medium">{item.label}</span>
                  {item.description && <span className="text-xs text-muted-foreground">{item.description}</span>}
                </div>
                {item.badge && (
                  <span className="ml-auto shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs">{item.badge}</span>
                )}
              </div>
              {value === item.value && <Check className="ml-2 h-4 w-4 shrink-0" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
