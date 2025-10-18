"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Plus, Scissors, Trash2, Copy, Lock, Unlock, Eye, EyeOff, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TimelineClip {
  id: string
  trackId: string
  type: "video" | "audio" | "text" | "effect"
  name: string
  startTime: number
  duration: number
  inPoint?: number
  outPoint?: number
  locked?: boolean
  muted?: boolean
  visible?: boolean
  thumbUrl?: string
  color?: string
}

export interface TimelineTrack {
  id: string
  type: "video" | "audio" | "text" | "effect"
  name: string
  clips: TimelineClip[]
  locked?: boolean
  muted?: boolean
  visible?: boolean
  height?: number
}

interface TimelineProps {
  tracks: TimelineTrack[]
  duration: number
  currentTime: number
  zoom?: number
  onClipDrop?: (clipId: string, trackId: string, time: number) => void
  onClipTrim?: (clipId: string, inPoint: number, outPoint: number) => void
  onClipSplit?: (clipId: string, time: number) => void
  onClipDelete?: (clipId: string) => void
  onTimeChange?: (time: number) => void
  onTrackAdd?: (type: TimelineTrack["type"]) => void
  onTrackToggle?: (trackId: string, property: "locked" | "muted" | "visible") => void
  className?: string
}

export function Timeline({
  tracks,
  duration,
  currentTime,
  zoom = 1,
  onClipDrop,
  onClipTrim,
  onClipSplit,
  onClipDelete,
  onTimeChange,
  onTrackAdd,
  onTrackToggle,
  className,
}: TimelineProps) {
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)

  const pixelsPerSecond = 50 * zoom
  const timelineWidth = duration * pixelsPerSecond

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const frames = Math.floor((seconds % 1) * 30)
    return `${mins}:${secs.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`
  }

  const handleTimelineClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!timelineRef.current) return
      const rect = timelineRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const time = x / pixelsPerSecond
      onTimeChange?.(Math.max(0, Math.min(duration, time)))
    },
    [pixelsPerSecond, duration, onTimeChange],
  )

  const handleClipClick = useCallback((clipId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedClipId(clipId)
  }, [])

  const handleClipDragStart = useCallback((e: React.MouseEvent, clip: TimelineClip) => {
    e.stopPropagation()
    setIsDragging(true)
    setDragStartX(e.clientX)
    setSelectedClipId(clip.id)
  }, [])

  const getTrackColor = (type: TimelineTrack["type"]) => {
    switch (type) {
      case "video":
        return "bg-blue-500/20 border-blue-500"
      case "audio":
        return "bg-green-500/20 border-green-500"
      case "text":
        return "bg-purple-500/20 border-purple-500"
      case "effect":
        return "bg-orange-500/20 border-orange-500"
      default:
        return "bg-muted border-border"
    }
  }

  return (
    <div className={cn("flex flex-col h-full bg-card", className)}>
      {/* Timeline Header */}
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onTrackAdd?.("video")} aria-label="Add video track">
            <Plus className="h-4 w-4 mr-1" />
            Video Track
          </Button>
          <Button variant="outline" size="sm" onClick={() => onTrackAdd?.("audio")} aria-label="Add audio track">
            <Plus className="h-4 w-4 mr-1" />
            Audio Track
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Zoom:</span>
          <Slider value={[zoom]} min={0.5} max={3} step={0.1} className="w-24" aria-label="Timeline zoom" />
          <span className="text-xs font-mono">{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Track Headers */}
        <div className="w-48 border-r bg-muted/20 overflow-y-auto">
          {tracks.map((track) => (
            <div key={track.id} className="h-16 border-b p-2 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{track.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{track.type}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onTrackToggle?.(track.id, "locked")}
                  aria-label={track.locked ? "Unlock track" : "Lock track"}
                >
                  {track.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onTrackToggle?.(track.id, "visible")}
                  aria-label={track.visible ? "Hide track" : "Show track"}
                >
                  {track.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
                {track.type === "audio" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onTrackToggle?.(track.id, "muted")}
                    aria-label={track.muted ? "Unmute track" : "Mute track"}
                  >
                    {track.muted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Tracks */}
        <div className="flex-1 overflow-auto" ref={timelineRef}>
          <div className="relative" style={{ width: timelineWidth, minWidth: "100%" }}>
            {/* Time Ruler */}
            <div className="h-8 border-b bg-muted/50 relative">
              {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-full border-l border-border"
                  style={{ left: i * pixelsPerSecond }}
                >
                  <span className="text-xs text-muted-foreground ml-1">{i}s</span>
                </div>
              ))}
            </div>

            {/* Tracks */}
            {tracks.map((track) => (
              <div key={track.id} className="h-16 border-b relative bg-muted/10" onClick={handleTimelineClick}>
                {track.clips.map((clip) => (
                  <div
                    key={clip.id}
                    className={cn(
                      "absolute top-1 bottom-1 rounded border-2 cursor-move overflow-hidden",
                      getTrackColor(track.type),
                      selectedClipId === clip.id && "ring-2 ring-primary",
                    )}
                    style={{
                      left: clip.startTime * pixelsPerSecond,
                      width: clip.duration * pixelsPerSecond,
                    }}
                    onClick={(e) => handleClipClick(clip.id, e)}
                    onMouseDown={(e) => handleClipDragStart(e, clip)}
                  >
                    {clip.thumbUrl && (
                      <img
                        src={clip.thumbUrl || "/placeholder.svg"}
                        alt={clip.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                      />
                    )}
                    <div className="relative p-1">
                      <p className="text-xs font-medium truncate">{clip.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-10"
              style={{ left: currentTime * pixelsPerSecond }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Clip Controls */}
      {selectedClipId && (
        <div className="p-2 border-t bg-muted/20 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Clip:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const clip = tracks.flatMap((t) => t.clips).find((c) => c.id === selectedClipId)
              if (clip) onClipSplit?.(clip.id, currentTime)
            }}
            aria-label="Split clip"
          >
            <Scissors className="h-3 w-3 mr-1" />
            Split
          </Button>
          <Button variant="outline" size="sm" aria-label="Copy clip">
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClipDelete?.(selectedClipId)
              setSelectedClipId(null)
            }}
            aria-label="Delete clip"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      )}
    </div>
  )
}
