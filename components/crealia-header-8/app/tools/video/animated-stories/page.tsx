"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Sparkles, Play } from "lucide-react"

const ANIMATION_STYLES = [
  { id: "kinetic", name: "Kinetic Typography", description: "Dynamic text animations" },
  { id: "motion", name: "Motion Graphics", description: "Smooth transitions" },
  { id: "minimal", name: "Minimal", description: "Clean and simple" },
  { id: "energetic", name: "Energetic", description: "Fast-paced and bold" },
]

export default function AnimatedStoriesPage() {
  const [text, setText] = useState("")
  const [style, setStyle] = useState("kinetic")
  const [images, setImages] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold">Animated Stories</h1>
          </div>
          <p className="text-muted-foreground">
            Create engaging animated stories with text, images, and motion graphics
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Story Content</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Story Text</Label>
                <Textarea
                  placeholder="Enter your story text..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Add Images (Optional)</Label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <span className="text-sm">Upload images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImages(Array.from(e.target.files || []))}
                    className="hidden"
                  />
                </label>
                {images.length > 0 && <p className="text-sm text-muted-foreground">{images.length} images selected</p>}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Animation Style</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {ANIMATION_STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      style === s.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-medium mb-1">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </button>
                ))}
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Preview</p>
                <div className="aspect-[9/16] bg-black rounded flex items-center justify-center">
                  <Play className="w-12 h-12 text-white/50" />
                </div>
              </div>

              <Button className="w-full" onClick={() => setProcessing(true)} disabled={!text || processing}>
                {processing ? "Creating..." : "Create Animated Story"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
