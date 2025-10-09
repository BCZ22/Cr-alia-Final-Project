'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthService } from './auth'
import type { User, AuthState, LoginCredentials, RegisterCredentials, ForgotPasswordData, ResetPasswordData } from './types'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (data: ForgotPasswordData) => Promise<void>
  resetPassword: (data: ResetPasswordData) => Promise<void>
  refreshUser: () => Promise<void>
  hasRole: (role: string) => boolean
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Au lieu de lire le localStorage, on appelle /api/auth/me
        // Le cookie HttpOnly sera envoyé automatiquement par le navigateur.
        const refreshedUser = await AuthService.refreshUser()
        if (refreshedUser) {
          setUser(refreshedUser)
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error)
        // En cas d'erreur (ex: token invalide), l'utilisateur reste null
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      const authResponse = await AuthService.login(credentials)
      setUser(authResponse.user)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true)
      const authResponse = await AuthService.register(credentials)
      setUser(authResponse.user)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await AuthService.logout()
      setUser(null)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const forgotPassword = async (data: ForgotPasswordData) => {
    await AuthService.forgotPassword(data)
  }

  const resetPassword = async (data: ResetPasswordData) => {
    await AuthService.resetPassword(data)
  }

  const refreshUser = async () => {
    try {
      const refreshedUser = await AuthService.refreshUser()
      if (refreshedUser) {
        setUser(refreshedUser)
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de l\'utilisateur:', error)
    }
  }

  const hasRole = (role: string): boolean => {
    return user?.role === role
  }

  const isAdmin = (): boolean => {
    return hasRole('admin')
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    refreshUser,
    hasRole,
    isAdmin,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
