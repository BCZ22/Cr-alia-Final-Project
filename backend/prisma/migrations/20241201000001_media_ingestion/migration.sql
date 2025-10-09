-- =============================================================================
-- MIGRATION PRISMA - INGESTION DES MÉDIAS
-- =============================================================================

-- Créer l'enum UploadStatus
CREATE TYPE "UploadStatus" AS ENUM ('PENDING', 'UPLOADING', 'UPLOADED', 'PROCESSING', 'READY', 'FAILED', 'CANCELLED');

-- Créer l'enum ProxyType
CREATE TYPE "ProxyType" AS ENUM ('THUMBNAIL', 'PREVIEW_360P', 'PREVIEW_720P', 'PREVIEW_1080P', 'WAVEFORM', 'SPECTROGRAM', 'SPRITE_SHEET', 'AUDIO_PREVIEW');

-- Créer l'enum IngestionJobStatus
CREATE TYPE "IngestionJobStatus" AS ENUM ('PENDING', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'RETRYING');

-- Créer l'enum IngestionJobType
CREATE TYPE "IngestionJobType" AS ENUM ('METADATA_EXTRACTION', 'THUMBNAIL_GENERATION', 'PROXY_GENERATION', 'WAVEFORM_GENERATION', 'SPECTROGRAM_GENERATION', 'SPRITE_SHEET_GENERATION', 'AUDIO_PREVIEW_GENERATION', 'FULL_INGESTION');

-- Ajouter les nouvelles colonnes à media_assets
ALTER TABLE "media_assets" ADD COLUMN "uploadStatus" "UploadStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "media_assets" ADD COLUMN "storageBucket" TEXT NOT NULL DEFAULT 'incoming';
ALTER TABLE "media_assets" ADD COLUMN "storageKey" TEXT NOT NULL DEFAULT '';
ALTER TABLE "media_assets" ADD COLUMN "etag" TEXT;
ALTER TABLE "media_assets" ADD COLUMN "checksum" TEXT;
ALTER TABLE "media_assets" ADD COLUMN "mimeType" TEXT NOT NULL DEFAULT '';

-- Créer la table asset_metadata
CREATE TABLE "asset_metadata" (
    "id" TEXT NOT NULL,
    "duration" DOUBLE PRECISION,
    "codecVideo" TEXT,
    "codecAudio" TEXT,
    "bitrate" INTEGER,
    "fps" DOUBLE PRECISION,
    "width" INTEGER,
    "height" INTEGER,
    "aspectRatio" TEXT,
    "colorSpace" TEXT,
    "pixelFormat" TEXT,
    "hasHDR" BOOLEAN NOT NULL DEFAULT false,
    "gopSize" INTEGER,
    "container" TEXT,
    "channels" INTEGER,
    "sampleRate" INTEGER,
    "bitrateAudio" INTEGER,
    "colorDepth" INTEGER,
    "hasAlpha" BOOLEAN NOT NULL DEFAULT false,
    "exifData" JSONB,
    "iptcData" JSONB,
    "extraJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "asset_metadata_pkey" PRIMARY KEY ("id")
);

-- Créer la table asset_proxies
CREATE TABLE "asset_proxies" (
    "id" TEXT NOT NULL,
    "type" "ProxyType" NOT NULL,
    "resolution" TEXT,
    "format" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "duration" DOUBLE PRECISION,
    "width" INTEGER,
    "height" INTEGER,
    "quality" INTEGER,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "asset_proxies_pkey" PRIMARY KEY ("id")
);

-- Créer la table ingestion_jobs
CREATE TABLE "ingestion_jobs" (
    "id" TEXT NOT NULL,
    "status" "IngestionJobStatus" NOT NULL DEFAULT 'PENDING',
    "type" "IngestionJobType" NOT NULL,
    "priority" "JobPriority" NOT NULL DEFAULT 'NORMAL',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "logs" JSONB,
    "retries" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "error" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ingestion_jobs_pkey" PRIMARY KEY ("id")
);

-- Ajouter les contraintes de clés étrangères
ALTER TABLE "asset_metadata" ADD CONSTRAINT "asset_metadata_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "asset_proxies" ADD CONSTRAINT "asset_proxies_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ingestion_jobs" ADD CONSTRAINT "ingestion_jobs_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ingestion_jobs" ADD CONSTRAINT "ingestion_jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Créer les index pour les performances
CREATE INDEX "media_assets_uploadStatus_idx" ON "media_assets"("uploadStatus");
CREATE INDEX "media_assets_storageBucket_idx" ON "media_assets"("storageBucket");
CREATE INDEX "asset_metadata_assetId_idx" ON "asset_metadata"("assetId");
CREATE INDEX "asset_proxies_assetId_idx" ON "asset_proxies"("assetId");
CREATE INDEX "asset_proxies_type_idx" ON "asset_proxies"("type");
CREATE INDEX "asset_proxies_resolution_idx" ON "asset_proxies"("resolution");
CREATE INDEX "ingestion_jobs_assetId_idx" ON "ingestion_jobs"("assetId");
CREATE INDEX "ingestion_jobs_status_idx" ON "ingestion_jobs"("status");
CREATE INDEX "ingestion_jobs_type_idx" ON "ingestion_jobs"("type");
CREATE INDEX "ingestion_jobs_userId_idx" ON "ingestion_jobs"("userId");
CREATE INDEX "ingestion_jobs_createdAt_idx" ON "ingestion_jobs"("createdAt");

-- Créer un index unique pour asset_metadata
CREATE UNIQUE INDEX "asset_metadata_assetId_key" ON "asset_metadata"("assetId");
