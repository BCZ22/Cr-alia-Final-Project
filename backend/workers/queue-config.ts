/**
 * BullMQ Queue Configuration
 * Configuration complète pour le système de queue avec Redis
 */

import { ConnectionOptions, QueueOptions, WorkerOptions } from 'bullmq';
import IORedis from 'ioredis';

// ═══════════════════════════════════════════════════════════════════════════
// REDIS CONNECTION
// ═══════════════════════════════════════════════════════════════════════════

export const createRedisConnection = (): IORedis => {
  const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;
  
  const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 1000, 10000);
      console.log(`🔄 Redis reconnecting... Attempt ${times}, delay: ${delay}ms`);
      return delay;
    },
    reconnectOnError: (err) => {
      console.error('❌ Redis connection error:', err.message);
      return true;
    }
  });

  connection.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  connection.on('error', (err) => {
    console.error('❌ Redis error:', err.message);
  });

  connection.on('close', () => {
    console.warn('⚠️  Redis connection closed');
  });

  return connection;
};

export const redisConnection: ConnectionOptions = {
  connection: createRedisConnection()
};

// ═══════════════════════════════════════════════════════════════════════════
// QUEUE OPTIONS
// ═══════════════════════════════════════════════════════════════════════════

export const defaultQueueOptions: QueueOptions = {
  connection: redisConnection.connection,
  defaultJobOptions: {
    attempts: parseInt(process.env.JOB_ATTEMPTS || '3'),
    backoff: {
      type: 'exponential',
      delay: parseInt(process.env.JOB_BACKOFF_MS || '5000')
    },
    removeOnComplete: {
      age: 3600 * 24, // 24 heures
      count: 1000
    },
    removeOnFail: {
      age: 3600 * 24 * 7 // 7 jours
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// WORKER OPTIONS PAR TYPE
// ═══════════════════════════════════════════════════════════════════════════

export const workerOptions = {
  videoProcessing: {
    connection: redisConnection.connection,
    concurrency: parseInt(process.env.VIDEO_CONCURRENCY || '2'),
    limiter: {
      max: 5, // Max 5 jobs par...
      duration: 60000 // ...minute
    },
    lockDuration: 600000, // 10 minutes
    maxStalledCount: 2
  } as WorkerOptions,

  analysis: {
    connection: redisConnection.connection,
    concurrency: parseInt(process.env.ANALYSIS_CONCURRENCY || '3'),
    limiter: {
      max: 10,
      duration: 60000
    },
    lockDuration: 300000 // 5 minutes
  } as WorkerOptions,

  captions: {
    connection: redisConnection.connection,
    concurrency: parseInt(process.env.CAPTION_CONCURRENCY || '5'),
    limiter: {
      max: 15,
      duration: 60000
    },
    lockDuration: 300000
  } as WorkerOptions,

  publishing: {
    connection: redisConnection.connection,
    concurrency: 2,
    limiter: {
      max: 10,
      duration: 60000
    },
    lockDuration: 120000 // 2 minutes
  } as WorkerOptions
};

// ═══════════════════════════════════════════════════════════════════════════
// QUEUE NAMES
// ═══════════════════════════════════════════════════════════════════════════

export const QUEUE_NAMES = {
  VIDEO_PROCESSING: 'video-processing',
  ANALYSIS: 'analysis',
  CAPTIONS: 'captions',
  PUBLISHING: 'publishing',
  THUMBNAILS: 'thumbnails',
  EXPORTS: 'exports'
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// JOB PRIORITIES
// ═══════════════════════════════════════════════════════════════════════════

export const JOB_PRIORITIES = {
  CRITICAL: 1,
  HIGH: 2,
  NORMAL: 3,
  LOW: 4
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════════════════

export const checkRedisHealth = async (): Promise<boolean> => {
  try {
    const connection = redisConnection.connection as IORedis;
    const result = await connection.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
};

export default {
  redisConnection,
  defaultQueueOptions,
  workerOptions,
  QUEUE_NAMES,
  JOB_PRIORITIES,
  checkRedisHealth
};
