// =============================================================================
// SERVICE GESTION ASSETS MÉDIA - UPLOAD ET INGESTION
// =============================================================================

import { PrismaClient, AssetType } from '@prisma/client';
import { LoggerService } from '@/backend/shared/utils/logger.service';
// import { StorageService } from '../storage/storage.service';
// import { FFmpegService } from '../video/ffmpeg.service';
// import { QueueService } from '../queue/queue.service';
import * as path from 'path';
import * as fs from 'fs';

export interface UploadOptions {
  filename: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  userId: string;
  isPublic?: boolean;
}

export interface MediaAssetInfo {
  id: string;
  name: string;
  type: 'VIDEO' | 'AUDIO' | 'IMAGE' | 'FONT' | 'TEMPLATE';
  filePath: string;
  fileSize: number;
  duration?: number;
  width?: number;
  height?: number;
  fps?: number;
  bitrate?: number;
  format: string;
  thumbnail?: string;
  waveform?: any;
  metadata?: any;
}

export interface ThumbnailOptions {
  position?: number; // Position en secondes pour les vidéos
  size?: string; // Format: "320x240"
  quality?: number; // 1-100
}

export interface WaveformOptions {
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
}

export class MediaAssetService {
  private prisma: PrismaClient;
  // private logger: LoggerService;
  // private storageService: StorageService;
  // private ffmpegService: FFmpegService;
  // private queueService: QueueService;

  // Formats supportés
  private readonly SUPPORTED_VIDEO_FORMATS = [
    'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm',
    'video/x-ms-wmv', 'video/3gpp', 'video/x-flv', 'video/x-matroska'
  ];

  private readonly SUPPORTED_AUDIO_FORMATS = [
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac',
    'audio/x-m4a', 'audio/webm', 'audio/mp3', 'audio/wave'
  ];

  private readonly SUPPORTED_IMAGE_FORMATS = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp',
    'image/tiff', 'image/svg+xml'
  ];

  constructor() {
    this.prisma = new PrismaClient();
    // this.logger = new LoggerService();
    // this.storageService = new StorageService();
    // this.ffmpegService = new FFmpegService();
    // this.queueService = new QueueService();
  }

  // =============================================================================
  // UPLOAD ET INGESTION
  // =============================================================================

  /**
   * Upload et ingère un fichier média
   */
  async uploadMediaAsset(options: UploadOptions): Promise<MediaAssetInfo> {
    try {
      LoggerService.info('Début upload média', { 
        filename: options.filename, 
        mimetype: options.mimetype,
        size: options.size 
      });

      // Valider le format
      const mediaType = this.getMediaType(options.mimetype);
      if (!mediaType) {
        throw new Error(`Format non supporté: ${options.mimetype}`);
      }

      // Générer un nom de fichier unique
      const fileExtension = path.extname(options.filename);
      const uniqueFilename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}${fileExtension}`;
      const filePath = `media/${options.userId}/${uniqueFilename}`;

      // Upload vers le stockage
      // const uploadResult = await this.storageService.uploadFile(
      //   options.buffer, 
      //   filePath
      // );

      // if (!uploadResult.success) {
      //   throw new Error('Échec de l\'upload vers le stockage');
      // }

      // Analyser le fichier pour extraire les métadonnées
      const metadata = await this.analyzeMediaFile(options.buffer, mediaType);

      // Créer l'enregistrement en base
      const asset = await this.prisma.asset.create({
        data: {
          name: options.filename,
          type: mediaType as AssetType,
          originalName: options.filename,
          filePath: filePath,
          fileSize: BigInt(options.size),
          duration: metadata.duration,
          width: metadata.width,
          height: metadata.height,
          fps: metadata.fps,
          format: fileExtension.substring(1).toUpperCase(),
          metadata: metadata.raw,
          isPublic: options.isPublic || false,
          userId: options.userId,
          mimeType: options.mimetype,
          storageKey: filePath,
        }
      });

      // Générer les assets dérivés en arrière-plan
      await this.generateDerivedAssets(asset.id, mediaType, metadata);

      LoggerService.info('Upload média terminé', { assetId: asset.id });
      return this.formatAssetInfo(asset);

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur upload média', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Upload multiple de fichiers
   */
  async uploadMultipleAssets(files: UploadOptions[]): Promise<MediaAssetInfo[]> {
    try {
      const results: MediaAssetInfo[] = [];
      const errors: string[] = [];

      // Traiter les fichiers en parallèle (limité à 5 simultanés)
      const chunks = this.chunkArray(files, 5);
      
      for (const chunk of chunks) {
        const promises = chunk.map(async (file) => {
          try {
            return await this.uploadMediaAsset(file);
          } catch (error) {
            if (error instanceof Error) {
              errors.push(`${file.filename}: ${error.message}`);
            } else {
              errors.push(`${file.filename}: ${String(error)}`);
            }
            return null;
          }
        });

        const chunkResults = await Promise.all(promises);
        results.push(...chunkResults.filter(result => result !== null));
      }

      if (errors.length > 0) {
        LoggerService.warn('Erreurs lors de l\'upload multiple', { errors });
      }

      return results;

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur upload multiple', { error: error.message });
      }
      throw error;
    }
  }

  // =============================================================================
  // GESTION DES ASSETS
  // =============================================================================

  /**
   * Récupère un asset par ID
   */
  async getMediaAsset(assetId: string, userId: string): Promise<MediaAssetInfo | null> {
    try {
      const asset = await this.prisma.asset.findFirst({
        where: {
          id: assetId,
          OR: [
            { userId },
            { isPublic: true }
          ]
        }
      });

      return asset ? this.formatAssetInfo(asset) : null;

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur récupération asset', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Liste les assets d'un utilisateur
   */
  async listMediaAssets(userId: string, options?: {
    type?: string;
    limit?: number;
    offset?: number;
    search?: string;
    sortBy?: 'name' | 'createdAt' | 'fileSize';
    sortOrder?: 'asc' | 'desc';
  }) {
    try {
      const where: any = { userId };

      if (options?.type) {
        where.type = options.type;
      }

      if (options?.search) {
        where.OR = [
          { name: { contains: options.search, mode: 'insensitive' } },
          { originalName: { contains: options.search, mode: 'insensitive' } }
        ];
      }

      const [assets, total] = await Promise.all([
        this.prisma.asset.findMany({
          where,
          orderBy: {
            [options?.sortBy || 'createdAt']: options?.sortOrder || 'desc'
          },
          take: options?.limit || 20,
          skip: options?.offset || 0
        }),
        this.prisma.asset.count({ where })
      ]);

      return {
        assets: assets.map(asset => this.formatAssetInfo(asset)),
        total,
        hasMore: (options?.offset || 0) + assets.length < total
      };

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur liste assets', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Met à jour un asset
   */
  async updateMediaAsset(assetId: string, userId: string, data: {
    name?: string;
    isPublic?: boolean;
  }) {
    try {
      const asset = await this.prisma.asset.updateMany({
        where: {
          id: assetId,
          userId
        },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });

      if (asset.count === 0) {
        throw new Error('Asset non trouvé');
      }

      LoggerService.info('Asset mis à jour', { assetId });
      return { success: true };

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur mise à jour asset', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Supprime un asset
   */
  async deleteMediaAsset(assetId: string, userId: string) {
    try {
      // Vérifier que l'asset appartient à l'utilisateur
      const asset = await this.prisma.asset.findFirst({
        where: { id: assetId, userId }
      });

      if (!asset) {
        throw new Error('Asset non trouvé');
      }

      // Vérifier qu'il n'est pas utilisé dans des projets
      const usageCount = await this.prisma.videoClip.count({
        where: { assetId: assetId }
      });

      if (usageCount > 0) {
        throw new Error('Asset utilisé dans des projets, impossible de le supprimer');
      }

      // Supprimer le fichier du stockage
      // await this.storageService.deleteFile(asset.filePath);

      // Supprimer les thumbnails et assets dérivés
      // if (asset.thumbnail) {
        // await this.storageService.deleteFile(asset.thumbnail);
      // }

      // Supprimer l'enregistrement
      await this.prisma.asset.delete({
        where: { id: assetId }
      });

      LoggerService.info('Asset supprimé', { assetId });
      return { success: true };

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur suppression asset', { error: error.message });
      }
      throw error;
    }
  }

  // =============================================================================
  // GÉNÉRATION D'ASSETS DÉRIVÉS
  // =============================================================================

  /**
   * Génère une vignette pour un asset
   */
  async generateThumbnail(assetId: string, options?: ThumbnailOptions): Promise<string> {
    try {
      const asset = await this.prisma.asset.findUnique({
        where: { id: assetId }
      });

      if (!asset) {
        throw new Error('Asset non trouvé');
      }

      if (asset.type !== 'VIDEO' && asset.type !== 'IMAGE') {
        throw new Error('Type d\'asset non supporté pour la génération de vignette');
      }

      const thumbnailPath = `thumbnails/${assetId}_${Date.now()}.jpg`;
      const tempInputPath = `/tmp/input_${assetId}`;
      const tempOutputPath = `/tmp/thumb_${assetId}.jpg`;

      // Télécharger le fichier temporairement
      // const fileBuffer = await this.storageService.downloadFile(asset.filePath);
      // fs.writeFileSync(tempInputPath, fileBuffer);

      try {
        if (asset.type === 'VIDEO') {
          // Générer vignette vidéo
          // await this.ffmpegService.generateThumbnails({
          //   inputPath: tempInputPath,
          //   outputPath: tempOutputPath,
          //   position: options?.position || 1,
          //   size: options?.size || '320x240',
          //   quality: options?.quality || 80
          // });
        } else {
          // Redimensionner image
          // await this.ffmpegService.resizeImage({
          //   inputPath: tempInputPath,
          //   outputPath: tempOutputPath,
          //   size: options?.size || '320x240',
          //   quality: options?.quality || 80
          // });
        }

        // Upload la vignette
        // const thumbnailBuffer = fs.readFileSync(tempOutputPath);
        // const uploadResult = await this.storageService.uploadFile(thumbnailBuffer, thumbnailPath);

        // if (!uploadResult.success) {
        //   throw new Error('Échec upload vignette');
        // }

        // Mettre à jour l'asset
        await this.prisma.asset.update({
          where: { id: assetId },
          data: { /* thumbnail: thumbnailPath */ }
        });

        return thumbnailPath;

      } finally {
        // Nettoyer les fichiers temporaires
        if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
        if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
      }

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur génération vignette', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Génère la waveform pour un fichier audio
   */
  async generateWaveform(assetId: string, options?: WaveformOptions): Promise<any> {
    try {
      const asset = await this.prisma.asset.findUnique({
        where: { id: assetId }
      });

      if (!asset || asset.type !== 'AUDIO') {
        throw new Error('Asset audio non trouvé');
      }

      const tempInputPath = `/tmp/audio_${assetId}`;
      const tempOutputPath = `/tmp/waveform_${assetId}.json`;

      // Télécharger le fichier temporairement
      // const fileBuffer = await this.storageService.downloadFile(asset.filePath);
      // fs.writeFileSync(tempInputPath, fileBuffer);

      try {
        // Générer la waveform
        // const waveformData = await this.ffmpegService.generateWaveform({
        //   inputPath: tempInputPath,
        //   outputPath: tempOutputPath,
        //   width: options?.width || 800,
        //   height: options?.height || 200,
        //   color: options?.color || '#ffffff',
        //   backgroundColor: options?.backgroundColor || '#000000'
        // });

        // Mettre à jour l'asset
        await this.prisma.asset.update({
          where: { id: assetId },
          data: { /* waveform: {} */ } // Placeholder for waveform data
        });

        return {}; // Placeholder for waveform data

      } finally {
        // Nettoyer les fichiers temporaires
        if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
        if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
      }

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur génération waveform', { error: error.message });
      }
      throw error;
    }
  }

  // =============================================================================
  // MÉTHODES UTILITAIRES
  // =============================================================================

  /**
   * Détermine le type de média à partir du MIME type
   */
  private getMediaType(mimetype: string): string | null {
    if (this.SUPPORTED_VIDEO_FORMATS.includes(mimetype)) return 'VIDEO';
    if (this.SUPPORTED_AUDIO_FORMATS.includes(mimetype)) return 'AUDIO';
    if (this.SUPPORTED_IMAGE_FORMATS.includes(mimetype)) return 'IMAGE';
    return null;
  }

  /**
   * Analyse un fichier média pour extraire les métadonnées
   */
  private async analyzeMediaFile(buffer: Buffer, mediaType: string): Promise<any> {
    try {
      const tempPath = `/tmp/analyze_${Date.now()}`;
      fs.writeFileSync(tempPath, buffer);

      try {
        if (mediaType === 'VIDEO') {
          // const videoInfo = await this.ffmpegService.getVideoInfo(tempPath);
          return {
            duration: 0, // Placeholder
            width: 0, // Placeholder
            height: 0, // Placeholder
            fps: 0, // Placeholder
            bitrate: 0, // Placeholder
            raw: {} // Placeholder
          };
        } else if (mediaType === 'AUDIO') {
          // const audioInfo = await this.ffmpegService.getAudioInfo(tempPath);
          return {
            duration: 0, // Placeholder
            bitrate: 0, // Placeholder
            raw: {} // Placeholder
          };
        } else if (mediaType === 'IMAGE') {
          // const imageInfo = await this.ffmpegService.getImageInfo(tempPath);
          return {
            width: 0, // Placeholder
            height: 0, // Placeholder
            raw: {} // Placeholder
          };
        }

        return { raw: {} };

      } finally {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur analyse fichier', { error: error.message });
      }
      return { raw: {} };
    }
  }

  /**
   * Génère les assets dérivés en arrière-plan
   */
  private async generateDerivedAssets(assetId: string, mediaType: string, metadata: any) {
    try {
      // Ajouter les jobs de génération à la queue
      if (mediaType === 'VIDEO' || mediaType === 'IMAGE') {
        // await this.queueService.addRenderJob({
        //   type: 'THUMBNAIL_GENERATION',
        //   priority: 'NORMAL',
        //   data: { assetId }
        // });
      }

      if (mediaType === 'AUDIO') {
        // await this.queueService.addRenderJob({
        //   type: 'WAVEFORM_GENERATION',
        //   priority: 'NORMAL',
        //   data: { assetId }
        // });
      }

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur génération assets dérivés', { error: error.message });
      }
    }
  }

  /**
   * Formate les informations d'un asset
   */
  private formatAssetInfo(asset: any): MediaAssetInfo {
    return {
      id: asset.id,
      name: asset.name,
      type: asset.type,
      filePath: asset.filePath,
      fileSize: Number(asset.fileSize),
      duration: asset.duration,
      width: asset.width,
      height: asset.height,
      fps: asset.fps,
      bitrate: asset.bitrate,
      format: asset.format,
      thumbnail: asset.thumbnail,
      waveform: asset.waveform,
      metadata: asset.metadata
    };
  }

  /**
   * Divise un tableau en chunks
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Génère une URL signée pour accéder à un asset
   */
  async getSignedUrl(assetId: string, userId: string, expiresIn: number = 3600): Promise<string> {
    try {
      const asset = await this.prisma.asset.findFirst({
        where: {
          id: assetId,
          OR: [
            { userId },
            { isPublic: true }
          ]
        }
      });

      if (!asset) {
        throw new Error('Asset non trouvé');
      }

      // return await this.storageService.getSignedUrl(asset.filePath, expiresIn);
      return `https://storage.googleapis.com/${asset.filePath}`; // Fallback for now

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur génération URL signée', { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'utilisation des assets
   */
  async getAssetStats(userId: string) {
    try {
      const [totalAssets, totalSize, byType] = await Promise.all([
        this.prisma.asset.count({ where: { userId } }),
        this.prisma.asset.aggregate({
          where: { userId },
          _sum: { fileSize: true }
        }),
        this.prisma.asset.groupBy({
          by: ['type'],
          where: { userId },
          _count: { type: true },
          _sum: { fileSize: true }
        })
      ]);

      return {
        totalAssets,
        totalSize: Number(totalSize._sum.fileSize || 0),
        byType: byType.map(item => ({
          type: item.type,
          count: item._count.type,
          size: Number(item._sum.fileSize || 0)
        }))
      };

    } catch (error) {
      if (error instanceof Error) {
        LoggerService.error('Erreur récupération stats assets', { error: error.message });
      }
      throw error;
    }
  }
}
