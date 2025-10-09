'use client'

import React, { createContext, useContext, useCallback, ReactNode } from 'react'
import { toast } from 'sonner'
import type { Notification, ToastOptions } from './types'

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  showSuccess: (title: string, message?: string, options?: ToastOptions) => void
  showError: (title: string, message?: string, options?: ToastOptions) => void
  showWarning: (title: string, message?: string, options?: ToastOptions) => void
  showInfo: (title: string, message?: string, options?: ToastOptions) => void
  dismiss: (id: string) => void
  dismissAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const showNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const fullNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date().toISOString(),
    }

    const toastOptions = {
      duration: notification.duration || 5000,
      action: notification.action ? {
        label: notification.action.label,
        onClick: notification.action.onClick,
      } : undefined,
    }

    switch (notification.type) {
      case 'success':
        toast.success(notification.title, {
          description: notification.message,
          ...toastOptions,
        })
        break
      case 'error':
        toast.error(notification.title, {
          description: notification.message,
          ...toastOptions,
        })
        break
      case 'warning':
        toast.warning(notification.title, {
          description: notification.message,
          ...toastOptions,
        })
        break
      case 'info':
        toast.info(notification.title, {
          description: notification.message,
          ...toastOptions,
        })
        break
      default:
        toast(notification.title, {
          description: notification.message,
          ...toastOptions,
        })
    }
  }, [])

  const showSuccess = useCallback((title: string, message?: string, options?: ToastOptions) => {
    showNotification({
      type: 'success',
      title,
      message,
      duration: options?.duration,
      action: options?.action,
    })
  }, [showNotification])

  const showError = useCallback((title: string, message?: string, options?: ToastOptions) => {
    showNotification({
      type: 'error',
      title,
      message,
      duration: options?.duration,
      action: options?.action,
    })
  }, [showNotification])

  const showWarning = useCallback((title: string, message?: string, options?: ToastOptions) => {
    showNotification({
      type: 'warning',
      title,
      message,
      duration: options?.duration,
      action: options?.action,
    })
  }, [showNotification])

  const showInfo = useCallback((title: string, message?: string, options?: ToastOptions) => {
    showNotification({
      type: 'info',
      title,
      message,
      duration: options?.duration,
      action: options?.action,
    })
  }, [showNotification])

  const dismiss = useCallback((id: string) => {
    toast.dismiss(id)
  }, [])

  const dismissAll = useCallback(() => {
    toast.dismiss()
  }, [])

  const value: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismiss,
    dismissAll,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export default NotificationContext
