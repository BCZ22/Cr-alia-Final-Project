/**
 * Studio Job Service
 * Handle video/image processing jobs
 */

import { JobRepository } from '@/lib/db/repositories'

export interface CreateJobParams {
  userId: string
  type: 'VIDEO_EDIT' | 'IMAGE_GENERATE' | 'VOICE_GENERATE' | 'SUBTITLE_GENERATE' | 'MEME_GENERATE'
  inputData: any
}

/**
 * Create a new processing job
 */
export async function createStudioJob(params: CreateJobParams) {
  const { userId, type, inputData } = params

  // Create job in database
  const job = await JobRepository.createStudioJob({
    userId,
    jobType: type,
    inputData,
    status: 'PENDING',
  })

  // In production, this would trigger a worker/queue
  // For now, we'll mark it as processing immediately
  await JobRepository.startStudioJob(job.id)

  return job
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string) {
  return JobRepository.getStudioJob(jobId)
}

/**
 * Mock complete a job (for development)
 */
export async function mockCompleteJob(jobId: string, outputData: any) {
  return JobRepository.completeStudioJob(jobId, outputData)
}

/**
 * Fail a job
 */
export async function failJob(jobId: string, error: string) {
  return JobRepository.failStudioJob(jobId, error)
}

