"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Upload, Sparkles } from "lucide-react"

const VFX_EFFECTS = [
  { id: "particles", name: "Particles", category: "effects" },
  { id: "light-leaks", name: "Light Leaks", category: "effects" },
  { id: "lens-flare", name: "Lens Flare", category: "effects" },
  { id: "film-grain", name: "Film Grain", category: "texture" },
  { id: "vhs", name: "VHS", category: "retro" },
  { id: "glitch", name: "Glitch", category: "digital" },
]

export default function VisualFXPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [selectedEffects, setSelectedEffects] = useState<string[]>([])
  const [intensity, setIntensity] = useState([50])
  const [processing, setProcessing] = useState(false)

  const toggleEffect = (id: string) => {
    setSelectedEffects((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]))
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold">Visual FX</h1>
          </div>
          <p className="text-muted-foreground">Add professional visual effects to your videos</p>
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
            <h2 className="text-xl font-semibold mb-4">Visual Effects</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {VFX_EFFECTS.map((effect) => (
                  <button
                    key={effect.id}
                    onClick={() => toggleEffect(effect.id)}
                    className={`p-3 border-2 rounded-lg transition-colors ${
                      selectedEffects.includes(effect.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-medium text-sm">{effect.name}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Effect Intensity</Label>
                  <span className="text-sm text-muted-foreground">{intensity[0]}%</span>
                </div>
                <Slider value={intensity} onValueChange={setIntensity} min={0} max={100} step={5} />
              </div>

              <Button
                className="w-full"
                onClick={() => setProcessing(true)}
                disabled={!videoFile || selectedEffects.length === 0 || processing}
              >
                {processing ? "Applying FX..." : "Apply Visual FX"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
