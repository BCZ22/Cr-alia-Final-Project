/**
 * GET /api/discord/invite
 * Get Discord invite link
 */

import { NextRequest, NextResponse } from 'next/server'
import { getDiscordInviteLink } from '@/lib/discord/client'

export async function GET(req: NextRequest) {
  try {
    const inviteUrl = getDiscordInviteLink()

    return NextResponse.json({
      inviteUrl,
    })
  } catch (error) {
    console.error('Get Discord invite error:', error)

    return NextResponse.json(
      {
        error: 'Failed to get Discord invite',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

