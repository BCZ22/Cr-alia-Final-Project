export interface Project {
  id: string
  title: string
  description?: string
  type: 'video' | 'image' | 'text' | 'mixed'
  status: 'draft' | 'processing' | 'completed' | 'failed'
  files: ProjectFile[]
  settings: ProjectSettings
  createdAt: string
  updatedAt: string
  userId: string
}

export interface ProjectFile {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'audio' | 'document'
  size: number
  mimeType: string
  thumbnailUrl?: string
  duration?: number // for video/audio files
  dimensions?: {
    width: number
    height: number
  }
  createdAt: string
}

export interface ProjectSettings {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter' | 'linkedin' | 'pinterest'
  aspectRatio: string
  duration?: number
  quality: 'low' | 'medium' | 'high'
  watermark?: boolean
  autoOptimize: boolean
}

export interface CreateProjectRequest {
  title: string
  description?: string
  type: Project['type']
  settings: ProjectSettings
}

export interface UpdateProjectRequest {
  title?: string
  description?: string
  settings?: Partial<ProjectSettings>
}

export interface UploadFileRequest {
  file: File
  projectId?: string
}

export interface UploadFileResponse {
  file: ProjectFile
  uploadUrl?: string
}

export interface ProjectFilters {
  type?: Project['type']
  status?: Project['status']
  platform?: ProjectSettings['platform']
  search?: string
}

export interface ProjectListResponse {
  projects: Project[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
