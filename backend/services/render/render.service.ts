// =============================================================================
// RENDER SERVICE
// =============================================================================

// import { PrismaClient, RenderJob as PrismaRenderJob, RenderStatus } from '@prisma/client';
// import { z } from 'zod';
// import { S3Service } from '../aws/s3.service';
// import { SQSService } from '../aws/sqs.service';
// import { FFmpegService } from '../ffmpeg/ffmpeg.service';
// import { BullMQService } from '../queue/bullmq.service';

// const RenderJobSchema = z.object({
//   id: z.string(),
//   projectId: z.string(),
//   userId: z.string(),
//   status: z.nativeEnum(RenderStatus),
//   progress: z.number().min(0).max(100),
//   outputUrl: z.string().url().optional(),
//   format: z.string(),
//   resolution: z.string(),
//   quality: z.string(),
//   metadata: z.record(z.any()).optional(),
//   error: z.string().optional(),
//   createdAt: z.date(),
//   updatedAt: z.date(),
//   startedAt: z.date().optional(),
//   completedAt: z.date().optional(),
// });

// export type RenderJob = z.infer<typeof RenderJobSchema>;

// const CreateRenderJobSchema = z.object({
//   projectId: z.string(),
//   userId: z.string(),
//   format: z.string().default('mp4'),
//   resolution: z.string().default('1080p'),
//   quality: z.string().default('high'),
//   metadata: z.record(z.any()).optional(),
// });

// export type CreateRenderJobInput = z.infer<typeof CreateRenderJobSchema>;

// export class RenderService {
//   private prisma: PrismaClient;
//   private s3Service: S3Service;
//   private sqsService: SQSService;
//   private ffmpegService: FFmpegService;
//   private bullmqService: BullMQService;

//   constructor(
//     prisma: PrismaClient,
//     s3Service: S3Service,
//     sqsService: SQSService,
//     ffmpegService: FFmpegService,
//     bullmqService: BullMQService
//   ) {
//     this.prisma = prisma;
//     this.s3Service = s3Service;
//     this.sqsService = sqsService;
//     this.ffmpegService = ffmpegService;
//     this.bullmqService = bullmqService;

//     this.initializeRenderQueue();
//   }

//   private initializeRenderQueue() {
//     this.bullmqService.processJob('render-video', async (job) => {
//       const { renderJobId } = job.data;
//       await this.processRenderJob(renderJobId);
//     });
//   }

//   /**
//    * 🚀 Crée un nouveau job de rendu et l'ajoute à la file d'attente
//    */
//   async createRenderJob(input: CreateRenderJobInput): Promise<RenderJob> {
//     const validatedInput = CreateRenderJobSchema.parse(input);

//     const renderJob = await this.prisma.renderJob.create({
//       data: {
//         ...validatedInput,
//         status: 'PENDING',
//         progress: 0,
//       },
//     });

//     await this.bullmqService.addJob('render-video', { renderJobId: renderJob.id });

//     return this.mapPrismaRenderJob(renderJob);
//   }

//   /**
//    * 🔄 Traite un job de rendu
//    */
//   async processRenderJob(renderJobId: string): Promise<void> {
//     const job = await this.prisma.renderJob.findFirst({ where: { id: renderJobId } });
//     if (!job || job.status !== 'PENDING') {
//       return;
//     }

//     try {
//       await this.prisma.renderJob.update({
//         where: { id: renderJobId },
//         data: { status: 'PROCESSING', startedAt: new Date() },
//       });

//       // Simuler le processus de rendu
//       for (let progress = 0; progress <= 100; progress += 10) {
//         await new Promise(resolve => setTimeout(resolve, 1000)); // Simule le travail
//         await this.updateRenderProgress(renderJobId, progress);
//       }

//       const outputUrl = `https://s3.amazonaws.com/crealia-renders/${job.projectId}/${renderJobId}.${job.format}`;
      
//       await this.prisma.renderJob.update({
//         where: { id: renderJobId },
//         data: {
//           status: 'COMPLETED',
//           progress: 100,
//           outputUrl,
//           completedAt: new Date(),
//         },
//       });
      
//       // Envoyer une notification (ex: via WebSocket)
      
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : String(error);
//       await this.prisma.renderJob.update({
//         where: { id: renderJobId },
//         data: { status: 'FAILED', error: errorMessage },
//       });
//     }
//   }

//   /**
//    * 📊 Met à jour la progression d'un job de rendu
//    */
//   async updateRenderProgress(renderJobId: string, progress: number): Promise<void> {
//     await this.prisma.renderJob.update({
//       where: { id: renderJobId },
//       data: { progress },
//     });
//     // Envoyer la mise à jour de la progression via WebSocket
//   }

//   /**
//    * 📄 Récupère le statut d'un job de rendu
//    */
//   async getRenderJobStatus(renderJobId: string): Promise<RenderJob | null> {
//     const job = await this.prisma.renderJob.findFirst({ where: { id: renderJobId } });
//     return job ? this.mapPrismaRenderJob(job) : null;
//   }

//   /**
//    * ❌ Annule un job de rendu
//    */
//   async cancelRenderJob(renderJobId: string): Promise<boolean> {
//     const job = await this.prisma.renderJob.findFirst({ where: { id: renderJobId } });
//     if (job && (job.status === 'PENDING' || job.status === 'PROCESSING')) {
//       await this.prisma.renderJob.update({
//         where: { id: renderJobId },
//         data: { status: 'CANCELLED' },
//       });
//       // Logique pour arrêter le worker BullMQ si nécessaire
//       return true;
//     }
//     return false;
//   }

//   /**
//    * 🗑️ Supprime un job de rendu
//    */
//   async deleteRenderJob(renderJobId: string): Promise<boolean> {
//     const job = await this.prisma.renderJob.findFirst({ where: { id: renderJobId } });
//     if (job) {
//       if (job.outputUrl) {
//         await this.s3Service.deleteFile(job.outputUrl);
//       }
//       await this.prisma.renderJob.delete({ where: { id: renderJobId } });
//       return true;
//     }
//     return false;
//   }

//   /**
//    * 📋 Récupère les jobs de rendu d'un projet
//    */
//   async getProjectRenderJobs(projectId: string): Promise<RenderJob[]> {
//     const jobs = await this.prisma.renderJob.findMany({
//       where: { projectId },
//       orderBy: { createdAt: 'desc' },
//     });
//     return jobs.map(this.mapPrismaRenderJob);
//   }
  
//   /**
//    * 📈 Récupère les métriques de rendu
//    */
//   async getRenderMetrics(): Promise<any> {
//     const [totalJobs, completedJobs, failedJobs, processingJobs] = await Promise.all([
//       this.prisma.renderJob.count(),
//       this.prisma.renderJob.count({ where: { status: 'COMPLETED' } }),
//       this.prisma.renderJob.count({ where: { status: 'FAILED' } }),
//       this.prisma.renderJob.count({ where: { status: 'PROCESSING' } }),
//     ]);
    
//     const completedJobsWithDuration = await this.prisma.renderJob.findMany({
//       where: { status: 'COMPLETED', startedAt: { not: null }, completedAt: { not: null } },
//     });

//     const averageRenderTime = completedJobsWithDuration.length > 0
//       ? completedJobsWithDuration.reduce((sum, job) => {
//           const duration = job.completedAt!.getTime() - job.startedAt!.getTime();
//           return sum + duration;
//         }, 0) / completedJobsWithDuration.length
//       : 0;

//     return {
//       totalJobs,
//       completedJobs,
//       failedJobs,
//       processingJobs,
//       averageRenderTime, // en millisecondes
//     };
//   }

//   /**
//    * 🔄 Retente un job de rendu échoué
//    */
//   async retryRenderJob(renderJobId: string): Promise<boolean> {
//     const job = await this.prisma.renderJob.findFirst({ where: { id: renderJobId } });
//     if (job && job.status === 'FAILED') {
//       await this.prisma.renderJob.update({
//         where: { id: renderJobId },
//         data: { status: 'PENDING', error: null },
//       });
//       await this.bullmqService.addJob('render-video', { renderJobId });
//       return true;
//     }
//     return false;
//   }

//   /**
//    * 🧹 Nettoie les anciens jobs de rendu
//    */
//   async cleanupOldRenderJobs(daysOld: number = 30): Promise<void> {
//     const cutoffDate = new Date();
//     cutoffDate.setDate(cutoffDate.getDate() - daysOld);

//     const oldJobs = await this.prisma.renderJob.findMany({
//       where: { createdAt: { lt: cutoffDate } },
//     });

//     for (const job of oldJobs) {
//       await this.deleteRenderJob(job.id);
//     }
//   }

//   /**
//    * Met à jour le statut d'un job de rendu (utilisé par un worker externe)
//    */
//   async updateJobStatus(renderJobId: string, status: RenderStatus, progress?: number, error?: string): Promise<void> {
//     await this.prisma.renderJob.update({
//       where: { id: renderJobId },
//       data: { status, progress, error },
//     });
//   }
  
//   /**
//    * Met à jour l'URL de sortie d'un job de rendu (utilisé par un worker externe)
//    */
//   async updateJobOutput(renderJobId: string, outputUrl: string): Promise<void> {
//     await this.prisma.renderJob.update({
//       where: { id: renderJobId },
//       data: { outputUrl, status: 'COMPLETED', progress: 100, completedAt: new Date() },
//     });
//   }

//   private mapPrismaRenderJob(job: PrismaRenderJob): RenderJob {
//     return {
//       ...job,
//       metadata: job.metadata ? JSON.parse(job.metadata as string) : undefined,
//       outputUrl: job.outputUrl ?? undefined,
//       error: job.error ?? undefined,
//       startedAt: job.startedAt ?? undefined,
//       completedAt: job.completedAt ?? undefined,
//     };
//   }
// }
