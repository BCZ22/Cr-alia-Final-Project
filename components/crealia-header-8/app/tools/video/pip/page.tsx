"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download } from "lucide-react"

const POSITIONS = [
  { label: "Top Left", value: "top-left" },
  { label: "Top Right", value: "top-right" },
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Bottom Right", value: "bottom-right" },
  { label: "Center", value: "center" },
]

const SHAPES = [
  { label: "Rectangle", value: "rectangle" },
  { label: "Circle", value: "circle" },
  { label: "Rounded", value: "rounded" },
]

export default function PIPPage() {
  const [mainVideo, setMainVideo] = useState<File | null>(null)
  const [pipVideo, setPipVideo] = useState<File | null>(null)
  const [position, setPosition] = useState("bottom-right")
  const [size, setSize] = useState([25])
  const [shape, setShape] = useState("rounded")
  const [borderWidth, setBorderWidth] = useState([2])
  const [opacity, setOpacity] = useState([100])
  const [processing, setProcessing] = useState(false)

  const handleProcess = async () => {
    if (!mainVideo || !pipVideo) return
    setProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setProcessing(false)
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Picture-in-Picture</h1>
          <p className="text-muted-foreground">Add a secondary video overlay to create engaging PIP effects</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Main Video</h2>
              {!mainVideo ? (
                <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                  <span className="text-sm font-medium">Upload main video</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setMainVideo(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-3">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video src={URL.createObjectURL(mainVideo)} controls className="w-full h-full" />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setMainVideo(null)}>
                    Remove
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">PIP Video</h2>
              {!pipVideo ? (
                <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                  <span className="text-sm font-medium">Upload PIP video</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setPipVideo(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-3">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video src={URL.createObjectURL(pipVideo)} controls className="w-full h-full" />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setPipVideo(null)}>
                    Remove
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">PIP Settings</h2>

            <div className="space-y-6">
              {/* Position */}
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITIONS.map((pos) => (
                      <SelectItem key={pos.value} value={pos.value}>
                        {pos.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Size</Label>
                  <span className="text-sm text-muted-foreground">{size[0]}%</span>
                </div>
                <Slider value={size} onValueChange={setSize} min={10} max={50} step={1} />
              </div>

              {/* Shape */}
              <div className="space-y-2">
                <Label>Shape</Label>
                <Select value={shape} onValueChange={setShape}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SHAPES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Border Width */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Border Width</Label>
                  <span className="text-sm text-muted-foreground">{borderWidth[0]}px</span>
                </div>
                <Slider value={borderWidth} onValueChange={setBorderWidth} min={0} max={10} step={1} />
              </div>

              {/* Opacity */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Opacity</Label>
                  <span className="text-sm text-muted-foreground">{opacity[0]}%</span>
                </div>
                <Slider value={opacity} onValueChange={setOpacity} min={0} max={100} step={5} />
              </div>

              {/* Preview */}
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Preview</p>
                <div className="aspect-video bg-black rounded relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-white/50">Main Video</div>
                  <div
                    className={`absolute bg-white/20 border-white ${
                      shape === "circle" ? "rounded-full" : shape === "rounded" ? "rounded-lg" : ""
                    }`}
                    style={{
                      width: `${size[0]}%`,
                      aspectRatio: "16/9",
                      borderWidth: `${borderWidth[0]}px`,
                      opacity: opacity[0] / 100,
                      ...(position === "top-left" && { top: "5%", left: "5%" }),
                      ...(position === "top-right" && { top: "5%", right: "5%" }),
                      ...(position === "bottom-left" && { bottom: "5%", left: "5%" }),
                      ...(position === "bottom-right" && { bottom: "5%", right: "5%" }),
                      ...(position === "center" && { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }),
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-white/70 text-xs">PIP</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1" onClick={handleProcess} disabled={!mainVideo || !pipVideo || processing}>
                  {processing ? "Processing..." : "Create PIP Video"}
                </Button>
                <Button variant="outline" disabled={!mainVideo || !pipVideo || processing}>
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
