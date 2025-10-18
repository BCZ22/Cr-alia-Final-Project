"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Download, Sparkles, Zap } from "lucide-react"

export default function VideoEnhancerPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [brightness, setBrightness] = useState([0])
  const [contrast, setContrast] = useState([0])
  const [saturation, setSaturation] = useState([0])
  const [sharpness, setSharpness] = useState([0])
  const [denoise, setDenoise] = useState(false)
  const [stabilization, setStabilization] = useState(false)
  const [upscale, setUpscale] = useState(false)
  const [autoEnhance, setAutoEnhance] = useState(false)
  const [processing, setProcessing] = useState(false)

  const handleProcess = async () => {
    if (!videoFile) return
    setProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 4000))
    setProcessing(false)
  }

  const handleAutoEnhance = () => {
    setBrightness([10])
    setContrast([15])
    setSaturation([20])
    setSharpness([25])
    setDenoise(true)
    setStabilization(true)
    setAutoEnhance(true)
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Video Enhancer</h1>
          <p className="text-muted-foreground">
            Enhance video quality with AI-powered tools for brightness, contrast, and more
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload & Preview */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Video Preview</h2>

            {!videoFile ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer hover:border-primary transition-colors">
                <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                <span className="text-sm font-medium mb-1">Click to upload video</span>
                <span className="text-xs text-muted-foreground">MP4, MOV, AVI up to 500MB</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-4">
                <Tabs defaultValue="original" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="original">Original</TabsTrigger>
                    <TabsTrigger value="enhanced">Enhanced</TabsTrigger>
                  </TabsList>
                  <TabsContent value="original" className="mt-4">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video src={URL.createObjectURL(videoFile)} controls className="w-full h-full" />
                    </div>
                  </TabsContent>
                  <TabsContent value="enhanced" className="mt-4">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                      <video
                        src={URL.createObjectURL(videoFile)}
                        controls
                        className="w-full h-full"
                        style={{
                          filter: `brightness(${1 + brightness[0] / 100}) contrast(${1 + contrast[0] / 100}) saturate(${1 + saturation[0] / 100})`,
                        }}
                      />
                      {autoEnhance && (
                        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI Enhanced
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

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

          {/* Enhancement Settings */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Enhancement Settings</h2>
              <Button variant="outline" size="sm" onClick={handleAutoEnhance} disabled={!videoFile}>
                <Zap className="w-4 h-4 mr-2" />
                Auto Enhance
              </Button>
            </div>

            <div className="space-y-6">
              {/* Color Adjustments */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Color Adjustments</h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Brightness</Label>
                    <span className="text-sm text-muted-foreground">
                      {brightness[0] > 0 ? "+" : ""}
                      {brightness[0]}
                    </span>
                  </div>
                  <Slider value={brightness} onValueChange={setBrightness} min={-50} max={50} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Contrast</Label>
                    <span className="text-sm text-muted-foreground">
                      {contrast[0] > 0 ? "+" : ""}
                      {contrast[0]}
                    </span>
                  </div>
                  <Slider value={contrast} onValueChange={setContrast} min={-50} max={50} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Saturation</Label>
                    <span className="text-sm text-muted-foreground">
                      {saturation[0] > 0 ? "+" : ""}
                      {saturation[0]}
                    </span>
                  </div>
                  <Slider value={saturation} onValueChange={setSaturation} min={-50} max={50} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Sharpness</Label>
                    <span className="text-sm text-muted-foreground">{sharpness[0]}</span>
                  </div>
                  <Slider value={sharpness} onValueChange={setSharpness} min={0} max={100} step={1} />
                </div>
              </div>

              {/* AI Enhancements */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm">AI Enhancements</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Noise Reduction</Label>
                    <p className="text-xs text-muted-foreground">Remove grain and artifacts</p>
                  </div>
                  <Switch checked={denoise} onCheckedChange={setDenoise} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Video Stabilization</Label>
                    <p className="text-xs text-muted-foreground">Reduce camera shake</p>
                  </div>
                  <Switch checked={stabilization} onCheckedChange={setStabilization} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Upscaling</Label>
                    <p className="text-xs text-muted-foreground">Increase resolution</p>
                  </div>
                  <Switch checked={upscale} onCheckedChange={setUpscale} />
                </div>
              </div>

              {/* Reset Button */}
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setBrightness([0])
                  setContrast([0])
                  setSaturation([0])
                  setSharpness([0])
                  setDenoise(false)
                  setStabilization(false)
                  setUpscale(false)
                  setAutoEnhance(false)
                }}
              >
                Reset All
              </Button>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1" onClick={handleProcess} disabled={!videoFile || processing}>
                  {processing ? "Enhancing..." : "Enhance Video"}
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
