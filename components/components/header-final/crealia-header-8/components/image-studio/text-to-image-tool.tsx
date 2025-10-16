"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Download, Sparkles, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function TextToImageTool() {
  useEffect(() => {
    console.log("[v0] TextToImageTool mounted in DOM")
  }, [])

  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("stable-imagery-v1")
  const [size, setSize] = useState("1024x1024")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    if (!prompt.trim()) {
      alert("Veuillez entrer un prompt")
      return
    }

    setIsGenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/text-to-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model, size }),
      })

      if (!res.ok) {
        throw new Error("Erreur lors de la génération")
      }

      const data = await res.json()
      setGeneratedImages([data.url])
    } catch (error) {
      console.error("Generation error:", error)
      setError("⚠️ Une erreur est survenue lors de la génération")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-neutral-100">Texte → Image</h2>
        <p className="text-neutral-400">Générez des images à partir de descriptions textuelles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4 lg:col-span-1 bg-neutral-900 border-neutral-800 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <div>
            <Label htmlFor="t2i-prompt" className="text-neutral-100 font-medium">
              Prompt
            </Label>
            <Textarea
              id="t2i-prompt"
              placeholder="Décrivez l'image que vous souhaitez générer..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="mt-2 bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500 rounded-xl focus:ring-purple-500"
            />
          </div>

          <div>
            <Label htmlFor="t2i-model" className="text-neutral-100 font-medium">
              Modèle
            </Label>
            <select
              id="t2i-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 mt-2"
            >
              <option value="stable-imagery-v1">Stable Imagery v1</option>
              <option value="fast-lite">Fast Lite</option>
              <option value="artistic">Artistic</option>
            </select>
          </div>

          <div>
            <Label htmlFor="t2i-size" className="text-neutral-100 font-medium">
              Taille
            </Label>
            <select
              id="t2i-size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 mt-2"
            >
              <option value="512x512">512x512</option>
              <option value="1024x1024">1024x1024</option>
              <option value="1024x1792">1024x1792 (Portrait)</option>
              <option value="1792x1024">1792x1024 (Paysage)</option>
            </select>
          </div>

          <div className="space-y-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => setPrompt("A colorful modern workspace")}
                variant="outline"
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border-neutral-700 rounded-xl"
              >
                Preset: Workspace
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => setPrompt("A serene mountain landscape")}
                variant="outline"
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border-neutral-700 rounded-xl"
              >
                Preset: Paysage
              </Button>
            </motion.div>
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={generate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white hover:opacity-90 rounded-xl disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span className="animate-pulse">Génération...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer
                </>
              )}
            </Button>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}
        </Card>

        <Card className="p-6 lg:col-span-2 bg-neutral-900 border-neutral-800 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <h3 className="font-semibold mb-4 text-neutral-100">Aperçu</h3>
          {generatedImages.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              {generatedImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`Generated ${idx}`}
                    className="w-full rounded-xl border border-neutral-700"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-neutral-700 rounded-xl bg-neutral-800/30">
              <p className="text-neutral-500">Les images générées apparaîtront ici</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
