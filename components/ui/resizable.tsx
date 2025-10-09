'use client'

import { Resizable } from "re-resizable"
import * as React from "react"

import { cn } from "@/backend/lib/utils"

const ResizablePanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative w-full h-full overflow-hidden border-r",
      className
    )}
    {...props}
  />
))
ResizablePanel.displayName = "ResizablePanel"

const ResizableHandle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute w-1 h-full top-0 right-0 cursor-col-resize",
      className
    )}
    {...props}
  />
))
ResizableHandle.displayName = "ResizableHandle"

export { ResizablePanel, ResizableHandle }
