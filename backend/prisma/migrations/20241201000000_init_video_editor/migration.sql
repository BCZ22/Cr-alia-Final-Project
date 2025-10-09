-- =============================================================================
-- MIGRATION PRISMA - INITIALISATION ÉDITEUR VIDÉO AVANCÉ
-- =============================================================================

-- Créer l'enum ProjectVisibility
CREATE TYPE "ProjectVisibility" AS ENUM ('PRIVATE', 'TEAM', 'PUBLIC', 'UNLISTED');

-- Créer l'enum AssetProcessingStatus
CREATE TYPE "AssetProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- Créer l'enum MarkerType
CREATE TYPE "MarkerType" AS ENUM ('MARKER', 'REGION', 'LOOP', 'CHAPTER', 'CUE');

-- Créer l'enum MaskType
CREATE TYPE "MaskType" AS ENUM ('RECTANGLE', 'ELLIPSE', 'PEN', 'BRUSH', 'MAGIC_WAND', 'AUTO');

-- Créer l'enum InterpolationType
CREATE TYPE "InterpolationType" AS ENUM ('LINEAR', 'BEZIER', 'EASE_IN', 'EASE_OUT', 'EASE_IN_OUT', 'HOLD', 'BOUNCE', 'ELASTIC');

-- Créer l'enum TrackType (pour motion tracking)
CREATE TYPE "TrackType" AS ENUM ('POINT', 'PLANAR', 'MULTI_POINT', 'FACE', 'OBJECT');

-- Créer l'enum ColorPresetType
CREATE TYPE "ColorPresetType" AS ENUM ('LUT', 'CURVES', 'COLOR_WHEEL', 'HSL', 'RGB', 'CUSTOM');

-- Ajouter les nouvelles colonnes à video_projects
ALTER TABLE "video_projects" ADD COLUMN "visibility" "ProjectVisibility" NOT NULL DEFAULT 'PRIVATE';
ALTER TABLE "video_projects" ADD COLUMN "colorSpace" TEXT NOT NULL DEFAULT 'rec709';
ALTER TABLE "video_projects" ADD COLUMN "pixelFormat" TEXT NOT NULL DEFAULT 'yuv420p';
ALTER TABLE "video_projects" ADD COLUMN "timelineData" JSONB;
ALTER TABLE "video_projects" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "video_projects" ADD COLUMN "parentId" TEXT;

-- Ajouter les nouvelles colonnes à media_assets
ALTER TABLE "media_assets" ADD COLUMN "codec" TEXT;
ALTER TABLE "media_assets" ADD COLUMN "colorSpace" TEXT;
ALTER TABLE "media_assets" ADD COLUMN "pixelFormat" TEXT;
ALTER TABLE "media_assets" ADD COLUMN "hasAlpha" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "media_assets" ADD COLUMN "proxies" JSONB;
ALTER TABLE "media_assets" ADD COLUMN "spectrogram" JSONB;
ALTER TABLE "media_assets" ADD COLUMN "metadata" JSONB;
ALTER TABLE "media_assets" ADD COLUMN "tags" TEXT[];
ALTER TABLE "media_assets" ADD COLUMN "isProcessed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "media_assets" ADD COLUMN "processingStatus" "AssetProcessingStatus" NOT NULL DEFAULT 'PENDING';

-- Créer la table project_snapshots
CREATE TABLE "project_snapshots" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "timelineData" JSONB NOT NULL,
    "thumbnail" TEXT,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "project_snapshots_pkey" PRIMARY KEY ("id")
);

-- Créer la table project_markers
CREATE TABLE "project_markers" (
    "id" TEXT NOT NULL,
    "timeMs" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#FF0000',
    "note" TEXT,
    "type" "MarkerType" NOT NULL DEFAULT 'MARKER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "project_markers_pkey" PRIMARY KEY ("id")
);

-- Créer la table project_comments
CREATE TABLE "project_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timeMs" DOUBLE PRECISION,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "type" "CommentType" NOT NULL DEFAULT 'COMMENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "project_comments_pkey" PRIMARY KEY ("id")
);

-- Créer la table asset_masks
CREATE TABLE "asset_masks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MaskType" NOT NULL,
    "pathData" JSONB NOT NULL,
    "feather" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expansion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "invert" BOOLEAN NOT NULL DEFAULT false,
    "opacity" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "asset_masks_pkey" PRIMARY KEY ("id")
);

-- Créer la table keyframes
CREATE TABLE "keyframes" (
    "id" TEXT NOT NULL,
    "property" TEXT NOT NULL,
    "timeMs" DOUBLE PRECISION NOT NULL,
    "value" JSONB NOT NULL,
    "interpolation" "InterpolationType" NOT NULL DEFAULT 'LINEAR',
    "easeIn" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "easeOut" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bezierHandles" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clipId" TEXT NOT NULL,

    CONSTRAINT "keyframes_pkey" PRIMARY KEY ("id")
);

-- Créer la table motion_tracks
CREATE TABLE "motion_tracks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TrackType" NOT NULL,
    "points" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "isStabilized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clipId" TEXT NOT NULL,

    CONSTRAINT "motion_tracks_pkey" PRIMARY KEY ("id")
);

-- Créer la table text_templates
CREATE TABLE "text_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "style" JSONB NOT NULL,
    "animation" JSONB,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "text_templates_pkey" PRIMARY KEY ("id")
);

-- Créer la table color_presets
CREATE TABLE "color_presets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ColorPresetType" NOT NULL,
    "data" JSONB NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "color_presets_pkey" PRIMARY KEY ("id")
);

-- Créer la table effect_library
CREATE TABLE "effect_library" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "parameters" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "effect_library_pkey" PRIMARY KEY ("id")
);

-- Créer la table collaboration_sessions
CREATE TABLE "collaboration_sessions" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cursorPosition" JSONB,
    "selectedElement" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "collaboration_sessions_pkey" PRIMARY KEY ("id")
);

-- Ajouter les contraintes de clés étrangères
ALTER TABLE "video_projects" ADD CONSTRAINT "video_projects_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "video_projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "project_snapshots" ADD CONSTRAINT "project_snapshots_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "video_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_snapshots" ADD CONSTRAINT "project_snapshots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "project_markers" ADD CONSTRAINT "project_markers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "video_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_markers" ADD CONSTRAINT "project_markers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "project_comments" ADD CONSTRAINT "project_comments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "video_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_comments" ADD CONSTRAINT "project_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_comments" ADD CONSTRAINT "project_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "project_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "asset_masks" ADD CONSTRAINT "asset_masks_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "asset_masks" ADD CONSTRAINT "asset_masks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "keyframes" ADD CONSTRAINT "keyframes_clipId_fkey" FOREIGN KEY ("clipId") REFERENCES "video_clips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "motion_tracks" ADD CONSTRAINT "motion_tracks_clipId_fkey" FOREIGN KEY ("clipId") REFERENCES "video_clips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "text_templates" ADD CONSTRAINT "text_templates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "color_presets" ADD CONSTRAINT "color_presets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "effect_library" ADD CONSTRAINT "effect_library_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "collaboration_sessions" ADD CONSTRAINT "collaboration_sessions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "video_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "collaboration_sessions" ADD CONSTRAINT "collaboration_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Créer les index pour les performances
CREATE INDEX "video_projects_visibility_idx" ON "video_projects"("visibility");
CREATE INDEX "media_assets_processingStatus_idx" ON "media_assets"("processingStatus");
CREATE INDEX "project_snapshots_projectId_idx" ON "project_snapshots"("projectId");
CREATE INDEX "project_snapshots_userId_idx" ON "project_snapshots"("userId");
CREATE INDEX "project_snapshots_createdAt_idx" ON "project_snapshots"("createdAt");
CREATE INDEX "project_markers_projectId_idx" ON "project_markers"("projectId");
CREATE INDEX "project_markers_timeMs_idx" ON "project_markers"("timeMs");
CREATE INDEX "project_markers_type_idx" ON "project_markers"("type");
CREATE INDEX "project_comments_projectId_idx" ON "project_comments"("projectId");
CREATE INDEX "project_comments_userId_idx" ON "project_comments"("userId");
CREATE INDEX "project_comments_timeMs_idx" ON "project_comments"("timeMs");
CREATE INDEX "project_comments_createdAt_idx" ON "project_comments"("createdAt");
CREATE INDEX "asset_masks_assetId_idx" ON "asset_masks"("assetId");
CREATE INDEX "asset_masks_userId_idx" ON "asset_masks"("userId");
CREATE INDEX "keyframes_clipId_idx" ON "keyframes"("clipId");
CREATE INDEX "keyframes_property_idx" ON "keyframes"("property");
CREATE INDEX "keyframes_timeMs_idx" ON "keyframes"("timeMs");
CREATE INDEX "motion_tracks_clipId_idx" ON "motion_tracks"("clipId");
CREATE INDEX "motion_tracks_type_idx" ON "motion_tracks"("type");
CREATE INDEX "text_templates_userId_idx" ON "text_templates"("userId");
CREATE INDEX "text_templates_category_idx" ON "text_templates"("category");
CREATE INDEX "text_templates_isPublic_idx" ON "text_templates"("isPublic");
CREATE INDEX "color_presets_userId_idx" ON "color_presets"("userId");
CREATE INDEX "color_presets_type_idx" ON "color_presets"("type");
CREATE INDEX "color_presets_category_idx" ON "color_presets"("category");
CREATE INDEX "color_presets_isPublic_idx" ON "color_presets"("isPublic");
CREATE INDEX "effect_library_userId_idx" ON "effect_library"("userId");
CREATE INDEX "effect_library_category_idx" ON "effect_library"("category");
CREATE INDEX "effect_library_isPublic_idx" ON "effect_library"("isPublic");
CREATE INDEX "collaboration_sessions_projectId_idx" ON "collaboration_sessions"("projectId");
CREATE INDEX "collaboration_sessions_userId_idx" ON "collaboration_sessions"("userId");

-- Créer un index unique pour collaboration_sessions
CREATE UNIQUE INDEX "collaboration_sessions_projectId_userId_key" ON "collaboration_sessions"("projectId", "userId");
