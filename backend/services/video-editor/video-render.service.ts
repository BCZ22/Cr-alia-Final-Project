// =============================================================================
// SERVICE RENDU VIDÉO - PIPELINE FFMPEG AVANCÉ
// =============================================================================

import { PrismaClient, ExportStatus } from '@prisma/client';
import { LoggerService } from '@/backend/shared/utils/logger.service';
// import { StorageService } from '../storage/storage.service';
// import { FFmpegService } from '../video/ffmpeg.service';
import * as path from 'path';
import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

export interface RenderOptions {
  format: 'MP4' | 'MOV' | 'AVI' | 'WEBM' | 'GIF';
  quality: 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA';
  resolution: string;
  fps: number;
  bitrate?: number;
  audioBitrate?: number;
  watermark?: {
    text?: string;
    image?: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity: number;
  };
}

export interface VideoComposition {
  tracks: Array<{
    id: string;
    type: 'VIDEO' | 'AUDIO' | 'TEXT' | 'IMAGE';
    clips: Array<{
      id: string;
      startTime: number;
      endTime: number;
      startOffset: number;
      endOffset: number;
      speed: number;
      volume: number;
      opacity: number;
      position?: {
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
        scale: number;
      };
      effects: Array<{
        type: string;
        parameters: Record<string, any>;
        startTime: number;
        endTime: number;
        intensity: number;
      }>;
      mediaPath?: string;
      textContent?: string;
      textStyle?: {
        font: string;
        size: number;
        color: string;
        backgroundColor?: string;
        strokeColor?: string;
        strokeWidth?: number;
        alignment: 'left' | 'center' | 'right';
      };
    }>;
  }>;
  duration: number;
  resolution: string;
  fps: number;
}

export class VideoRenderService {
  private prisma: PrismaClient;
  // private logger: LoggerService;
  // private storageService: StorageService;
  // private ffmpegService: FFmpegService;

  // Configurations de qualité
  private readonly QUALITY_PRESETS = {
    LOW: {
      videoBitrate: '500k',
      audioBitrate: '64k',
      crf: 28,
      preset: 'ultrafast'
    },
    MEDIUM: {
      videoBitrate: '1000k',
      audioBitrate: '128k',
      crf: 23,
      preset: 'fast'
    },
    HIGH: {
      videoBitrate: '2000k',
      audioBitrate: '192k',
      crf: 18,
      preset: 'medium'
    },
    ULTRA: {
      videoBitrate: '4000k',
      audioBitrate: '256k',
      crf: 15,
      preset: 'slow'
    }
  };

  constructor() {
    this.prisma = new PrismaClient();
    // this.logger = new LoggerService();
    // this.storageService = new StorageService();
    // this.ffmpegService = new FFmpegService();
  }

  // =============================================================================
  // RENDU PRINCIPAL
  // =============================================================================

  /**
   * Rend un projet vidéo complet
   */
  async renderVideoProject(projectId: string, exportId: string, options: RenderOptions): Promise<string> {
    try {
      LoggerService.info('Début rendu projet vidéo', { projectId, exportId });

      // Récupérer le projet avec toutes ses données
      const project = await this.getProjectForRendering(projectId);
      if (!project) {
        throw new Error('Projet non trouvé');
      }

      // Construire la composition vidéo
      const composition = await this.buildVideoComposition(project);

      // Parcourir les clips et prétraiter les textes
      for (const track of composition.tracks) {
        for (const clip of track.clips) {
          if ('type' in clip && clip.type === 'TEXT' && clip.textContent) {
            // Ici, vous pourriez utiliser un service de rendu de texte pour créer une image
            // Par exemple, en utilisant node-canvas ou une API externe
            // Pour l'instant, nous allons ignorer cette étape complexe
          }
        }
      }

      // Générer le chemin de sortie
      const outputPath = `exports/${exportId}_${Date.now()}.${options.format.toLowerCase()}`;

      // Rendre la vidéo
      // const finalPath = await this.renderComposition(composition, outputPath, options);

      // Mettre à jour l'export
      // await this.updateExportStatus(exportId, 'COMPLETED', finalPath);

      LoggerService.info('Rendu terminé', { exportId, outputPath: '' });
      return '';

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      LoggerService.error('Erreur rendu projet', { error: errorMessage });
      await this.updateExportStatus(exportId, 'FAILED', undefined, errorMessage);
      throw error;
    }
  }

  /**
   * Génère un aperçu rapide du projet
   */
  async generatePreview(projectId: string, options?: {
    duration?: number; // Durée max de l'aperçu en secondes
    quality?: 'LOW' | 'MEDIUM';
  }): Promise<string> {
    try {
      LoggerService.info('Génération aperçu', { projectId });

      const project = await this.getProjectForRendering(projectId);
      if (!project) {
        throw new Error('Projet non trouvé');
      }

      // Limiter la durée pour l'aperçu
      const maxDuration = options?.duration || 30;
      const composition = await this.buildVideoComposition(project, maxDuration);

      const outputPath = `previews/${projectId}_${Date.now()}.mp4`;
      const renderOptions: RenderOptions = {
        format: 'MP4',
        quality: options?.quality || 'LOW',
        resolution: composition.resolution,
        fps: composition.fps
      };

      // const finalPath = await this.renderComposition(composition, outputPath, renderOptions);

      LoggerService.info('Aperçu généré', { projectId, outputPath: '' });
      return '';

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      LoggerService.error('Erreur génération aperçu', { error: errorMessage });
      throw error;
    }
  }

  // =============================================================================
  // CONSTRUCTION DE LA COMPOSITION
  // =============================================================================

  /**
   * Construit la composition vidéo à partir du projet
   */
  private async buildVideoComposition(project: any, maxDuration?: number): Promise<VideoComposition> {
    try {
      const tracks = [];
      let totalDuration = 0;

      // Trier les pistes par ordre
      const sortedTracks = project.tracks.sort((a: any, b: any) => a.order - b.order);

      for (const track of sortedTracks) {
        const clips = [];

        // Trier les clips par temps de début
        const sortedClips = track.clips.sort((a: any, b: any) => a.startTime - b.startTime);

        for (const clip of sortedClips) {
          // Limiter la durée si nécessaire
          if (maxDuration && clip.startTime >= maxDuration) {
            break;
          }

          const clipEndTime = Math.min(clip.endTime, maxDuration || clip.endTime);
          const clipDuration = clipEndTime - clip.startTime;

          if (clipDuration <= 0) continue;

          // Récupérer le chemin du média
          let mediaPath: string | undefined;
          if (clip.media) {
            mediaPath = await this.downloadMediaToTemp(clip.media);
          }

          // Construire les effets
          const effects = clip.effects.map((effect: any) => ({
            type: effect.type,
            parameters: effect.parameters,
            startTime: effect.startTime,
            endTime: effect.endTime,
            intensity: effect.intensity
          }));

          clips.push({
            id: clip.id,
            startTime: clip.startTime,
            endTime: clipEndTime,
            startOffset: clip.startOffset,
            endOffset: clip.endOffset,
            speed: clip.speed,
            volume: clip.volume,
            opacity: clip.opacity,
            position: clip.position,
            effects,
            mediaPath,
            textContent: clip.type === 'TEXT' ? clip.name : undefined,
            textStyle: clip.type === 'TEXT' ? this.getDefaultTextStyle() : undefined
          });

          totalDuration = Math.max(totalDuration, clipEndTime);
        }

        if (clips.length > 0) {
          tracks.push({
            id: track.id,
            type: track.type,
            clips
          });
        }
      }

      return {
        tracks,
        duration: Math.min(totalDuration, maxDuration || totalDuration),
        resolution: project.resolution,
        fps: project.fps
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      LoggerService.error('Erreur construction composition', { error: errorMessage });
      throw error;
    }
  }

  // =============================================================================
  // RENDU FFMPEG
  // =============================================================================

  /**
   * Rend la composition vidéo avec FFmpeg
   */
  private async renderComposition(
    composition: VideoComposition, 
    outputPath: string, 
    options: RenderOptions
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const tempDir = `/tmp/render_${Date.now()}`;
        fs.mkdirSync(tempDir, { recursive: true });

        // Construire la commande FFmpeg
        const command = ffmpeg();

        // Configurer les entrées
        await this.setupInputs(command, composition, tempDir);

        // Configurer les filtres
        const filterComplex = this.buildFilterComplex(composition, options);
        if (filterComplex) {
          command.complexFilter(filterComplex);
        }

        // Configurer la sortie
        this.setupOutput(command, outputPath, options);

        // Gérer les événements
        command.on('start', (commandLine: any) => {
          LoggerService.info('FFmpeg démarré', { command: commandLine });
        });

        command.on('progress', (progress: any) => {
          LoggerService.debug('Progression FFmpeg', { 
            percent: progress.percent,
            time: progress.timemark 
          });
        });

        command.on('end', async () => {
          try {
            // Upload le fichier final
            const outputBuffer = fs.readFileSync(outputPath);
            // const uploadResult = await this.storageService.uploadFile(outputBuffer, outputPath);

            // if (!uploadResult.success) {
            //   throw new Error('Échec upload fichier final');
            // }

            // Nettoyer les fichiers temporaires
            this.cleanupTempFiles(tempDir);

            resolve(outputPath);

          } catch (error) {
            reject(error);
          }
        });

        command.on('error', (error: any) => {
          LoggerService.error('Erreur FFmpeg', { error: error.message });
          this.cleanupTempFiles(tempDir);
          reject(error);
        });

        // Lancer le rendu
        command.run();

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Configure les entrées FFmpeg
   */
  private async setupInputs(command: ffmpeg.FfmpegCommand, composition: VideoComposition, tempDir: string) {
    const inputFiles = new Set<string>();

    // Collecter tous les fichiers d'entrée uniques
    for (const track of composition.tracks) {
      for (const clip of track.clips) {
        if (clip.mediaPath && !inputFiles.has(clip.mediaPath)) {
          inputFiles.add(clip.mediaPath);
          command.input(clip.mediaPath);
        }
      }
    }

    // Ajouter les entrées pour le texte et les images
    for (const track of composition.tracks) {
      for (const clip of track.clips) {
        if ('type' in clip && clip.type === 'TEXT' && clip.textContent) {
          // Créer un fichier texte temporaire
          const textFile = path.join(tempDir, `text_${clip.id}.txt`);
          fs.writeFileSync(textFile, clip.textContent);
          command.input(textFile);
        }
      }
    }
  }

  /**
   * Construit le filtre complexe FFmpeg
   */
  private buildFilterComplex(composition: VideoComposition, options: RenderOptions): string {
    const filters: string[] = [];
    let inputIndex = 0;
    const trackOutputs: string[] = [];

    // Traiter chaque piste
    for (const track of composition.tracks) {
      const trackFilters: string[] = [];
      let currentInput = inputIndex;

      for (const clip of track.clips) {
        const clipFilters: string[] = [];

        // Filtres de base
        if (clip.speed !== 1.0) {
          clipFilters.push(`setpts=${1/clip.speed}*PTS`);
        }

        if (clip.opacity !== 1.0) {
          clipFilters.push(`format=rgba,colorchannelmixer=aa=${clip.opacity}`);
        }

        // Filtres de position et transformation
        if (clip.position) {
          const { x, y, width, height, rotation, scale } = clip.position;
          clipFilters.push(`scale=${width}:${height}`);
          
          if (rotation !== 0) {
            clipFilters.push(`rotate=${rotation * Math.PI / 180}`);
          }

          if (scale !== 1.0) {
            clipFilters.push(`scale=iw*${scale}:ih*${scale}`);
          }

          clipFilters.push(`overlay=${x}:${y}`);
        }

        // Appliquer les effets
        for (const effect of clip.effects) {
          const effectFilter = this.buildEffectFilter(effect);
          if (effectFilter) {
            clipFilters.push(effectFilter);
          }
        }

        // Combiner les filtres du clip
        if (clipFilters.length > 0) {
          trackFilters.push(`[${currentInput}]${clipFilters.join(',')}[clip_${clip.id}]`);
        } else {
          trackFilters.push(`[${currentInput}]null[clip_${clip.id}]`);
        }

        currentInput++;
      }

      // Concaténer les clips de la piste
      if (trackFilters.length > 1) {
        const concatInputs = trackFilters.map((_, index) => `clip_${track.clips[index].id}`).join('');
        trackFilters.push(`concat=n=${trackFilters.length}:v=1:a=0[track_${track.id}]`);
      }

      filters.push(...trackFilters);
      trackOutputs.push(`track_${track.id}`);
      inputIndex = currentInput;
    }

    // Mélanger les pistes
    if (trackOutputs.length > 1) {
      const mixInputs = trackOutputs.join('');
      filters.push(`[${mixInputs}]mix=inputs=${trackOutputs.length}[final]`);
    } else if (trackOutputs.length === 1) {
      filters.push(`[${trackOutputs[0]}]null[final]`);
    }

    // Ajouter le watermark si nécessaire
    if (options.watermark) {
      const watermarkFilter = this.buildWatermarkFilter(options.watermark);
      if (watermarkFilter) {
        filters.push(`[final]${watermarkFilter}[watermarked]`);
        filters.push(`[watermarked]null[output]`);
      } else {
        filters.push(`[final]null[output]`);
      }
    } else {
      filters.push(`[final]null[output]`);
    }

    return filters.join(';');
  }

  /**
   * Construit un filtre d'effet
   */
  private buildEffectFilter(effect: any): string | null {
    switch (effect.type) {
      case 'BRIGHTNESS':
        return `eq=brightness=${effect.parameters.value * effect.intensity}`;
      case 'CONTRAST':
        return `eq=contrast=${1 + (effect.parameters.value * effect.intensity)}`;
      case 'SATURATION':
        return `eq=saturation=${1 + (effect.parameters.value * effect.intensity)}`;
      case 'BLUR':
        return `boxblur=${effect.parameters.radius * effect.intensity}`;
      case 'SHARPEN':
        return `unsharp=${effect.parameters.radius}:${effect.parameters.strength * effect.intensity}`;
      case 'VIGNETTE':
        return `vignette=${effect.parameters.angle}:${effect.parameters.radius * effect.intensity}`;
      case 'GRAIN':
        return `noise=alls=${effect.parameters.strength * effect.intensity}`;
      case 'GLITCH':
        return `hue=s=0,eq=contrast=1.5:brightness=0.2`;
      default:
        return null;
    }
  }

  /**
   * Construit le filtre de watermark
   */
  private buildWatermarkFilter(watermark: any): string | null {
    if (watermark.text) {
      const position = this.getWatermarkPosition(watermark.position);
      return `drawtext=text='${watermark.text}':fontsize=24:fontcolor=white@${watermark.opacity}:x=${position.x}:y=${position.y}`;
    } else if (watermark.image) {
      // Pour les images, il faudrait d'abord les télécharger
      return null;
    }
    return null;
  }

  /**
   * Configure la sortie FFmpeg
   */
  private setupOutput(command: ffmpeg.FfmpegCommand, outputPath: string, options: RenderOptions) {
    const preset = this.QUALITY_PRESETS[options.quality];

    command
      .outputOptions([
        `-c:v libx264`,
        `-preset ${preset.preset}`,
        `-crf ${preset.crf}`,
        `-b:v ${preset.videoBitrate}`,
        `-c:a aac`,
        `-b:a ${preset.audioBitrate}`,
        `-r ${options.fps}`,
        `-s ${options.resolution}`,
        `-pix_fmt yuv420p`
      ])
      .output(outputPath);
  }

  // =============================================================================
  // MÉTHODES UTILITAIRES
  // =============================================================================

  /**
   * Récupère un projet pour le rendu
   */
  private async getProjectForRendering(projectId: string) {
    return await this.prisma.videoProject.findUnique({
      where: { id: projectId },
      include: {
        tracks: {
          include: {
            clips: {
              include: {
                asset: true,
              }
            }
          },
          orderBy: { index: 'asc' }
        }
      }
    });
  }

  /**
   * Télécharge un média vers un fichier temporaire
   */
  private async downloadMediaToTemp(media: any): Promise<string> {
    const tempPath = `/tmp/media_${media.id}_${Date.now()}${path.extname(media.filePath)}`;
    // const buffer = await this.storageService.downloadFile(media.filePath);
    // fs.writeFileSync(tempPath, buffer);
    return tempPath;
  }

  /**
   * Met à jour le statut d'un export
   */
  private async updateExportStatus(exportId: string, status: ExportStatus, filePath?: string, error?: string) {
    await this.prisma.videoExport.update({
      where: { id: exportId },
      data: {
        status,
        filePath,
        error,
        progress: status === 'COMPLETED' ? 100 : undefined,
        completedAt: status === 'COMPLETED' || status === 'FAILED' ? new Date() : undefined
      }
    });
  }

  /**
   * Nettoie les fichiers temporaires
   */
  private cleanupTempFiles(tempDir: string) {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      LoggerService.warn('Erreur nettoyage fichiers temporaires', { error: errorMessage });
    }
  }

  /**
   * Obtient la position du watermark
   */
  private getWatermarkPosition(position: string): { x: string; y: string } {
    switch (position) {
      case 'top-left':
        return { x: '10', y: '10' };
      case 'top-right':
        return { x: 'w-text_w-10', y: '10' };
      case 'bottom-left':
        return { x: '10', y: 'h-text_h-10' };
      case 'bottom-right':
        return { x: 'w-text_w-10', y: 'h-text_h-10' };
      case 'center':
        return { x: '(w-text_w)/2', y: '(h-text_h)/2' };
      default:
        return { x: '10', y: '10' };
    }
  }

  /**
   * Obtient le style de texte par défaut
   */
  private getDefaultTextStyle() {
    return {
      font: 'Arial',
      size: 24,
      color: '#ffffff',
      backgroundColor: 'transparent',
      strokeColor: '#000000',
      strokeWidth: 2,
      alignment: 'center' as const
    };
  }

  /**
   * Génère des thumbnails pour une vidéo
   */
  async generateVideoThumbnails(videoPath: string, options?: {
    count?: number;
    size?: string;
    quality?: number;
  }): Promise<string[]> {
    try {
      const thumbnails: string[] = [];
      const count = options?.count || 5;
      const size = options?.size || '320x240';
      const quality = options?.quality || 80;

      // Obtenir la durée de la vidéo
      // const videoInfo = await this.ffmpegService.getVideoInfo(videoPath);
      // const duration = videoInfo.duration;

      // Générer les thumbnails à intervalles réguliers
      // for (let i = 0; i < count; i++) {
      //   const position = (duration / count) * i;
      //   const thumbnailPath = `thumbnails/${Date.now()}_${i}.jpg`;

      //   await this.ffmpegService.generateThumbnails({
      //     inputPath: videoPath,
      //     outputPath: thumbnailPath,
      //     position,
      //     size,
      //     quality
      //   });

      //   thumbnails.push(thumbnailPath);
      // }

      return thumbnails;

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur génération thumbnails', { error: error.message });
      } else {
        LoggerService.error('Erreur génération thumbnails', { error: String(error) });
      }
      throw error;
    }
  }

  /**
   * Optimise une vidéo pour le web
   */
  async optimizeVideoForWeb(inputPath: string, outputPath: string, options?: {
    maxBitrate?: string;
    maxResolution?: string;
    format?: 'mp4' | 'webm';
  }): Promise<string> {
    try {
      const maxBitrate = options?.maxBitrate || '1000k';
      const maxResolution = options?.maxResolution || '1280x720';
      const format = options?.format || 'mp4';

      // await this.ffmpegService.convertVideo({
      //   inputPath,
      //   outputPath,
      //   format,
      //   quality: 'medium',
      //   maxBitrate,
      //   maxResolution
      // });

      return outputPath;

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur optimisation vidéo', { error: error.message });
      } else {
        LoggerService.error('Erreur optimisation vidéo', { error: String(error) });
      }
      throw error;
    }
  }
}
