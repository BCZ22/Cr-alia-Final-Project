/**
 * Queue Service
 * Service pour gérer l'ajout et le suivi de jobs dans les queues BullMQ
 */

import { Queue, Job } from 'bullmq';
import { defaultQueueOptions, QUEUE_NAMES, JOB_PRIORITIES } from '../workers/queue-config';
import pino from 'pino';

const logger = pino({ name: 'queue-service' });

// ═══════════════════════════════════════════════════════════════════════════
// QUEUES INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

const queues = {
  videoProcessing: new Queue(QUEUE_NAMES.VIDEO_PROCESSING, defaultQueueOptions),
  analysis: new Queue(QUEUE_NAMES.ANALYSIS, defaultQueueOptions),
  captions: new Queue(QUEUE_NAMES.CAPTIONS, defaultQueueOptions),
  publishing: new Queue(QUEUE_NAMES.PUBLISHING, defaultQueueOptions),
  thumbnails: new Queue(QUEUE_NAMES.THUMBNAILS, defaultQueueOptions),
  exports: new Queue(QUEUE_NAMES.EXPORTS, defaultQueueOptions)
};

// ═══════════════════════════════════════════════════════════════════════════
// VIDEO PROCESSING JOBS
// ═══════════════════════════════════════════════════════════════════════════

export interface AddVideoJobOptions {
  mediaId: string;
  userId: string;
  inputUrl: string;
  outputType: 'reel' | 'short' | 'ad';
  options?: {
    duration?: number;
    format?: string;
    quality?: 'low' | 'medium' | 'high';
    aspectRatio?: '9:16' | '16:9' | '1:1';
    addSubtitles?: boolean;
    addMusic?: boolean;
    musicUrl?: string;
  };
  priority?: number;
}

export async function addVideoProcessingJob(data: AddVideoJobOptions): Promise<Job> {
  logger.info({ data }, 'Adding video processing job');
  
  try {
    const job = await queues.videoProcessing.add(
      'process-video',
      data,
      {
        priority: data.priority || JOB_PRIORITIES.NORMAL,
        jobId: `video-${data.mediaId}`,
        timeout: 600000, // 10 minutes
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000
        }
      }
    );
    
    logger.info({ jobId: job.id }, 'Video job added to queue');
    return job;
    
  } catch (error) {
    logger.error({ error, data }, 'Failed to add video job');
    throw new Error(`Failed to add video job: ${error.message}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ANALYSIS JOBS
// ═══════════════════════════════════════════════════════════════════════════

export interface AddAnalysisJobOptions {
  mediaId: string;
  userId: string;
  mediaUrl: string;
  analysisType: 'scene-detection' | 'face-detection' | 'audio-analysis' | 'content-analysis';
}

export async function addAnalysisJob(data: AddAnalysisJobOptions): Promise<Job> {
  logger.info({ data }, 'Adding analysis job');
  
  try {
    const job = await queues.analysis.add(
      'analyze-media',
      data,
      {
        priority: JOB_PRIORITIES.HIGH,
        jobId: `analysis-${data.mediaId}-${data.analysisType}`,
        timeout: 300000 // 5 minutes
      }
    );
    
    logger.info({ jobId: job.id }, 'Analysis job added');
    return job;
    
  } catch (error) {
    logger.error({ error, data }, 'Failed to add analysis job');
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CAPTION JOBS
// ═══════════════════════════════════════════════════════════════════════════

export interface AddCaptionJobOptions {
  mediaId: string;
  userId: string;
  audioUrl: string;
  language?: string;
  format?: 'srt' | 'vtt' | 'json';
}

export async function addCaptionJob(data: AddCaptionJobOptions): Promise<Job> {
  logger.info({ data }, 'Adding caption job');
  
  try {
    const job = await queues.captions.add(
      'generate-captions',
      data,
      {
        priority: JOB_PRIORITIES.NORMAL,
        jobId: `captions-${data.mediaId}`,
        timeout: 300000
      }
    );
    
    logger.info({ jobId: job.id }, 'Caption job added');
    return job;
    
  } catch (error) {
    logger.error({ error, data }, 'Failed to add caption job');
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLISHING JOBS
// ═══════════════════════════════════════════════════════════════════════════

export interface AddPublishingJobOptions {
  mediaId: string;
  userId: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook';
  videoUrl: string;
  caption: string;
  hashtags?: string[];
  scheduledAt?: Date;
}

export async function addPublishingJob(data: AddPublishingJobOptions): Promise<Job> {
  logger.info({ data }, 'Adding publishing job');
  
  try {
    const delay = data.scheduledAt 
      ? data.scheduledAt.getTime() - Date.now()
      : 0;
    
    const job = await queues.publishing.add(
      'publish-content',
      data,
      {
        priority: JOB_PRIORITIES.HIGH,
        jobId: `publish-${data.platform}-${data.mediaId}`,
        delay: delay > 0 ? delay : undefined,
        timeout: 120000 // 2 minutes
      }
    );
    
    logger.info({ jobId: job.id, platform: data.platform }, 'Publishing job added');
    return job;
    
  } catch (error) {
    logger.error({ error, data }, 'Failed to add publishing job');
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// JOB STATUS & MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

export async function getJobStatus(jobId: string): Promise<any> {
  try {
    // Chercher dans toutes les queues
    for (const [name, queue] of Object.entries(queues)) {
      const job = await queue.getJob(jobId);
      if (job) {
        const state = await job.getState();
        const progress = job.progress;
        const returnValue = job.returnvalue;
        const failedReason = job.failedReason;
        
        return {
          jobId: job.id,
          queue: name,
          state,
          progress,
          data: job.data,
          result: returnValue,
          error: failedReason,
          attempts: job.attemptsMade,
          timestamp: job.timestamp,
          processedOn: job.processedOn,
          finishedOn: job.finishedOn
        };
      }
    }
    
    return null;
    
  } catch (error) {
    logger.error({ error, jobId }, 'Failed to get job status');
    throw error;
  }
}

export async function cancelJob(jobId: string): Promise<boolean> {
  logger.info({ jobId }, 'Cancelling job');
  
  try {
    for (const queue of Object.values(queues)) {
      const job = await queue.getJob(jobId);
      if (job) {
        await job.remove();
        logger.info({ jobId }, 'Job cancelled');
        return true;
      }
    }
    
    return false;
    
  } catch (error) {
    logger.error({ error, jobId }, 'Failed to cancel job');
    throw error;
  }
}

export async function retryJob(jobId: string): Promise<boolean> {
  logger.info({ jobId }, 'Retrying job');
  
  try {
    for (const queue of Object.values(queues)) {
      const job = await queue.getJob(jobId);
      if (job) {
        await job.retry();
        logger.info({ jobId }, 'Job retried');
        return true;
      }
    }
    
    return false;
    
  } catch (error) {
    logger.error({ error, jobId }, 'Failed to retry job');
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// QUEUE METRICS
// ═══════════════════════════════════════════════════════════════════════════

export async function getQueueMetrics() {
  try {
    const metrics: any = {};
    
    for (const [name, queue] of Object.entries(queues)) {
      const waiting = await queue.getWaitingCount();
      const active = await queue.getActiveCount();
      const completed = await queue.getCompletedCount();
      const failed = await queue.getFailedCount();
      const delayed = await queue.getDelayedCount();
      
      metrics[name] = {
        waiting,
        active,
        completed,
        failed,
        delayed,
        total: waiting + active + completed + failed + delayed
      };
    }
    
    return metrics;
    
  } catch (error) {
    logger.error({ error }, 'Failed to get queue metrics');
    throw error;
  }
}

export async function cleanQueue(queueName: keyof typeof queues, grace: number = 3600000) {
  logger.info({ queueName, grace }, 'Cleaning queue');
  
  try {
    const queue = queues[queueName];
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }
    
    await queue.clean(grace, 1000, 'completed');
    await queue.clean(grace, 1000, 'failed');
    
    logger.info({ queueName }, 'Queue cleaned');
    
  } catch (error) {
    logger.error({ error, queueName }, 'Failed to clean queue');
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  addVideoProcessingJob,
  addAnalysisJob,
  addCaptionJob,
  addPublishingJob,
  getJobStatus,
  cancelJob,
  retryJob,
  getQueueMetrics,
  cleanQueue,
  queues
};
