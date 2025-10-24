/**
 * GET /api/crealia/brand
 * Get user's brand kit (logo, colors, fonts)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: NextRequest) {
  try {
    // Authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // In MOCK mode, return sample brand kit
    if (process.env.CREALIA_MOCK === 'true') {
      return NextResponse.json({
        success: true,
        brand_kit: {
          logo_url: '/uploads/brand/logo.png',
          colors: ['#1a73e8', '#34a853', '#fbbc04', '#ea4335'],
          fonts: ['Inter', 'Montserrat'],
          tagline: 'Créez. Innovez. Partagez.',
          assets: [
            {
              type: 'logo',
              url: '/uploads/brand/logo.png',
            },
            {
              type: 'watermark',
              url: '/uploads/brand/watermark.png',
            },
          ],
        },
      })
    }

    // In production, fetch from database
    // For now, return empty brand kit
    return NextResponse.json({
      success: true,
      brand_kit: {
        colors: [],
        fonts: [],
        assets: [],
      },
    })

  } catch (error) {
    console.error('[Créalia Studio] Brand kit error:', error)

    return NextResponse.json(
      {
        error: 'Failed to get brand kit',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/crealia/brand
 * Update user's brand kit
 */
export async function PUT(req: NextRequest) {
  try {
    // Authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse body
    const body = await req.json()
    const { logo_url, colors, fonts, tagline, assets } = body

    const userId = session.user.id

    // In production, save to database
    const brandKit = {
      user_id: userId,
      logo_url,
      colors,
      fonts,
      tagline,
      assets,
      updated_at: new Date().toISOString(),
    }

    console.log(`[Créalia Studio] Brand kit updated for user ${userId}`)

    return NextResponse.json({
      success: true,
      brand_kit: brandKit,
    })

  } catch (error) {
    console.error('[Créalia Studio] Update brand kit error:', error)

    return NextResponse.json(
      {
        error: 'Failed to update brand kit',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/crealia/brand/upload
 * Upload brand assets (logo, watermark, etc.)
 */
export async function POST(req: NextRequest) {
  try {
    // Authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // This would handle multipart/form-data for brand asset uploads
    // Similar to /api/crealia/upload but for brand assets
    
    return NextResponse.json({
      success: true,
      message: 'Brand asset upload endpoint - to be implemented',
    })

  } catch (error) {
    console.error('[Créalia Studio] Brand upload error:', error)

    return NextResponse.json(
      {
        error: 'Failed to upload brand asset',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

