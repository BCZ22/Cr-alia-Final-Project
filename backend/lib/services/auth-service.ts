/**
 * Auth Service - Gestion de l'authentification et autorisation
 * 
 * Ce service gère l'authentification JWT, les rôles, et les permissions
 */

import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface User {
  id: string
  email: string
  username: string
  role: string
  isActive: boolean
  isVerified: boolean
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  error?: string
}

export class AuthService {
  /**
   * Authentifie une requête et retourne l'utilisateur
   */
  async authenticateRequest(request: NextRequest): Promise<User | null> {
    try {
      // Récupérer le token depuis l'header Authorization
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
      }

      const token = authHeader.substring(7) // Remove 'Bearer ' prefix
      
      // Vérifier et décoder le token JWT
      const decoded = jwt.verify(token, JWT_SECRET) as any
      
      if (!decoded.userId) {
        return null
      }

      // Récupérer l'utilisateur depuis la base de données
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          isActive: true,
          isVerified: true,
        },
      })

      if (!user || !user.isActive) {
        return null
      }

      return user as User

    } catch (error) {
      console.error('Authentication error:', error)
      return null
    }
  }

  /**
   * Authentifie un utilisateur avec email/password
   */
  async authenticateUser(email: string, password: string): Promise<AuthResult> {
    try {
      // Récupérer l'utilisateur
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })

      if (!user) {
        return { success: false, error: 'Invalid credentials' }
      }

      if (!user.isActive) {
        return { success: false, error: 'Account is deactivated' }
      }

      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, user.passwordHash)
      if (!isValidPassword) {
        return { success: false, error: 'Invalid credentials' }
      }

      // Mettre à jour la dernière connexion
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      })

      // Générer le token JWT
      const token = this.generateToken(user.id)

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified,
        },
        token,
      }

    } catch (error) {
      console.error('Authentication error:', error)
      return { success: false, error: 'Internal server error' }
    }
  }

  /**
   * Crée un nouvel utilisateur
   */
  async createUser(userData: {
    email: string
    username: string
    password: string
    firstName?: string
    lastName?: string
  }): Promise<AuthResult> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: userData.email.toLowerCase() },
            { username: userData.username },
          ],
        },
      })

      if (existingUser) {
        return { 
          success: false, 
          error: existingUser.email === userData.email.toLowerCase() 
            ? 'Email already exists' 
            : 'Username already exists' 
        }
      }

      // Hasher le mot de passe
      const passwordHash = await bcrypt.hash(userData.password, 12)

      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          email: userData.email.toLowerCase(),
          username: userData.username,
          passwordHash,
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
      })

      // Générer le token JWT
      const token = this.generateToken(user.id)

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified,
        },
        token,
      }

    } catch (error) {
      console.error('User creation error:', error)
      return { success: false, error: 'Internal server error' }
    }
  }

  /**
   * Vérifie les permissions d'un utilisateur
   */
  async checkPermission(user: User, resource: string, action: string): Promise<boolean> {
    try {
      // Logique de permissions basée sur les rôles
      const permissions = this.getRolePermissions(user.role)
      
      // Vérifier si l'utilisateur a la permission
      return permissions.includes(`${resource}:${action}`) || 
             permissions.includes(`${resource}:*`) || 
             permissions.includes('*:*')

    } catch (error) {
      console.error('Permission check error:', error)
      return false
    }
  }

  /**
   * Génère un token JWT
   */
  private generateToken(userId: string): string {
    return jwt.sign(
      { 
        userId,
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )
  }

  /**
   * Retourne les permissions pour un rôle donné
   */
  private getRolePermissions(role: string): string[] {
    const rolePermissions: Record<string, string[]> = {
      USER: [
        'assets:read',
        'assets:create',
        'assets:update',
        'projects:read',
        'projects:create',
        'projects:update',
        'jobs:read',
        'social:read',
        'social:create',
        'analytics:read',
      ],
      PRO: [
        'assets:*',
        'projects:*',
        'jobs:*',
        'social:*',
        'analytics:*',
        'exports:*',
      ],
      ENTERPRISE: [
        '*:*',
      ],
      ADMIN: [
        '*:*',
      ],
    }

    return rolePermissions[role] || rolePermissions.USER
  }

  /**
   * Rafraîchit un token JWT
   */
  async refreshToken(token: string): Promise<AuthResult> {
    try {
      // Vérifier le token actuel
      const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as any
      
      if (!decoded.userId) {
        return { success: false, error: 'Invalid token' }
      }

      // Vérifier que l'utilisateur existe toujours
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          isActive: true,
          isVerified: true,
        },
      })

      if (!user || !user.isActive) {
        return { success: false, error: 'User not found or inactive' }
      }

      // Générer un nouveau token
      const newToken = this.generateToken(user.id)

      return {
        success: true,
        user: user as User,
        token: newToken,
      }

    } catch (error) {
      console.error('Token refresh error:', error)
      return { success: false, error: 'Invalid token' }
    }
  }

  /**
   * Change le mot de passe d'un utilisateur
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<AuthResult> {
    try {
      // Récupérer l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        return { success: false, error: 'User not found' }
      }

      // Vérifier le mot de passe actuel
      const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash)
      if (!isValidPassword) {
        return { success: false, error: 'Current password is incorrect' }
      }

      // Hasher le nouveau mot de passe
      const newPasswordHash = await bcrypt.hash(newPassword, 12)

      // Mettre à jour le mot de passe
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash },
      })

      return { success: true }

    } catch (error) {
      console.error('Password change error:', error)
      return { success: false, error: 'Internal server error' }
    }
  }

  /**
   * Génère un token de réinitialisation de mot de passe
   */
  async generatePasswordResetToken(email: string): Promise<AuthResult> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })

      if (!user) {
        // Pour des raisons de sécurité, on ne révèle pas si l'email existe
        return { success: true }
      }

      // Générer un token de réinitialisation (valide 1 heure)
      const resetToken = jwt.sign(
        { 
          userId: user.id,
          type: 'password-reset',
          iat: Math.floor(Date.now() / 1000),
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      )

      // TODO: Envoyer l'email avec le token

      return { success: true }

    } catch (error) {
      console.error('Password reset token generation error:', error)
      return { success: false, error: 'Internal server error' }
    }
  }

  /**
   * Réinitialise le mot de passe avec un token
   */
  async resetPassword(token: string, newPassword: string): Promise<AuthResult> {
    try {
      // Vérifier le token
      const decoded = jwt.verify(token, JWT_SECRET) as any
      
      if (!decoded.userId || decoded.type !== 'password-reset') {
        return { success: false, error: 'Invalid or expired token' }
      }

      // Hasher le nouveau mot de passe
      const passwordHash = await bcrypt.hash(newPassword, 12)

      // Mettre à jour le mot de passe
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { passwordHash },
      })

      return { success: true }

    } catch (error) {
      console.error('Password reset error:', error)
      return { success: false, error: 'Invalid or expired token' }
    }
  }
}

export const authService = new AuthService()
