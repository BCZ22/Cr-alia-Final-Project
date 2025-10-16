"use client"

import type React from "react"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Upload, Download } from "lucide-react"

const ASPECT_RATIOS = [
  { label: "Instagram (1:1)", value: "1:1", width: 1080, height: 1080 },
  { label: "Instagram Story (9:16)", value: "9:16", width: 1080, height: 1920 },
  { label: "YouTube (16:9)", value: "16:9", width: 1920, height: 1080 },
  { label: "TikTok (9:16)", value: "9:16", width: 1080, height: 1920 },
  { label: "Facebook (16:9)", value: "16:9", width: 1920, height: 1080 },
  { label: "Twitter (16:9)", value: "16:9", width: 1280, height: 720 },
  { label: "LinkedIn (1:1)", value: "1:1", width: 1080, height: 1080 },
  { label: "Custom", value: "custom", width: 1920, height: 1080 },
]

const QUALITY_PRESETS = [
  { label: "Low (720p)", value: "low", resolution: 720 },
  { label: "Medium (1080p)", value: "medium", resolution: 1080 },
  { label: "High (2K)", value: "high", resolution: 1440 },
  { label: "Ultra (4K)", value: "ultra", resolution: 2160 },
]

export default function VideoResizerPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [aspectRatio, setAspectRatio] = useState("16:9")
  const [quality, setQuality] = useState("medium")
  const [customWidth, setCustomWidth] = useState(1920)
  const [customHeight, setCustomHeight] = useState(1080)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [cropMode, setCropMode] = useState<"fit" | "fill" | "stretch">("fit")
  const [processing, setProcessing] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
    }
  }

  const handleResize = async () => {
    if (!videoFile) return
    setProcessing(true)
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setProcessing(false)
  }

  const selectedRatio = ASPECT_RATIOS.find((r) => r.value === aspectRatio)

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Video Resizer</h1>
          <p className="text-muted-foreground">
            Resize and optimize your videos for any platform with perfect aspect ratios
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload & Preview */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Video</h2>

            {!videoFile ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer hover:border-primary transition-colors">
                <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                <span className="text-sm font-medium mb-1">Click to upload video</span>
                <span className="text-xs text-muted-foreground">MP4, MOV, AVI up to 500MB</span>
                <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                  <video src={URL.createObjectURL(videoFile)} controls className="w-full h-full rounded-lg" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{videoFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setVideoFile(null)}>
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Resize Settings</h2>

            <div className="space-y-6">
              {/* Aspect Ratio */}
              <div className="space-y-2">
                <Label>Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASPECT_RATIOS.map((ratio) => (
                      <SelectItem key={ratio.value} value={ratio.value}>
                        {ratio.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Dimensions */}
              {aspectRatio === "custom" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Width (px)</Label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (px)</Label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
              )}

              {/* Quality */}
              <div className="space-y-2">
                <Label>Output Quality</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUALITY_PRESETS.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Crop Mode */}
              <div className="space-y-2">
                <Label>Resize Mode</Label>
                <Select value={cropMode} onValueChange={(v) => setCropMode(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fit">Fit (Add Letterbox)</SelectItem>
                    <SelectItem value="fill">Fill (Crop to Fit)</SelectItem>
                    <SelectItem value="stretch">Stretch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Maintain Aspect Ratio */}
              <div className="flex items-center justify-between">
                <Label>Maintain Aspect Ratio</Label>
                <Switch checked={maintainAspectRatio} onCheckedChange={setMaintainAspectRatio} />
              </div>

              {/* Output Info */}
              <div className="p-4 bg-muted rounded-lg space-y-1">
                <p className="text-sm font-medium">Output Dimensions</p>
                <p className="text-2xl font-bold">
                  {aspectRatio === "custom"
                    ? `${customWidth} × ${customHeight}`
                    : `${selectedRatio?.width} × ${selectedRatio?.height}`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1" onClick={handleResize} disabled={!videoFile || processing}>
                  {processing ? "Processing..." : "Resize Video"}
                </Button>
                <Button variant="outline" disabled={!videoFile || processing}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
