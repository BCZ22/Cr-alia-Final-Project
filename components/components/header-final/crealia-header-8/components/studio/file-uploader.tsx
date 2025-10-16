"use client"

import type React from "react"

import { useCallback, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Link2, Cloud, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface UploadedFile {
  id: string
  filename: string
  mime: string
  size: number
  duration?: number
  width?: number
  height?: number
  thumbUrl?: string
  url: string
}

interface FileUploaderProps {
  acceptedFormats?: string[]
  maxFileSize?: number // in bytes
  multiple?: boolean
  onUploadStart?: (files: File[]) => void
  onUploadProgress?: (progress: number, fileId: string) => void
  onUploadComplete?: (files: UploadedFile[]) => void
  onError?: (error: string) => void
  className?: string
}

export function FileUploader({
  acceptedFormats = ["video/*", "image/*", "audio/*"],
  maxFileSize = 500 * 1024 * 1024, // 500MB default
  multiple = true,
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  onError,
  className,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxFileSize) {
        return `File ${file.name} exceeds maximum size of ${Math.round(maxFileSize / 1024 / 1024)}MB`
      }

      const fileType = file.type
      const isAccepted = acceptedFormats.some((format) => {
        if (format.endsWith("/*")) {
          const baseType = format.split("/")[0]
          return fileType.startsWith(baseType + "/")
        }
        return fileType === format
      })

      if (!isAccepted) {
        return `File type ${fileType} is not accepted`
      }

      return null
    },
    [acceptedFormats, maxFileSize],
  )

  const processFiles = useCallback(
    async (files: File[]) => {
      const validFiles: File[] = []

      for (const file of files) {
        const error = validateFile(file)
        if (error) {
          onError?.(error)
          continue
        }
        validFiles.push(file)
      }

      if (validFiles.length === 0) return

      setIsUploading(true)
      onUploadStart?.(validFiles)

      try {
        // Simulate upload with progress
        const uploadedFiles: UploadedFile[] = []

        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i]
          const fileId = `file_${Date.now()}_${i}`

          // Simulate progress
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise((resolve) => setTimeout(resolve, 50))
            setUploadProgress(progress)
            onUploadProgress?.(progress, fileId)
          }

          // Create object URL for preview
          const url = URL.createObjectURL(file)

          // Extract metadata
          const uploadedFile: UploadedFile = {
            id: fileId,
            filename: file.name,
            mime: file.type,
            size: file.size,
            url,
            thumbUrl: file.type.startsWith("image/") ? url : undefined,
          }

          // For video files, extract duration and dimensions
          if (file.type.startsWith("video/")) {
            const video = document.createElement("video")
            video.preload = "metadata"
            video.src = url

            await new Promise<void>((resolve) => {
              video.onloadedmetadata = () => {
                uploadedFile.duration = video.duration
                uploadedFile.width = video.videoWidth
                uploadedFile.height = video.videoHeight
                resolve()
              }
            })
          }

          // For image files, extract dimensions
          if (file.type.startsWith("image/")) {
            const img = new Image()
            img.src = url

            await new Promise<void>((resolve) => {
              img.onload = () => {
                uploadedFile.width = img.width
                uploadedFile.height = img.height
                resolve()
              }
            })
          }

          uploadedFiles.push(uploadedFile)
        }

        onUploadComplete?.(uploadedFiles)
      } catch (error) {
        onError?.(error instanceof Error ? error.message : "Upload failed")
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    },
    [validateFile, onUploadStart, onUploadProgress, onUploadComplete, onError],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      processFiles(files)
    },
    [processFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : []
      processFiles(files)
    },
    [processFiles],
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items
      const files: File[] = []

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.kind === "file") {
          const file = item.getAsFile()
          if (file) files.push(file)
        }
      }

      if (files.length > 0) {
        processFiles(files)
      }
    },
    [processFiles],
  )

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 transition-colors",
        isDragging && "border-primary bg-primary/5",
        !isDragging && "border-border",
        className,
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onPaste={handlePaste}
      tabIndex={0}
      role="button"
      aria-label="Upload files"
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptedFormats.join(",")}
        multiple={multiple}
        onChange={handleFileSelect}
      />

      <div className="flex flex-col items-center gap-4 text-center">
        {isUploading ? (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Uploading...</p>
              <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
            </div>
          </>
        ) : (
          <>
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Drag and drop files here, or click to browse</p>
              <p className="text-xs text-muted-foreground">You can also paste from clipboard (Ctrl+V)</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
              <Button variant="outline" size="sm">
                <Link2 className="h-4 w-4 mr-2" />
                From URL
              </Button>
              <Button variant="outline" size="sm">
                <Cloud className="h-4 w-4 mr-2" />
                Cloud Storage
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">Max file size: {Math.round(maxFileSize / 1024 / 1024)}MB</p>
          </>
        )}
      </div>
    </div>
  )
}
