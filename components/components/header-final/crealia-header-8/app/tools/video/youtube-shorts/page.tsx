"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Youtube } from "lucide-react"

export default function YouTubeShortsPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [addCaptions, setAddCaptions] = useState(true)
  const [addThumbnail, setAddThumbnail] = useState(true)
  const [processing, setProcessing] = useState(false)

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Youtube className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-bold">YouTube Shorts Creator</h1>
          </div>
          <p className="text-muted-foreground">Create engaging YouTube Shorts optimized for maximum reach</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Video Upload</h2>
            {!videoFile ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer hover:border-primary transition-colors">
                <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                <span className="text-sm font-medium mb-1">Upload video</span>
                <span className="text-xs text-muted-foreground">Vertical format (9:16), max 60 seconds</span>
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
                  Remove
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Short Details</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input placeholder="Enter catchy title..." value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Add description and hashtags..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Auto Captions</Label>
                <Switch checked={addCaptions} onCheckedChange={setAddCaptions} />
              </div>

              <div className="flex items-center justify-between">
                <Label>Generate Thumbnail</Label>
                <Switch checked={addThumbnail} onCheckedChange={setAddThumbnail} />
              </div>

              <Button className="w-full" onClick={() => setProcessing(true)} disabled={!videoFile || processing}>
                {processing ? "Creating..." : "Create YouTube Short"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
