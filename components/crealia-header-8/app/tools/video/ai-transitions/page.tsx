"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Upload, Zap } from "lucide-react"

const TRANSITIONS = [
  { id: "morph", name: "AI Morph", preview: "Smooth morphing between scenes" },
  { id: "zoom", name: "Zoom Blur", preview: "Dynamic zoom transition" },
  { id: "glitch", name: "Glitch", preview: "Digital glitch effect" },
  { id: "wipe", name: "Creative Wipe", preview: "Artistic wipe transition" },
  { id: "dissolve", name: "AI Dissolve", preview: "Intelligent dissolve" },
  { id: "spin", name: "3D Spin", preview: "3D rotation effect" },
]

export default function AITransitionsPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [selectedTransitions, setSelectedTransitions] = useState<string[]>(["morph"])
  const [duration, setDuration] = useState([500])
  const [processing, setProcessing] = useState(false)

  const toggleTransition = (id: string) => {
    setSelectedTransitions((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold">AI Transitions</h1>
          </div>
          <p className="text-muted-foreground">Add stunning AI-powered transitions between video clips</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Video Upload</h2>
            {!videoFile ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer hover:border-primary transition-colors">
                <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                <span className="text-sm font-medium">Upload video</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video src={URL.createObjectURL(videoFile)} controls className="w-full h-full" />
                </div>
                <Button variant="outline" size="sm" onClick={() => setVideoFile(null)}>
                  Remove
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Transition Effects</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {TRANSITIONS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggleTransition(t.id)}
                    className={`p-3 border-2 rounded-lg text-left transition-colors ${
                      selectedTransitions.includes(t.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-medium text-sm mb-1">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.preview}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Transition Duration</Label>
                  <span className="text-sm text-muted-foreground">{duration[0]}ms</span>
                </div>
                <Slider value={duration} onValueChange={setDuration} min={200} max={2000} step={100} />
              </div>

              <Button className="w-full" onClick={() => setProcessing(true)} disabled={!videoFile || processing}>
                {processing ? "Applying..." : "Apply Transitions"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
