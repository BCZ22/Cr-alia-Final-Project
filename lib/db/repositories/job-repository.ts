/**
 * Job Repository
 * Database operations for AI and Studio jobs
 */

import { prisma } from '../client'
import type { AIJob, StudioJob, JobStatus } from '@prisma/client'

export interface CreateAIJobData {
  userId: string
  tool: string
  prompt?: string
  options?: any
}

export interface CreateStudioJobData {
  userId: string
  tool: string
  inputFiles: string[]
  options?: any
}

export interface UpdateJobData {
  status?: JobStatus
  progress?: number
  resultUrl?: string
  resultData?: any
  errorMessage?: string
  startedAt?: Date
  completedAt?: Date
}

export class JobRepository {
  // =====================================================
  // AI JOBS
  // =====================================================

  /**
   * Create AI job
   */
  static async createAIJob(data: CreateAIJobData): Promise<AIJob> {
    return prisma.aIJob.create({
      data: {
        userId: data.userId,
        tool: data.tool,
        prompt: data.prompt,
        options: data.options,
        status: 'PENDING',
      },
    })
  }

  /**
   * Get AI job by ID
   */
  static async findAIJobById(id: string): Promise<AIJob | null> {
    return prisma.aIJob.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })
  }

  /**
   * Get AI jobs for user
   */
  static async findAIJobsByUserId(userId: string, limit = 20): Promise<AIJob[]> {
    return prisma.aIJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  /**
   * Get pending AI jobs
   */
  static async findPendingAIJobs(limit = 10): Promise<AIJob[]> {
    return prisma.aIJob.findMany({
      where: {
        status: 'PENDING',
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    })
  }

  /**
   * Update AI job
   */
  static async updateAIJob(id: string, data: UpdateJobData): Promise<AIJob> {
    return prisma.aIJob.update({
      where: { id },
      data,
    })
  }

  /**
   * Start AI job processing
   */
  static async startAIJob(id: string): Promise<AIJob> {
    return prisma.aIJob.update({
      where: { id },
      data: {
        status: 'PROCESSING',
        startedAt: new Date(),
      },
    })
  }

  /**
   * Complete AI job
   */
  static async completeAIJob(
    id: string,
    resultUrl: string,
    resultData?: any
  ): Promise<AIJob> {
    return prisma.aIJob.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        resultUrl,
        resultData,
        progress: 100,
        completedAt: new Date(),
      },
    })
  }

  /**
   * Fail AI job
   */
  static async failAIJob(id: string, errorMessage: string): Promise<AIJob> {
    return prisma.aIJob.update({
      where: { id },
      data: {
        status: 'FAILED',
        errorMessage,
        completedAt: new Date(),
      },
    })
  }

  // =====================================================
  // STUDIO JOBS
  // =====================================================

  /**
   * Create Studio job
   */
  static async createStudioJob(data: CreateStudioJobData): Promise<StudioJob> {
    return prisma.studioJob.create({
      data: {
        userId: data.userId,
        tool: data.tool,
        inputFiles: data.inputFiles,
        options: data.options,
        status: 'PENDING',
      },
    })
  }

  /**
   * Get Studio job by ID
   */
  static async findStudioJobById(id: string): Promise<StudioJob | null> {
    return prisma.studioJob.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })
  }

  /**
   * Get Studio jobs for user
   */
  static async findStudioJobsByUserId(userId: string, limit = 20): Promise<StudioJob[]> {
    return prisma.studioJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  /**
   * Update Studio job
   */
  static async updateStudioJob(id: string, data: UpdateJobData): Promise<StudioJob> {
    return prisma.studioJob.update({
      where: { id },
      data,
    })
  }

  /**
   * Complete Studio job
   */
  static async completeStudioJob(
    id: string,
    resultUrl: string,
    resultData?: any
  ): Promise<StudioJob> {
    return prisma.studioJob.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        resultUrl,
        resultData,
        progress: 100,
        completedAt: new Date(),
      },
    })
  }

  /**
   * Fail Studio job
   */
  static async failStudioJob(id: string, errorMessage: string): Promise<StudioJob> {
    return prisma.studioJob.update({
      where: { id },
      data: {
        status: 'FAILED',
        errorMessage,
        completedAt: new Date(),
      },
    })
  }

  /**
   * Get job by ID (AI or Studio)
   */
  static async findJobById(id: string): Promise<AIJob | StudioJob | null> {
    const aiJob = await this.findAIJobById(id)
    if (aiJob) return aiJob

    const studioJob = await this.findStudioJobById(id)
    return studioJob
  }
}

