"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

interface Job {
  id: string
  type: "text2image" | "enhance"
  status: "pending" | "processing" | "completed" | "failed"
  prompt?: string
  createdAt: Date
}

export default function JobQueue() {
  const jobs: Job[] = []

  const getStatusIcon = (status: Job["status"]) => {
    switch (status) {
      case "pending":
      case "processing":
        return <Loader2 className="w-4 h-4 animate-spin" />
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: Job["status"]) => {
    const variants = {
      pending: "secondary",
      processing: "default",
      completed: "outline",
      failed: "destructive",
    } as const

    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">File de tâches</h3>
      {jobs.length > 0 ? (
        <div className="space-y-2">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center gap-2 p-2 border rounded text-sm">
              {getStatusIcon(job.status)}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{job.type === "text2image" ? "Génération" : "Amélioration"}</p>
                {job.prompt && <p className="text-xs text-muted-foreground truncate">{job.prompt}</p>}
              </div>
              {getStatusBadge(job.status)}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">Aucune tâche en cours</p>
      )}
    </Card>
  )
}
