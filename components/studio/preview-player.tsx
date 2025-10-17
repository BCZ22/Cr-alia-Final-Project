"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Grid3x3, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"

interface PreviewSource {
  id: string
  type: "video" | "image" | "audio"
  url: string
  startTime?: number
  endTime?: number
  transform?: {
    x: number
    y: number
    scale: number
    rotation: number
  }
}

interface PreviewPlayerProps {
  sources: PreviewSource[]
  time?: number
  onTimeChange?: (time: number) => void
  onPlay?: () => void
  onPause?: () => void
  renderLowRes?: boolean
  showGrid?: boolean
  showSafeZones?: boolean
  mobileFrame?: boolean
  className?: string
}

export function PreviewPlayer({
  sources,
  time = 0,
  onTimeChange,
  onPlay,
  onPause,
  renderLowRes = true,
  showGrid = false,
  showSafeZones = false,
  mobileFrame = false,
  className,
}: PreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(time)
  const [duration, setDuration] = useState(100)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const [showGridOverlay, setShowGridOverlay] = useState(showGrid)
  const [showSafeZonesOverlay, setShowSafeZonesOverlay] = useState(showSafeZones)
  const [showMobileFrame, setShowMobileFrame] = useState(mobileFrame)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      videoRef.current?.pause()
      setIsPlaying(false)
      onPause?.()
    } else {
      videoRef.current?.play()
      setIsPlaying(true)
      onPlay?.()
    }
  }, [isPlaying, onPlay, onPause])

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime
      setCurrentTime(newTime)
      onTimeChange?.(newTime)
    }
  }, [onTimeChange])

  const handleSeek = useCallback(
    (value: number[]) => {
      const newTime = value[0]
      setCurrentTime(newTime)
      if (videoRef.current) {
        videoRef.current.currentTime = newTime
      }
      onTimeChange?.(newTime)
    },
    [onTimeChange],
  )

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100
    }
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }, [isMuted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate)
      videoRef.current.addEventListener("loadedmetadata", () => {
        setDuration(videoRef.current?.duration || 100)
      })
    }
    return () => {
      videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [handleTimeUpdate])

  const previewContent = (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {/* Video/Image Content */}
      {sources.length > 0 && sources[0].type === "video" && (
        <video
          ref={videoRef}
          src={sources[0].url}
          className="max-w-full max-h-full"
          style={{
            filter: renderLowRes ? "blur(0.5px)" : "none",
          }}
        />
      )}

      {sources.length > 0 && sources[0].type === "image" && (
        <img src={sources[0].url || "/placeholder.svg"} alt="Preview" className="max-w-full max-h-full" />
      )}

      {/* Grid Overlay */}
      {showGridOverlay && (
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="10%" height="10%" patternUnits="userSpaceOnUse">
                <path d="M 0 0 L 0 100 M 0 0 L 100 0" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Rule of thirds */}
            <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="white" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>
      )}

      {/* Safe Zones Overlay */}
      {showSafeZonesOverlay && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-[10%] border-2 border-yellow-400 opacity-50" />
          <div className="absolute inset-[5%] border-2 border-red-400 opacity-50" />
        </div>
      )}
    </div>
  )

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Preview Area */}
      <div className="flex-1 relative bg-muted/20 flex items-center justify-center p-4">
        {showMobileFrame ? (
          <div className="relative">
            {/* Mobile Frame */}
            <div className="w-[375px] h-[667px] bg-black rounded-[40px] p-3 shadow-2xl border-8 border-gray-800">
              <div className="w-full h-full rounded-[32px] overflow-hidden">{previewContent}</div>
            </div>
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-800 rounded-b-3xl" />
          </div>
        ) : (
          <div className="w-full h-full max-w-5xl">{previewContent}</div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-card border-t space-y-3">
        {/* Timeline Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-12 text-right">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration}
            step={0.1}
            onValueChange={handleSeek}
            className="flex-1"
            aria-label="Seek"
          />
          <span className="text-xs text-muted-foreground w-12">{formatTime(duration)}</span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSeek([Math.max(0, currentTime - 5)])}
              aria-label="Skip back 5 seconds"
              title="Skip back (J)"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSeek([Math.min(duration, currentTime + 5)])}
              aria-label="Skip forward 5 seconds"
              title="Skip forward (L)"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-24"
              aria-label="Volume"
            />
            <div className="w-px h-6 bg-border mx-2" />
            <Button
              variant={showGridOverlay ? "default" : "ghost"}
              size="icon"
              onClick={() => setShowGridOverlay(!showGridOverlay)}
              aria-label="Toggle grid"
              title="Toggle grid overlay"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={showMobileFrame ? "default" : "ghost"}
              size="icon"
              onClick={() => setShowMobileFrame(!showMobileFrame)}
              aria-label="Toggle mobile frame"
              title="Toggle mobile preview"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Fullscreen" title="Fullscreen (F)">
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
