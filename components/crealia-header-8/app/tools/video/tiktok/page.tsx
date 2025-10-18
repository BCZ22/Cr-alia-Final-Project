"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Upload, Sparkles, TrendingUp } from "lucide-react"

export default function TikTokPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [addTrendingSound, setAddTrendingSound] = useState(true)
  const [addEffects, setAddEffects] = useState(true)
  const [addText, setAddText] = useState(true)
  const [addStickers, setAddStickers] = useState(false)
  const [processing, setProcessing] = useState(false)

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-lg" />
            <h1 className="text-4xl font-bold">TikTok Video Creator</h1>
          </div>
          <p className="text-muted-foreground">
            Create viral TikTok videos with trending sounds, effects, and templates
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Video Content</h2>
            {!videoFile ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer hover:border-primary transition-colors">
                <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                <span className="text-sm font-medium mb-1">Upload your video</span>
                <span className="text-xs text-muted-foreground">Vertical format (9:16) recommended</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="aspect-[9/16] max-h-[600px] mx-auto bg-black rounded-lg overflow-hidden">
                  <video src={URL.createObjectURL(videoFile)} controls className="w-full h-full object-cover" />
                </div>
                <Button variant="outline" size="sm" onClick={() => setVideoFile(null)}>
                  Remove Video
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">TikTok Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <div>
                    <Label>Trending Sound</Label>
                    <p className="text-xs text-muted-foreground">Add popular audio</p>
                  </div>
                </div>
                <Switch checked={addTrendingSound} onCheckedChange={setAddTrendingSound} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <div>
                    <Label>Viral Effects</Label>
                    <p className="text-xs text-muted-foreground">Trending filters</p>
                  </div>
                </div>
                <Switch checked={addEffects} onCheckedChange={setAddEffects} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Text Overlays</Label>
                  <p className="text-xs text-muted-foreground">Animated captions</p>
                </div>
                <Switch checked={addText} onCheckedChange={setAddText} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Stickers & Emojis</Label>
                  <p className="text-xs text-muted-foreground">Fun animations</p>
                </div>
                <Switch checked={addStickers} onCheckedChange={setAddStickers} />
              </div>

              <Button className="w-full" onClick={() => setProcessing(true)} disabled={!videoFile || processing}>
                {processing ? "Creating..." : "Create TikTok Video"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
