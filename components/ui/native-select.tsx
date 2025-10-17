"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface NativeSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  children: React.ReactNode
  onValueChange?: (value: string) => void
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, onValueChange, onChange, ...props }, ref) => {
    React.useEffect(() => {
      console.log("[v0] NativeSelect mounted with onValueChange:", !!onValueChange)
    }, [onValueChange])

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log("[v0] NativeSelect onChange triggered, value:", e.target.value)
        onChange?.(e)
        onValueChange?.(e.target.value)
      },
      [onChange, onValueChange],
    )

    return (
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onChange={handleChange}
        {...props}
      >
        {children}
      </select>
    )
  },
)
NativeSelect.displayName = "NativeSelect"

export interface NativeSelectItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode
}

export const NativeSelectItem = React.forwardRef<HTMLOptionElement, NativeSelectItemProps>(
  ({ className, children, ...props }, ref) => {
    const textContent = React.useMemo(() => {
      const flattenToText = (node: React.ReactNode): string => {
        if (typeof node === "string" || typeof node === "number") {
          return String(node)
        }
        if (React.isValidElement(node) && node.props.children) {
          return flattenToText(node.props.children)
        }
        if (Array.isArray(node)) {
          return node.map(flattenToText).join(" ")
        }
        return ""
      }
      const extracted = flattenToText(children)
      console.log("[v0] NativeSelectItem extracting text from:", children, "result:", extracted)
      return extracted
    }, [children])

    return (
      <option ref={ref} className={cn("", className)} {...props}>
        {textContent}
      </option>
    )
  },
)
NativeSelectItem.displayName = "NativeSelectItem"
