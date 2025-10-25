/**
 * POST /api/studio/upload
 * Upload files to Studio
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const fileExtension = file.name.split('.').pop();
    const newFileName = `${randomUUID()}.${fileExtension}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: newFileName,
      ContentType: file.type,
      ContentLength: file.size,
    });
    
    // Pour un usage local avec MinIO ou similaire, nous uploadons directement.
    // Pour une architecture de production, générer une URL pré-signée est préférable.
    
    const buffer = Buffer.from(await file.arrayBuffer());
    
    await s3Client.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: newFileName,
        Body: buffer,
        ContentType: file.type,
    }));

    const fileUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${newFileName}`;

    // Enregistrer l'asset dans la base de données
    const asset = await prisma.asset.create({
      data: {
        name: newFileName,
        originalName: file.name,
        type: file.type.startsWith('video') ? 'VIDEO' : 'IMAGE',
        mimeType: file.type,
        filePath: fileUrl,
        fileSize: file.size,
        storageKey: newFileName,
        status: 'READY',
        userId: session.user.id,
        format: fileExtension || '',
        projectId: projectId, // Lier l'asset au projet
      },
    });

    return NextResponse.json({
        media_id: asset.id,
        media_url: fileUrl,
        message: 'Upload réussi',
        metadata: {
            format: asset.format,
            size: Number(asset.fileSize),
        }
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur d'upload:", error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

