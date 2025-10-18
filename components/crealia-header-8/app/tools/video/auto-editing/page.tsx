"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Upload, Wand2 } from "lucide-react"

const EDITING_STYLES = [
  { id: "dynamic", name: "Dynamic", description: "Fast cuts and energy" },
  { id: "smooth", name: "Smooth", description: "Flowing transitions" },
  { id: "cinematic", name: "Cinematic", description: "Professional look" },
  { id: "vlog", name: "Vlog Style", description: "Personal and casual" },
]

export default function AutoEditingPage() {
  const [videoFiles, setVideoFiles] = useState<File[]>([])
  const [style, setStyle] = useState("dynamic")
  const [removeSilence, setRemoveSilence] = useState(true)
  const [addMusic, setAddMusic] = useState(true)
  const [addTransitions, setAddTransitions] = useState(true)
  const [processing, setProcessing] = useState(false)

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Wand2 className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold">AI Auto Editing</h1>
          </div>
          <p className="text-muted-foreground">
            Let AI automatically edit your videos with smart cuts, transitions, and effects
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Clips</h2>
            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer hover:border-primary transition-colors">
              <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
              <span className="text-sm font-medium mb-1">Upload video clips</span>
              <span className="text-xs text-muted-foreground">Multiple files supported</span>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => setVideoFiles(Array.from(e.target.files || []))}
                className="hidden"
              />
            </label>
            {videoFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">{videoFiles.length} clips uploaded</p>
                <div className="space-y-2">
                  {videoFiles.map((file, i) => (
                    <div key={i} className="p-2 bg-muted rounded text-sm">
                      {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Editing Settings</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Editing Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EDITING_STYLES.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} - {s.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Remove Silence</Label>
                <Switch checked={removeSilence} onCheckedChange={setRemoveSilence} />
              </div>

              <div className="flex items-center justify-between">
                <Label>Add Background Music</Label>
                <Switch checked={addMusic} onCheckedChange={setAddMusic} />
              </div>

              <div className="flex items-center justify-between">
                <Label>Add Transitions</Label>
                <Switch checked={addTransitions} onCheckedChange={setAddTransitions} />
              </div>

              <Button
                className="w-full"
                onClick={() => setProcessing(true)}
                disabled={videoFiles.length === 0 || processing}
              >
                {processing ? "Auto Editing..." : "Start Auto Edit"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
