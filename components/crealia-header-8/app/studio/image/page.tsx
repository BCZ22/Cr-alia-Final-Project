"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Wand2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const TextToImageTool = dynamic(() => import("@/components/image-studio/text-to-image-tool"), { ssr: false })
const EnhancerTool = dynamic(() => import("@/components/image-studio/enhancer-tool"), { ssr: false })

type ActiveTool = "text2image" | "enhancer" | null

export default function ImageStudioPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [activeTool, setActiveTool] = useState<ActiveTool>(null)

  useEffect(() => {
    setIsMounted(true)
    console.log("[v0] ImageStudioPage mounted")
  }, [])

  useEffect(() => {
    console.log("🧭 Active tool:", activeTool)
  }, [activeTool])

  if (!isMounted) return null

  console.log("[v0] ImageStudioPage - activeTool:", activeTool)

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          [data-tool] {
            opacity: 1 !important;
            visibility: visible !important;
            position: relative !important;
          }
          .image-module-container {
            position: relative;
            z-index: 5;
          }
        `,
        }}
      />

      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-neutral-100">Image Studio</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r border-neutral-800 bg-neutral-900/30 p-6 overflow-y-auto">
          <div className="space-y-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                id="btn-text2image"
                aria-label="Ouvrir Text to Image"
                className={`w-full justify-start rounded-xl font-medium transition-all ${
                  activeTool === "text2image"
                    ? "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white shadow-lg shadow-purple-500/20"
                    : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-neutral-100"
                }`}
                onClick={() => {
                  console.log("[v0] Button clicked: text2image")
                  setActiveTool("text2image")
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Texte → Image
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                id="btn-enhancer"
                aria-label="Ouvrir Image Enhancer"
                className={`w-full justify-start rounded-xl font-medium transition-all ${
                  activeTool === "enhancer"
                    ? "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white shadow-lg shadow-purple-500/20"
                    : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-neutral-100"
                }`}
                onClick={() => {
                  console.log("[v0] Button clicked: enhancer")
                  setActiveTool("enhancer")
                }}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Améliorateur d'images
              </Button>
            </motion.div>
          </div>

          <div className="mt-8 p-4 bg-neutral-800/50 rounded-2xl border border-neutral-700">
            <h3 className="font-semibold mb-2 text-sm text-neutral-100">Astuce</h3>
            <p className="text-xs text-neutral-400">
              Sélectionnez un outil dans la liste ci-dessus pour commencer à créer vos images.
            </p>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-900 to-neutral-950 image-module-container">
          <div className="relative z-5 flex flex-col items-center justify-start w-full h-full p-8">
            <div
              data-tool="textToImage"
              style={{
                display: activeTool === "text2image" ? "block" : "none",
                width: "100%",
              }}
            >
              <TextToImageTool />
            </div>

            <div
              data-tool="enhancer"
              style={{
                display: activeTool === "enhancer" ? "block" : "none",
                width: "100%",
              }}
            >
              <EnhancerTool />
            </div>

            {!activeTool && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center h-full"
              >
                <Card className="p-12 text-center max-w-md bg-neutral-900 border-neutral-800 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-neutral-100">Bienvenue dans Image Studio</h2>
                  <p className="text-neutral-400 mb-6">
                    Sélectionnez un outil dans la barre latérale pour commencer à créer vos images avec l'IA.
                  </p>
                  <div className="flex flex-col gap-2">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        onClick={() => setActiveTool("text2image")}
                        className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white hover:opacity-90 rounded-xl"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Texte → Image
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        onClick={() => setActiveTool("enhancer")}
                        variant="outline"
                        className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border-neutral-700 rounded-xl"
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        Améliorateur
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
