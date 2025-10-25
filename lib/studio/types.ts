/**
 * Créalia Studio - Types & Interfaces
 */

// Tool categories
export type ToolCategory = 'Recommandé' | 'Vidéo' | 'Image' | 'Contenu Audio' | 'Mes Projets' | 'Historique'

// Tool definition
export interface Tool {
  id: string
  name: string
  category: ToolCategory
  icon: string
  description: string
  shortDescription: string
  tag?: 'Nouveau' | 'Populaire' | 'Premium'
  endpoint: string
  params: ToolParam[]
  presets?: ToolPreset[]
}

// Tool parameter
export interface ToolParam {
  name: string
  type: 'text' | 'number' | 'select' | 'boolean' | 'file' | 'range' | 'textarea'
  label: string
  description?: string
  required: boolean
  default?: any
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  accept?: string // for file inputs
  placeholder?: string
}

// Tool preset
export interface ToolPreset {
  id: string
  name: string
  description: string
  params: Record<string, any>
  thumbnail?: string
}

// Media upload result
export interface MediaUpload {
  status: 'success' | 'error'
  media_url?: string
  media_id?: string
  metadata?: {
    duration?: number
    format: string
    resolution?: {
      width: number
      height: number
    }
    size: number
    thumbnail?: string
  }
  error?: string
}

// Scene detection result
export interface Scene {
  start: number
  end: number
  score: number
  thumbnail: string
  description?: string
}

// Analysis result
export interface AnalysisResult {
  status: 'success' | 'error'
  scenes?: Scene[]
  objects?: Array<{ type: string; confidence: number }>
  suggested_clips?: Array<{ start: number; end: number; reason: string }>
  thumbnail?: string
  dominantColors?: string[]
  mood?: string
  error?: string
}

// Job status
export type JobStatus = 'pending' | 'queued' | 'processing' | 'completed' | 'failed'

// Generation job
export interface GenerationJob {
  job_id: string;
  id?: string; // For compatibility with mock API response
  status: JobStatus;
  progress?: number;
  estimated_time_sec?: number;
  logs?: string[];
  outputs?: JobOutput[];
  error?: string;
  created_at?: string;
  updated_at?: string;
  resultUrl?: string; // For mock response
}

// Job output
export interface JobOutput {
  id: string
  type: 'reel' | 'video' | 'image' | 'audio'
  url: string
  thumbnail?: string
  meta: {
    duration?: number
    aspect_ratio?: string
    format?: string
    size?: number
  }
  caption?: {
    title: string
    text: string
    hashtags: string[]
  }
}

// Generation parameters for Reels
export interface ReelsGeneratorParams {
  media_id: string
  aspect_ratio: '9:16' | '4:5' | '1:1'
  duration_target: number // 10-60 seconds
  music_mode: 'auto' | 'select' | 'none'
  tone: 'sportif' | 'luxe' | 'fun' | 'éducatif' | 'émotionnel' | 'promotionnel' | 'viral'
  subtitles: boolean
  brand_overlay: boolean
  brand_position?: 'bottom-left' | 'bottom-right' | 'center-top'
  color_grade: 'auto' | 'cinematic' | 'vibrant' | 'natural'
  hooks?: string
  auto_branding?: boolean
}

// Captions generation
export interface CaptionsResult {
  status: 'success' | 'error'
  subtitles_url?: string
  transcript?: string
  subtitles?: Array<{
    start: number
    end: number
    text: string
  }>
  error?: string
}

// Brand kit
export interface BrandKit {
  logo_url?: string
  colors: string[]
  fonts: string[]
  tagline?: string
  assets: Array<{
    type: 'logo' | 'watermark' | 'overlay'
    url: string
  }>
}

// Project
export interface Project {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
  user_id: string
  outputs: JobOutput[]
  status: 'draft' | 'processing' | 'completed'
}

// Analytics event types
export type StudioEventType =
  | 'tool_opened'
  | 'upload_started'
  | 'upload_completed'
  | 'analyze_started'
  | 'analyze_completed'
  | 'generate_started'
  | 'generate_completed'
  | 'generate_failed'
  | 'preset_applied'
  | 'download_clicked'

// Analytics event
export interface StudioEvent {
  type: StudioEventType
  tool_id?: string
  media_id?: string
  job_id?: string
  preset_id?: string
  output_id?: string
  timestamp: string
  user_id: string
  metadata?: Record<string, any>
}

// API Error response
export interface APIError {
  error: string
  details?: string
  code?: string
  solution?: string
  help_url?: string
}

// Validation error
export interface ValidationError {
  field: string
  message: string
  code: string
}

// Upload validation
export interface UploadValidation {
  valid: boolean
  errors: ValidationError[]
  warnings?: string[]
}

