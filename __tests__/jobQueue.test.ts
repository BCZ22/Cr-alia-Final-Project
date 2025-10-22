/**
 * Job Queue Tests
 */

import { createJob, getJobStatus, cancelJob } from '@/lib/jobQueue'
import { JobRepository } from '@/lib/db/repositories'

// Mock the repository
jest.mock('@/lib/db/repositories', () => ({
  JobRepository: {
    createStudioJob: jest.fn(),
    getStudioJob: jest.fn(),
    startStudioJob: jest.fn(),
    completeStudioJob: jest.fn(),
    failStudioJob: jest.fn(),
  },
}))

describe('JobQueue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createJob', () => {
    it('should create a job successfully', async () => {
      const mockJob = {
        id: 'job-123',
        userId: 'user-1',
        jobType: 'VIDEO_EDIT',
        inputData: { test: 'data' },
        status: 'PENDING',
        createdAt: new Date(),
      }

      ;(JobRepository.createStudioJob as jest.Mock).mockResolvedValue(mockJob)

      const result = await createJob({
        userId: 'user-1',
        type: 'reel_generation',
        payload: { test: 'data' },
      })

      expect(result).toEqual({
        jobId: 'job-123',
        status: 'pending',
        progress: 0,
      })

      expect(JobRepository.createStudioJob).toHaveBeenCalledWith({
        userId: 'user-1',
        jobType: 'VIDEO_EDIT',
        inputData: { test: 'data' },
        status: 'PENDING',
      })
    })

    it('should handle creation errors', async () => {
      ;(JobRepository.createStudioJob as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        createJob({
          userId: 'user-1',
          type: 'reel_generation',
          payload: {},
        })
      ).rejects.toThrow('Failed to create job')
    })
  })

  describe('getJobStatus', () => {
    it('should get job status for pending job', async () => {
      const mockJob = {
        id: 'job-123',
        userId: 'user-1',
        jobType: 'VIDEO_EDIT',
        status: 'PENDING',
        inputData: {},
        outputData: null,
        error: null,
        createdAt: new Date(),
      }

      ;(JobRepository.getStudioJob as jest.Mock).mockResolvedValue(mockJob)

      const result = await getJobStatus('job-123')

      expect(result).toEqual({
        jobId: 'job-123',
        status: 'pending',
        outputUrl: undefined,
        progress: 0,
        errorMessage: undefined,
      })
    })

    it('should get job status for completed job', async () => {
      const mockJob = {
        id: 'job-123',
        userId: 'user-1',
        jobType: 'VIDEO_EDIT',
        status: 'COMPLETED',
        inputData: {},
        outputData: { url: 'https://example.com/output.mp4' },
        error: null,
        createdAt: new Date(),
        completedAt: new Date(),
      }

      ;(JobRepository.getStudioJob as jest.Mock).mockResolvedValue(mockJob)

      const result = await getJobStatus('job-123')

      expect(result).toEqual({
        jobId: 'job-123',
        status: 'done',
        outputUrl: 'https://example.com/output.mp4',
        progress: 100,
        errorMessage: undefined,
      })
    })

    it('should return null for non-existent job', async () => {
      ;(JobRepository.getStudioJob as jest.Mock).mockResolvedValue(null)

      const result = await getJobStatus('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('cancelJob', () => {
    it('should cancel a job successfully', async () => {
      ;(JobRepository.failStudioJob as jest.Mock).mockResolvedValue(undefined)

      const result = await cancelJob('job-123')

      expect(result).toBe(true)
      expect(JobRepository.failStudioJob).toHaveBeenCalledWith(
        'job-123',
        'Job cancelled by user'
      )
    })

    it('should handle cancellation errors', async () => {
      ;(JobRepository.failStudioJob as jest.Mock).mockRejectedValue(
        new Error('Failed to cancel')
      )

      const result = await cancelJob('job-123')

      expect(result).toBe(false)
    })
  })
})

