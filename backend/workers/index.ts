/**
 * Worker Initializer
 * This script initializes and starts all the BullMQ workers.
 */

import { createVideoWorker } from './video-processor';
// Import other worker creators here as they are created
// e.g., import { createAnalysisWorker } from './analysis-processor';

const workers = [];

export function initializeWorkers() {
  // Only initialize workers if Redis is configured
  if (process.env.REDIS_URL) {
    console.log('✅ Initializing workers...');
    
    // Start each worker
    workers.push(createVideoWorker());
    // workers.push(createAnalysisWorker());
    
    console.log(`🚀 ${workers.length} workers started.`);
  } else {
    console.warn('⚠️ REDIS_URL not found. Workers are not initialized.');
    console.warn('   Video processing and other background jobs will not function.');
  }
}

// Optional: Graceful shutdown logic
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing workers.');
  await Promise.all(workers.map(worker => worker.close()));
  process.exit(0);
});
