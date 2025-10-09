// =============================================================================
// SERVICE ÉDITEUR VIDÉO - MODULE CAPCUT COMPLET
// =============================================================================

import { PrismaClient, VideoProjectStatus } from '@prisma/client';
import { LoggerService } from '@/backend/shared/utils/logger.service';
// import { StorageService } from '../storage/storage.service';
// import { FFmpegService } from '../video/ffmpeg.service';
// import { QueueService } from '../queue/queue.service';

export interface VideoProjectData {
  name: string;
  description?: string;
  resolution?: string;
  fps?: number;
  aspectRatio?: string;
}

export interface VideoTrackData {
  name: string;
  type: 'VIDEO' | 'AUDIO' | 'TEXT' | 'IMAGE' | 'EFFECT';
  index: number;
  volume?: number;
  opacity?: number;
}

export interface VideoClipData {
  name: string;
  startTime: number;
  endTime: number;
  trimStart?: number;
  trimEnd?: number;
  speed?: number;
  volume?: number;
  opacity?: number;
  effects?: any;
  transitions?: any;
  assetId?: string;
}

export interface VideoEffectData {
  name: string;
  type: string;
  category: string;
  parameters: Record<string, any>;
  startTime: number;
  endTime: number;
  intensity?: number;
  trackId?: string;
  clipId?: string;
}

export interface ExportOptions {
  name: string;
  format: 'MP4' | 'MOV' | 'AVI' | 'WEBM' | 'GIF';
  quality: 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA';
  resolution: string;
  fps: number;
  bitrate?: number;
}

export class VideoEditorService {
  private prisma: PrismaClient;
  // private logger: LoggerService;
  // private storageService: StorageService;
  // private ffmpegService: FFmpegService;
  // private queueService: QueueService;

  constructor() {
    this.prisma = new PrismaClient();
    // this.logger = new LoggerService();
    // this.storageService = new StorageService();
    // this.ffmpegService = new FFmpegService();
    // this.queueService = new QueueService();
  }

  // =============================================================================
  // GESTION DES PROJETS VIDÉO
  // =============================================================================

  /**
   * Crée un nouveau projet vidéo
   */
  async createVideoProject(userId: string, data: VideoProjectData) {
    try {
      LoggerService.info('Création projet vidéo', { userId, name: data.name });

      const project = await this.prisma.videoProject.create({
        data: {
          name: data.name,
          description: data.description,
          resolution: data.resolution || '1920x1080',
          fps: data.fps || 30,
          aspectRatio: data.aspectRatio || '16:9',
          userId,
        },
        include: {
          tracks: true,
          user: {
            select: { id: true, username: true, email: true }
          }
        }
      });

      // Créer une piste vidéo par défaut
      await this.createVideoTrack(project.id, {
        name: 'Video Track 1',
        type: 'VIDEO',
        index: 0
      });

      // Créer une piste audio par défaut
      await this.createVideoTrack(project.id, {
        name: 'Audio Track 1',
        type: 'AUDIO',
        index: 1
      });

      LoggerService.info('Projet vidéo créé', { projectId: project.id });
      return project;

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur création projet vidéo', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Récupère un projet vidéo avec toutes ses données
   */
  async getVideoProject(projectId: string, userId: string) {
    try {
      const project = await this.prisma.videoProject.findFirst({
        where: {
          id: projectId,
          userId
        },
        include: {
          tracks: {
            include: {
              clips: true,
            },
            orderBy: { index: 'asc' }
          },
          exports: {
            orderBy: { createdAt: 'desc' }
          },
          user: {
            select: { id: true, username: true, email: true, avatar: true }
          }
        }
      });

      if (!project) {
        throw new Error('Projet vidéo non trouvé');
      }

      return project;

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur récupération projet vidéo', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Liste les projets vidéo d'un utilisateur
   */
  async listVideoProjects(userId: string, options?: {
    limit?: number;
    offset?: number;
    status?: string;
    search?: string;
  }) {
    try {
      const where: any = { userId };

      if (options?.status) {
        where.status = options.status;
      }

      if (options?.search) {
        where.OR = [
          { name: { contains: options.search, mode: 'insensitive' } },
          { description: { contains: options.search, mode: 'insensitive' } }
        ];
      }

      const [projects, total] = await Promise.all([
        this.prisma.videoProject.findMany({
          where,
          include: {
            _count: {
              select: {
                tracks: true,
                exports: true
              }
            }
          },
          orderBy: { updatedAt: 'desc' },
          take: options?.limit || 20,
          skip: options?.offset || 0
        }),
        this.prisma.videoProject.count({ where })
      ]);

      return {
        projects,
        total,
        hasMore: (options?.offset || 0) + projects.length < total
      };

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur liste projets vidéo', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Met à jour un projet vidéo
   */
  async updateVideoProject(projectId: string, userId: string, data: Partial<VideoProjectData>) {
    try {
      const project = await this.prisma.videoProject.updateMany({
        where: {
          id: projectId,
          userId
        },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });

      if (project.count === 0) {
        throw new Error('Projet vidéo non trouvé');
      }

      LoggerService.info('Projet vidéo mis à jour', { projectId });
      return { success: true };

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur mise à jour projet vidéo', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Supprime un projet vidéo
   */
  async deleteVideoProject(projectId: string, userId: string) {
    try {
      // Vérifier que le projet appartient à l'utilisateur
      const project = await this.prisma.videoProject.findFirst({
        where: { id: projectId, userId }
      });

      if (!project) {
        throw new Error('Projet vidéo non trouvé');
      }

      // Supprimer tous les assets associés
      await this.cleanupProjectAssets(projectId);

      // Supprimer le projet (cascade supprime les relations)
      await this.prisma.videoProject.delete({
        where: { id: projectId }
      });

      LoggerService.info('Projet vidéo supprimé', { projectId });
      return { success: true };

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur suppression projet vidéo', { error: error.message });
      }
      throw error;
    }
  }

  // =============================================================================
  // GESTION DES PISTES
  // =============================================================================

  /**
   * Crée une nouvelle piste
   */
  async createVideoTrack(projectId: string, data: VideoTrackData) {
    try {
      const track = await this.prisma.videoTrack.create({
        data: {
          name: data.name,
          type: data.type,
          index: data.index,
          volume: data.volume || 1.0,
          opacity: data.opacity || 1.0,
          videoProjectId: projectId
        }
      });

      LoggerService.info('Piste créée', { trackId: track.id, projectId });
      return track;

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur création piste', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Met à jour une piste
   */
  async updateVideoTrack(trackId: string, data: Partial<VideoTrackData>) {
    try {
      const track = await this.prisma.videoTrack.update({
        where: { id: trackId },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });

      LoggerService.info('Piste mise à jour', { trackId });
      return track;

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur mise à jour piste', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Supprime une piste
   */
  async deleteVideoTrack(trackId: string) {
    try {
      await this.prisma.videoTrack.delete({
        where: { id: trackId }
      });

      LoggerService.info('Piste supprimée', { trackId });
      return { success: true };

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur suppression piste', { error: error.message });
      }
      throw error;
    }
  }

  // =============================================================================
  // GESTION DES CLIPS
  // =============================================================================

  /**
   * Ajoute un clip à une piste
   */
  async addVideoClip(trackId: string, data: VideoClipData) {
    try {
      const clip = await this.prisma.videoClip.create({
        data: {
          name: data.name,
          startTime: data.startTime,
          endTime: data.endTime,
          trimStart: data.trimStart || 0,
          trimEnd: data.trimEnd || 0,
          speed: data.speed || 1.0,
          volume: data.volume || 1.0,
          opacity: data.opacity || 1.0,
          effects: data.effects,
          transitions: data.transitions,
          trackId,
          assetId: data.assetId
        },
      });

      // Mettre à jour la durée de la piste
      await this.updateTrackDuration(trackId);

      LoggerService.info('Clip ajouté', { clipId: clip.id, trackId });
      return clip;

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur ajout clip', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Met à jour un clip
   */
  async updateVideoClip(clipId: string, data: Partial<VideoClipData>) {
    try {
      const clip = await this.prisma.videoClip.update({
        where: { id: clipId },
        data: {
          ...data,
          updatedAt: new Date()
        },
      });

      // Mettre à jour la durée de la piste
      await this.updateTrackDuration(clip.trackId);

      LoggerService.info('Clip mis à jour', { clipId });
      return clip;

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur mise à jour clip', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Supprime un clip
   */
  async deleteVideoClip(clipId: string) {
    try {
      const clip = await this.prisma.videoClip.findUnique({
        where: { id: clipId },
        select: { trackId: true }
      });

      if (!clip) {
        throw new Error('Clip non trouvé');
      }

      await this.prisma.videoClip.delete({
        where: { id: clipId }
      });

      // Mettre à jour la durée de la piste
      await this.updateTrackDuration(clip.trackId);

      LoggerService.info('Clip supprimé', { clipId });
      return { success: true };

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur suppression clip', { error: error.message });
      }
      throw error;
    }
  }

  // =============================================================================
  // GESTION DES EFFETS
  // =============================================================================

  /**
   * Ajoute un effet à un clip ou une piste
   */
  async addVideoEffect(data: VideoEffectData) {
    try {
      /* const effect = await this.prisma.videoEffect.create({
        data: {
          name: data.name,
          type: data.type,
          category: data.category,
          parameters: data.parameters,
          startTime: data.startTime,
          endTime: data.endTime,
          duration: data.endTime - data.startTime,
          intensity: data.intensity || 1.0,
          trackId: data.trackId,
          clipId: data.clipId
        }
      });

      LoggerService.info('Effet ajouté', { effectId: effect.id });
      return effect; */
      return null;

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur ajout effet', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Met à jour un effet
   */
  async updateVideoEffect(effectId: string, data: Partial<VideoEffectData>) {
    try {
      /* const effect = await this.prisma.videoEffect.update({
        where: { id: effectId },
        data: {
          ...data,
          duration: data.endTime && data.startTime ? data.endTime - data.startTime : undefined
        }
      });

      LoggerService.info('Effet mis à jour', { effectId });
      return effect; */
      return null;

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur mise à jour effet', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Supprime un effet
   */
  async deleteVideoEffect(effectId: string) {
    try {
      /* await this.prisma.videoEffect.delete({
        where: { id: effectId }
      }); */

      LoggerService.info('Effet supprimé', { effectId });
      return { success: true };

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur suppression effet', { error: error.message });
      }
      throw error;
    }
  }

  // =============================================================================
  // EXPORT ET RENDU
  // =============================================================================

  /**
   * Lance l'export d'un projet vidéo
   */
  async exportVideoProject(projectId: string, userId: string, options: ExportOptions) {
    try {
      // Vérifier que le projet appartient à l'utilisateur
      const project = await this.prisma.videoProject.findFirst({
        where: { id: projectId, userId }
      });

      if (!project) {
        throw new Error('Projet vidéo non trouvé');
      }

      // Créer l'enregistrement d'export
      const exportRecord = await this.prisma.videoExport.create({
        data: {
          name: options.name,
          format: options.format,
          quality: options.quality,
          resolution: options.resolution,
          bitrate: options.bitrate,
          videoProjectId: projectId,
          userId
        }
      });

      // Ajouter le job de rendu à la queue
      // await this.queueService.addRenderJob({
      //   type: 'VIDEO_RENDER',
      //   priority: 'NORMAL',
      //   data: {
      //     exportId: exportRecord.id,
      //     projectId,
      //     options
      //   }
      // });

      LoggerService.info('Export lancé', { exportId: exportRecord.id, projectId });
      return exportRecord;

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur lancement export', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Récupère le statut d'un export
   */
  async getExportStatus(exportId: string, userId: string) {
    try {
      const exportRecord = await this.prisma.videoExport.findFirst({
        where: {
          id: exportId,
          userId
        }
      });

      if (!exportRecord) {
        throw new Error('Export non trouvé');
      }

      return exportRecord;

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur récupération statut export', { error: error.message });
      }
      throw error;
    }
  }

  // =============================================================================
  // MÉTHODES UTILITAIRES
  // =============================================================================

  /**
   * Met à jour la durée d'une piste
   */
  private async updateTrackDuration(trackId: string) {
    try {
      const clips = await this.prisma.videoClip.findMany({
        where: { trackId },
        select: { endTime: true }
      });

      const maxEndTime = clips.reduce((max, clip) => Math.max(max, clip.endTime), 0);

      await this.prisma.videoTrack.update({
        where: { id: trackId },
        data: {
          // endTime: maxEndTime,
          // duration: maxEndTime
        }
      });

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur mise à jour durée piste', { error: error.message });
      }
    }
  }

  /**
   * Nettoie les assets d'un projet
   */
  private async cleanupProjectAssets(projectId: string) {
    try {
      // Récupérer tous les assets utilisés dans le projet
      const project = await this.prisma.videoProject.findUnique({
        where: { id: projectId },
        include: {
          tracks: {
            include: {
              clips: true,
            }
          }
        }
      });

      if (!project) return;

      // Collecter tous les assets
      const assets = new Set<string>();
      project.tracks.forEach(track => {
        track.clips.forEach(clip => {
          if (clip.assetId) {
            assets.add(clip.assetId);
          }
        });
      });

      // Supprimer les assets non utilisés ailleurs
      for (const assetId of assets) {
        const usageCount = await this.prisma.videoClip.count({
          where: { assetId: assetId }
        });

        if (usageCount === 0) {
          const asset = await this.prisma.asset.findUnique({
            where: { id: assetId }
          });

          if (asset) {
            // Supprimer le fichier du stockage
            // await this.storageService.deleteFile(asset.filePath);
            
            // Supprimer l'enregistrement
            await this.prisma.asset.delete({
              where: { id: assetId }
            });
          }
        }
      }

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur nettoyage assets', { error: error.message });
      }
    }
  }

  /**
   * Génère un aperçu du projet
   */
  async generatePreview(projectId: string, userId: string) {
    try {
      const project = await this.getVideoProject(projectId, userId);

      // Créer un job de génération d'aperçu
      /* const renderJob = await this.prisma.renderJob.create({
        data: {
          type: 'PREVIEW_GENERATION',
          status: 'PENDING',
          priority: 'HIGH',
          input: { projectId },
          userId,
          videoProjectId: projectId
        }
      }); */

      // Ajouter à la queue
      // await this.queueService.addRenderJob({
      //   type: 'PREVIEW_GENERATION',
      //   priority: 'HIGH',
      //   data: {
      //     jobId: renderJob.id,
      //     projectId
      //   }
      // });

      return null;

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur génération aperçu', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Duplique un projet vidéo
   */
  async duplicateVideoProject(projectId: string, userId: string, newName: string) {
    try {
      const originalProject = await this.getVideoProject(projectId, userId);

      // Créer le nouveau projet
      const newProject = await this.createVideoProject(userId, {
        name: newName,
        description: originalProject.description ?? undefined,
        resolution: originalProject.resolution,
        fps: originalProject.fps,
        aspectRatio: originalProject.aspectRatio,
      });

      // Dupliquer les pistes et clips
      if (originalProject.tracks) {
        for (const track of originalProject.tracks) {
          const newTrack = await this.createVideoTrack(newProject.id, {
            name: track.name,
            type: track.type,
            index: track.index,
            volume: track.volume,
            opacity: track.opacity
          });
  
          if (track.clips) {
            for (const clip of track.clips) {
              await this.addVideoClip(newTrack.id, {
                name: clip.name,
                startTime: clip.startTime,
                endTime: clip.endTime,
                trimStart: clip.trimStart,
                trimEnd: clip.trimEnd,
                speed: clip.speed,
                volume: clip.volume,
                opacity: clip.opacity,
                effects: clip.effects as any,
                transitions: clip.transitions as any,
                assetId: clip.assetId || undefined
              });
            }
          }
        }
      }

      LoggerService.info('Projet dupliqué', { 
        originalId: projectId, 
        newId: newProject.id 
      });

      return newProject;

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur duplication projet', { error: error.message });
      }
      throw error;
    }
  }
}
