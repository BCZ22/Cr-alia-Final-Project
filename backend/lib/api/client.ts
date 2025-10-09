import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export interface ApiResponse<T = any> {
  ok: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  message: string
  status?: number
  code?: string
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Permet à axios d'envoyer les cookies
    })

    // L'intercepteur de requête pour ajouter le token est maintenant inutile.
    /*
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token')
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => Promise.reject(error)
    )
    */

    // Response interceptor pour gérer les erreurs globalement
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expiré ou invalide. Le backend a invalidé le cookie.
          // On redirige simplement vers la page de connexion.
          if (typeof window !== 'undefined') {
            // On ne nettoie plus le localStorage, car on ne l'utilise plus pour le token.
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(url, config)
      return {
        ok: true,
        data: response.data,
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, data, config)
      return {
        ok: true,
        data: response.data,
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put(url, data, config)
      return {
        ok: true,
        data: response.data,
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(url, config)
      return {
        ok: true,
        data: response.data,
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  async upload<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      })
      return {
        ok: true,
        data: response.data,
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  private handleError(error: any): ApiResponse {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Une erreur est survenue',
      status: error.response?.status,
      code: error.response?.data?.code,
    }

    return {
      ok: false,
      error: apiError.message,
    }
  }
}

export const apiClient = new ApiClient()
export default apiClient
