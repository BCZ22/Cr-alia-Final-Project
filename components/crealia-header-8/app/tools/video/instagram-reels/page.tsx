"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Download, Instagram, Music, Type, Sparkles } from "lucide-react"

const TEMPLATES = [
  { id: "modern", name: "Modern Minimal", style: "Clean and professional" },
  { id: "vibrant", name: "Vibrant Pop", style: "Bold colors and energy" },
  { id: "elegant", name: "Elegant", style: "Sophisticated and refined" },
  { id: "playful", name: "Playful", style: "Fun and engaging" },
]

const TRANSITIONS = [
  { id: "fade", name: "Fade" },
  { id: "slide", name: "Slide" },
  { id: "zoom", name: "Zoom" },
  { id: "spin", name: "Spin" },
]

export default function InstagramReelsPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [template, setTemplate] = useState("modern")
  const [addMusic, setAddMusic] = useState(true)
  const [addCaptions, setAddCaptions] = useState(true)
  const [addHashtags, setAddHashtags] = useState(true)
  const [transition, setTransition] = useState("fade")
  const [autoOptimize, setAutoOptimize] = useState(true)
  const [processing, setProcessing] = useState(false)

  const handleProcess = async () => {
    if (!videoFile) return
    setProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setProcessing(false)
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Instagram className="w-8 h-8 text-pink-500" />
            <h1 className="text-4xl font-bold">Instagram Reels Creator</h1>
          </div>
          <p className="text-muted-foreground">Create engaging Instagram Reels with templates, music, and captions</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload & Preview */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Video Content</h2>

            {!videoFile ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer hover:border-primary transition-colors">
                <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                <span className="text-sm font-medium mb-1">Click to upload video</span>
                <span className="text-xs text-muted-foreground">Vertical video (9:16) recommended</span>
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

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{videoFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setVideoFile(null)}>
                    Remove
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Format</p>
                    <p className="font-semibold">9:16</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-semibold">0:30</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Quality</p>
                    <p className="font-semibold">1080p</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Reel Settings</h2>

            <Tabs defaultValue="template" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="template">Template</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="effects">Effects</TabsTrigger>
              </TabsList>

              <TabsContent value="template" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Choose Template</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTemplate(t.id)}
                        className={`p-4 border-2 rounded-lg text-left transition-colors ${
                          template === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="font-medium mb-1">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.style}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Optimize</Label>
                    <p className="text-xs text-muted-foreground">Optimize for Instagram</p>
                  </div>
                  <Switch checked={autoOptimize} onCheckedChange={setAutoOptimize} />
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    <div>
                      <Label>Add Music</Label>
                      <p className="text-xs text-muted-foreground">Trending audio tracks</p>
                    </div>
                  </div>
                  <Switch checked={addMusic} onCheckedChange={setAddMusic} />
                </div>

                {addMusic && (
                  <div className="ml-6 space-y-2">
                    <Label>Music Track</Label>
                    <Select defaultValue="trending1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trending1">Trending Track 1</SelectItem>
                        <SelectItem value="trending2">Trending Track 2</SelectItem>
                        <SelectItem value="trending3">Trending Track 3</SelectItem>
                        <SelectItem value="upload">Upload Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    <div>
                      <Label>Auto Captions</Label>
                      <p className="text-xs text-muted-foreground">AI-generated subtitles</p>
                    </div>
                  </div>
                  <Switch checked={addCaptions} onCheckedChange={setAddCaptions} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <div>
                      <Label>Add Hashtags</Label>
                      <p className="text-xs text-muted-foreground">Trending hashtags</p>
                    </div>
                  </div>
                  <Switch checked={addHashtags} onCheckedChange={setAddHashtags} />
                </div>
              </TabsContent>

              <TabsContent value="effects" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Transition Style</Label>
                  <Select value={transition} onValueChange={setTransition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSITIONS.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Active Effects</p>
                  <div className="flex flex-wrap gap-2">
                    {addMusic && <span className="px-2 py-1 bg-background rounded text-xs">Music</span>}
                    {addCaptions && <span className="px-2 py-1 bg-background rounded text-xs">Captions</span>}
                    {addHashtags && <span className="px-2 py-1 bg-background rounded text-xs">Hashtags</span>}
                    <span className="px-2 py-1 bg-background rounded text-xs">{transition} Transition</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex gap-3">
              <Button className="flex-1" onClick={handleProcess} disabled={!videoFile || processing}>
                {processing ? "Creating Reel..." : "Create Reel"}
              </Button>
              <Button variant="outline" disabled={!videoFile || processing}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
