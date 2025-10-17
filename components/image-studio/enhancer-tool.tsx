"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, Download, Wand2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function EnhancerTool() {
  useEffect(() => {
    console.log("[v0] EnhancerTool mounted in DOM")
  }, [])

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [strength, setStrength] = useState(0.5)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null
    setFile(selectedFile)
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      setEnhancedUrl(null)
    }
  }

  const enhance = async () => {
    if (!file) {
      alert("Veuillez d'abord uploader une image")
      return
    }

    setIsEnhancing(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("strength", strength.toString())

      const res = await fetch("/api/enhance-image", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Erreur lors de l'amélioration")
      }

      const data = await res.json()
      setEnhancedUrl(data.url)
    } catch (error) {
      console.error("Enhancement error:", error)
      setError("⚠️ Une erreur est survenue lors de l'amélioration")
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-neutral-100">Améliorateur d'images</h2>
        <p className="text-neutral-400">Améliorez la qualité et les détails de vos images</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4 lg:col-span-1 bg-neutral-900 border-neutral-800 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <div>
            <Label htmlFor="enhancer-upload" className="text-neutral-100 font-medium">
              Upload Image
            </Label>
            <input id="enhancer-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="w-full mt-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border-neutral-700 rounded-xl"
                onClick={() => document.getElementById("enhancer-upload")?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choisir une image
              </Button>
            </motion.div>
            {file && <p className="text-sm text-neutral-400 mt-2">{file.name}</p>}
          </div>

          <div>
            <Label htmlFor="enhancer-strength" className="text-neutral-100 font-medium">
              Intensité: {Math.round(strength * 100)}%
            </Label>
            <input
              id="enhancer-strength"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={strength}
              onChange={(e) => setStrength(Number.parseFloat(e.target.value))}
              className="w-full mt-2 accent-purple-500"
            />
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={enhance}
              disabled={isEnhancing || !file}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white hover:opacity-90 rounded-xl disabled:opacity-50"
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span className="animate-pulse">Amélioration...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Améliorer
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-400 mb-2">Avant</p>
              {previewUrl ? (
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={previewUrl || "/placeholder.svg"}
                  alt="Original"
                  className="w-full rounded-xl border border-neutral-700"
                />
              ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-neutral-700 rounded-xl bg-neutral-800/30">
                  <p className="text-neutral-500 text-sm">Image originale</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-neutral-400 mb-2">Après</p>
              {enhancedUrl ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <img
                    src={enhancedUrl || "/placeholder.svg"}
                    alt="Enhanced"
                    className="w-full rounded-xl border border-neutral-700"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-neutral-700 rounded-xl bg-neutral-800/30">
                  <p className="text-neutral-500 text-sm">Image améliorée</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
