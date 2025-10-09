import { apiClient } from '../api/client'
import type { 
  Project, 
  CreateProjectRequest, 
  UpdateProjectRequest, 
  UploadFileRequest, 
  UploadFileResponse,
  ProjectFilters,
  ProjectListResponse
} from './types'

export class StudioClient {
  // Get all projects with filters and pagination
  static async getProjects(
    filters: ProjectFilters = {},
    page = 1,
    limit = 20
  ): Promise<ProjectListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ),
    })

    const response = await apiClient.get<ProjectListResponse>(`/studio/projects?${params}`)
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération des projets')
    }

    return response.data
  }

  // Get single project by ID
  static async getProject(id: string): Promise<Project> {
    const response = await apiClient.get<Project>(`/studio/projects/${id}`)
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération du projet')
    }

    return response.data
  }

  // Create new project
  static async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await apiClient.post<Project>('/studio/projects', data)
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la création du projet')
    }

    return response.data
  }

  // Update project
  static async updateProject(id: string, data: UpdateProjectRequest): Promise<Project> {
    const response = await apiClient.put<Project>(`/studio/projects/${id}`, data)
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la mise à jour du projet')
    }

    return response.data
  }

  // Delete project
  static async deleteProject(id: string): Promise<void> {
    const response = await apiClient.delete(`/studio/projects/${id}`)
    
    if (!response.ok) {
      throw new Error(response.error || 'Erreur lors de la suppression du projet')
    }
  }

  // Upload file
  static async uploadFile(data: UploadFileRequest): Promise<UploadFileResponse> {
    const formData = new FormData()
    formData.append('file', data.file)
    if (data.projectId) {
      formData.append('projectId', data.projectId)
    }

    const response = await apiClient.upload<UploadFileResponse>('/studio/upload', formData)
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de l\'upload du fichier')
    }

    return response.data
  }

  // Get project files
  static async getProjectFiles(projectId: string): Promise<Project['files']> {
    const response = await apiClient.get<Project['files']>(`/studio/projects/${projectId}/files`)
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération des fichiers')
    }

    return response.data
  }

  // Delete file from project
  static async deleteFile(projectId: string, fileId: string): Promise<void> {
    const response = await apiClient.delete(`/studio/projects/${projectId}/files/${fileId}`)
    
    if (!response.ok) {
      throw new Error(response.error || 'Erreur lors de la suppression du fichier')
    }
  }

  // Duplicate project
  static async duplicateProject(id: string, newTitle?: string): Promise<Project> {
    const response = await apiClient.post<Project>(`/studio/projects/${id}/duplicate`, {
      title: newTitle,
    })
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la duplication du projet')
    }

    return response.data
  }

  // Export project
  static async exportProject(id: string, format: 'mp4' | 'jpg' | 'png' | 'pdf' = 'mp4'): Promise<Blob> {
    const response = await fetch(`/api/studio/projects/${id}/export?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })

    if (!response.ok) {
      throw new Error('Erreur lors de l\'export du projet')
    }

    return response.blob()
  }

  // Get project analytics
  static async getProjectAnalytics(id: string): Promise<any> {
    const response = await apiClient.get(`/studio/projects/${id}/analytics`)
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération des analytics')
    }

    return response.data
  }
}

export default StudioClient
