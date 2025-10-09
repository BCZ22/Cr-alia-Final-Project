import { apiClient } from '../api/client'
import type { 
  User, 
  LoginCredentials, 
  RegisterCredentials, 
  ForgotPasswordData, 
  ResetPasswordData,
  AuthResponse 
} from './types'

export class AuthService {
  // Les clés de localStorage sont supprimées.

  // Login
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la connexion')
    }
    // Plus de manipulation de localStorage. La réponse contient maintenant seulement les données utilisateur.
    return response.data
  }

  // Register
  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', credentials)
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de l\'inscription')
    }
    // Plus de manipulation de localStorage.
    return response.data
  }

  // Logout
  static async logout(): Promise<void> {
    // On appelle simplement l'endpoint. Le backend s'occupe de supprimer le cookie.
    await apiClient.post('/auth/logout')
  }

  // Forgot Password
  static async forgotPassword(data: ForgotPasswordData): Promise<void> {
    const response = await apiClient.post('/auth/forgot-password', data)
    
    if (!response.ok) {
      throw new Error(response.error || 'Erreur lors de l\'envoi de l\'email')
    }
  }

  // Reset Password
  static async resetPassword(data: ResetPasswordData): Promise<void> {
    const response = await apiClient.post('/auth/reset-password', data)
    
    if (!response.ok) {
      throw new Error(response.error || 'Erreur lors de la réinitialisation du mot de passe')
    }
  }

  // getCurrentUser et getToken ne sont plus fiables car basés sur localStorage.
  // L'état de l'utilisateur doit être géré par AuthContext, initialisé via refreshUser.
  // Ces fonctions sont conservées mais marquées comme dépréciées ou à usage limité.

  /**
   * @deprecated Ne doit pas être utilisé pour valider une session. Utiliser AuthContext.
   */
  static getCurrentUserFromStorage(): User | null {
    // Cette fonction pourrait servir à une récupération optimiste mais non sécurisée.
    // Pour l'instant, on la vide pour forcer l'utilisation du contexte.
    return null
  }

  /**
   * @deprecated Le token est maintenant dans un cookie HttpOnly et inaccessible.
   */
  static getToken(): null {
    return null
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    // Cette méthode n'est plus fiable côté client de cette manière.
    // La validation se fait via l'état du AuthContext.
    return false 
  }

  // Refresh user data by calling the /me endpoint
  static async refreshUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<User>('/auth/me')
      
      if (response.ok && response.data) {
        return response.data
      }
      
      return null
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des données utilisateur:', error)
      return null
    }
  }
}

export default AuthService
