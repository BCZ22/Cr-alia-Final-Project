"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Upload, Mic, Download } from "lucide-react"

export function PodcastEditorInterface() {
  const [audioFiles, setAudioFiles] = useState<File[]>([])
  const [removeFillers, setRemoveFillers] = useState(true)
  const [removeSilence, setRemoveSilence] = useState(true)
  const [enhanceAudio, setEnhanceAudio] = useState(true)
  const [processing, setProcessing] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const audioFiles = files.filter((f) => f.type.startsWith("audio/"))
    setAudioFiles((prev) => [...prev, ...audioFiles])
  }

  const removeFile = (index: number) => {
    setAudioFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleProcess = async () => {
    setProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 4000))
    setProcessing(false)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Fichiers Audio</h2>

        <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:border-primary transition-colors mb-4">
          <Mic className="w-10 h-10 mb-3 text-muted-foreground" />
          <span className="text-sm font-medium mb-1">Ajouter des fichiers audio</span>
          <span className="text-xs text-muted-foreground">MP3, WAV, M4A</span>
          <input type="file" accept="audio/*" multiple onChange={handleFileUpload} className="hidden" />
        </label>

        {audioFiles.length > 0 && (
          <div className="space-y-2">
            <Label>Fichiers Ajoutés ({audioFiles.length})</Label>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {audioFiles.map((file, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      ×
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Options d'Édition</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Supprimer les Mots de Remplissage</Label>
              <p className="text-xs text-muted-foreground">Enlever "euh", "hmm", etc.</p>
            </div>
            <Switch checked={removeFillers} onCheckedChange={setRemoveFillers} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Supprimer les Silences</Label>
              <p className="text-xs text-muted-foreground">Réduire les pauses longues</p>
            </div>
            <Switch checked={removeSilence} onCheckedChange={setRemoveSilence} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Améliorer l'Audio</Label>
              <p className="text-xs text-muted-foreground">Réduction du bruit et égalisation</p>
            </div>
            <Switch checked={enhanceAudio} onCheckedChange={setEnhanceAudio} />
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label>Intro/Outro</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Intro
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Outro
              </Button>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Fichiers audio:</span>
              <Badge>{audioFiles.length}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Durée estimée:</span>
              <span className="font-medium">~{audioFiles.length * 5} min</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" onClick={handleProcess} disabled={audioFiles.length === 0 || processing}>
              {processing ? "Traitement..." : "Éditer Podcast"}
            </Button>
            <Button variant="outline" disabled={audioFiles.length === 0 || processing}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
