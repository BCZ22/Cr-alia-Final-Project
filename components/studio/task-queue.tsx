"use client"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, CheckCircle2, AlertCircle, Loader2, Download } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Task {
  id: string
  type: string
  status: "pending" | "processing" | "completed" | "failed"
  progress: number
  eta?: number
  output?: Array<{ url: string; filename: string }>
  error?: string
  createdAt: number
}

interface TaskQueueProps {
  tasks: Task[]
  onCancel?: (taskId: string) => void
  onDownload?: (taskId: string, outputIndex: number) => void
  onDismiss?: (taskId: string) => void
  className?: string
}

export function TaskQueue({ tasks, onCancel, onDownload, onDismiss, className }: TaskQueueProps) {
  const activeTasks = tasks.filter((t) => t.status === "pending" || t.status === "processing")
  const completedTasks = tasks.filter((t) => t.status === "completed" || t.status === "failed")

  const formatETA = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    const mins = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return `${mins}m ${secs}s`
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "pending":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  if (tasks.length === 0) return null

  return (
    <div className={cn("space-y-2", className)}>
      {/* Active Tasks */}
      {activeTasks.map((task) => (
        <div key={task.id} className="p-4 rounded-lg border bg-card space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {getStatusIcon(task.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{task.type}</p>
                <p className="text-xs text-muted-foreground">
                  {task.status === "processing" && task.eta && `ETA: ${formatETA(task.eta)}`}
                  {task.status === "pending" && "Waiting..."}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onCancel?.(task.id)}
              aria-label="Cancel task"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {task.status === "processing" && (
            <div className="space-y-1">
              <Progress value={task.progress} />
              <p className="text-xs text-muted-foreground text-right">{task.progress}%</p>
            </div>
          )}
        </div>
      ))}

      {/* Completed Tasks */}
      {completedTasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "p-4 rounded-lg border space-y-3",
            task.status === "completed" && "bg-green-500/5 border-green-500/20",
            task.status === "failed" && "bg-red-500/5 border-red-500/20",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {getStatusIcon(task.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{task.type}</p>
                {task.status === "completed" && (
                  <p className="text-xs text-green-600 dark:text-green-400">Completed successfully</p>
                )}
                {task.status === "failed" && task.error && (
                  <p className="text-xs text-red-600 dark:text-red-400">{task.error}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onDismiss?.(task.id)}
              aria-label="Dismiss"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {task.status === "completed" && task.output && task.output.length > 0 && (
            <div className="space-y-2">
              {task.output.map((output, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                  onClick={() => onDownload?.(task.id, index)}
                >
                  <Download className="h-3 w-3 mr-2" />
                  {output.filename}
                </Button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
