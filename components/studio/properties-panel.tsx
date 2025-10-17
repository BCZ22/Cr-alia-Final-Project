"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ChevronDown, ChevronRight, Save } from "lucide-react"
import { cn } from "@/lib/utils"

interface PropertySection {
  id: string
  title: string
  collapsed?: boolean
  content: React.ReactNode
}

interface PropertiesPanelProps {
  title?: string
  sections: PropertySection[]
  onPresetSave?: (name: string) => void
  onPresetApply?: (presetId: string) => void
  presets?: Array<{ id: string; name: string }>
  className?: string
}

export function PropertiesPanel({
  title = "Properties",
  sections,
  onPresetSave,
  onPresetApply,
  presets = [],
  className,
}: PropertiesPanelProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(sections.filter((s) => s.collapsed).map((s) => s.id)),
  )

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold">{title}</h3>
      </div>

      {/* Presets */}
      {presets.length > 0 && (
        <div className="p-4 border-b space-y-2">
          <Label className="text-xs">Presets</Label>
          <div className="flex gap-2">
            <select
              className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm"
              onChange={(e) => onPresetApply?.(e.target.value)}
            >
              <option value="">Select preset...</option>
              {presets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const name = prompt("Enter preset name:")
                if (name) onPresetSave?.(name)
              }}
              aria-label="Save preset"
              title="Save current settings as preset"
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => {
          const isCollapsed = collapsedSections.has(section.id)
          return (
            <div key={section.id} className="border-b">
              <button
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection(section.id)}
                aria-expanded={!isCollapsed}
              >
                <span className="font-medium text-sm">{section.title}</span>
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {!isCollapsed && <div className="p-4 pt-0 space-y-4">{section.content}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Helper components for common property types
export function PropertySlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  unit = "",
}: {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  unit?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <span className="text-xs text-muted-foreground">
          {value}
          {unit}
        </span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(values) => onChange(values[0])} />
    </div>
  )
}

export function PropertyInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9"
      />
    </div>
  )
}
