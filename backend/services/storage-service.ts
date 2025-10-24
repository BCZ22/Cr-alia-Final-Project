/**
 * Storage Service
 * Service unifié pour S3/MinIO avec auto-détection environnement
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command, CopyObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import pino from 'pino';
import { Readable } from 'stream';

const logger = pino({ name: 'storage-service' });

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const isProduction = process.env.NODE_ENV === 'production';
const storageType = process.env.STORAGE_TYPE || (isProduction ? 's3' : 'minio');

const s3Config = storageType === 'minio' ? {
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'minioadmin',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'minioadmin'
  },
  forcePathStyle: true
} : {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
};

const s3Client = new S3Client(s3Config);
const bucket = process.env.S3_BUCKET || 'crealia-dev';

logger.info({ storageType, bucket }, 'Storage service initialized');

// ═══════════════════════════════════════════════════════════════════════════
// BUCKET ORGANIZATION
// ═══════════════════════════════════════════════════════════════════════════

export const STORAGE_PATHS = {
  UPLOADS: 'uploads/',
  PROCESSED: 'processed/',
  THUMBNAILS: 'thumbnails/',
  EXPORTS: 'exports/',
  TEMP: 'temp/'
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// UPLOAD FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  acl?: 'private' | 'public-read';
  cacheControl?: string;
}

export async function uploadFile(
  file: Buffer | Readable,
  key: string,
  options: UploadOptions = {}
): Promise<string> {
  logger.info({ key, options }, 'Uploading file to storage');
  
  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: file,
        ContentType: options.contentType || 'application/octet-stream',
        Metadata: options.metadata,
        ACL: options.acl,
        CacheControl: options.cacheControl || 'max-age=31536000'
      }
    });
    
    upload.on('httpUploadProgress', (progress) => {
      logger.debug({ key, progress }, 'Upload progress');
    });
    
    await upload.done();
    
    const url = getPublicUrl(key);
    logger.info({ key, url }, 'File uploaded successfully');
    
    return url;
    
  } catch (error) {
    logger.error({ error, key }, 'Failed to upload file');
    throw new Error(`Upload failed: ${error.message}`);
  }
}

export async function uploadBuffer(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  return uploadFile(buffer, key, { contentType });
}

export async function uploadStream(
  stream: Readable,
  key: string,
  contentType: string
): Promise<string> {
  return uploadFile(stream, key, { contentType });
}

// ═══════════════════════════════════════════════════════════════════════════
// PRESIGNED URLs
// ═══════════════════════════════════════════════════════════════════════════

export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  logger.info({ key, contentType, expiresIn }, 'Generating presigned upload URL');
  
  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType
    });
    
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    
    logger.info({ key, url }, 'Presigned upload URL generated');
    return url;
    
  } catch (error) {
    logger.error({ error, key }, 'Failed to generate presigned URL');
    throw error;
  }
}

export async function generatePresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  logger.info({ key, expiresIn }, 'Generating presigned download URL');
  
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key
    });
    
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    
    logger.info({ key, url }, 'Presigned download URL generated');
    return url;
    
  } catch (error) {
    logger.error({ error, key }, 'Failed to generate presigned download URL');
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DOWNLOAD FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export async function downloadFile(key: string): Promise<Buffer> {
  logger.info({ key }, 'Downloading file from storage');
  
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key
    });
    
    const response = await s3Client.send(command);
    const stream = response.Body as Readable;
    
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    
    const buffer = Buffer.concat(chunks);
    logger.info({ key, size: buffer.length }, 'File downloaded');
    
    return buffer;
    
  } catch (error) {
    logger.error({ error, key }, 'Failed to download file');
    throw new Error(`Download failed: ${error.message}`);
  }
}

export async function getFileStream(key: string): Promise<Readable> {
  logger.info({ key }, 'Getting file stream');
  
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key
    });
    
    const response = await s3Client.send(command);
    return response.Body as Readable;
    
  } catch (error) {
    logger.error({ error, key }, 'Failed to get file stream');
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FILE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

export async function deleteFile(key: string): Promise<void> {
  logger.info({ key }, 'Deleting file from storage');
  
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key
    });
    
    await s3Client.send(command);
    logger.info({ key }, 'File deleted');
    
  } catch (error) {
    logger.error({ error, key }, 'Failed to delete file');
    throw error;
  }
}

export async function copyFile(sourceKey: string, destinationKey: string): Promise<string> {
  logger.info({ sourceKey, destinationKey }, 'Copying file');
  
  try {
    const command = new CopyObjectCommand({
      Bucket: bucket,
      CopySource: `${bucket}/${sourceKey}`,
      Key: destinationKey
    });
    
    await s3Client.send(command);
    
    const url = getPublicUrl(destinationKey);
    logger.info({ sourceKey, destinationKey, url }, 'File copied');
    
    return url;
    
  } catch (error) {
    logger.error({ error, sourceKey, destinationKey }, 'Failed to copy file');
    throw error;
  }
}

export async function listFiles(prefix: string, maxKeys: number = 1000): Promise<string[]> {
  logger.info({ prefix, maxKeys }, 'Listing files');
  
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: maxKeys
    });
    
    const response = await s3Client.send(command);
    const keys = response.Contents?.map(obj => obj.Key!) || [];
    
    logger.info({ prefix, count: keys.length }, 'Files listed');
    return keys;
    
  } catch (error) {
    logger.error({ error, prefix }, 'Failed to list files');
    throw error;
  }
}

export async function fileExists(key: string): Promise<boolean> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key
    });
    
    await s3Client.send(command);
    return true;
    
  } catch (error: any) {
    if (error.name === 'NoSuchKey') {
      return false;
    }
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function getPublicUrl(key: string): string {
  if (storageType === 'minio') {
    const endpoint = process.env.S3_ENDPOINT || 'http://localhost:9000';
    return `${endpoint}/${bucket}/${key}`;
  } else {
    const region = process.env.AWS_REGION || 'us-east-1';
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  }
}

export function generateKey(prefix: string, filename: string, userId?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  if (userId) {
    return `${prefix}${userId}/${timestamp}-${random}-${sanitized}`;
  }
  
  return `${prefix}${timestamp}-${random}-${sanitized}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  uploadFile,
  uploadBuffer,
  uploadStream,
  generatePresignedUploadUrl,
  generatePresignedDownloadUrl,
  downloadFile,
  getFileStream,
  deleteFile,
  copyFile,
  listFiles,
  fileExists,
  getPublicUrl,
  generateKey,
  STORAGE_PATHS
};
