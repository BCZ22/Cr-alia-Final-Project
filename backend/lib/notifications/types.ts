export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  createdAt: string
}

export interface ToastOptions {
  type?: NotificationType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}
