/**
 * GET /api/crealia/presets
 * Get available presets/templates for tools
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { STUDIO_TOOLS } from '@/lib/studio/tools-config'

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

    // Get tool filter from query params
    const { searchParams } = new URL(req.url)
    const toolId = searchParams.get('tool')

    let presets: any[] = []

    if (toolId) {
      // Get presets for specific tool
      const tool = STUDIO_TOOLS.find((t) => t.id === toolId)
      if (tool && tool.presets) {
        presets = tool.presets.map((preset) => ({
          ...preset,
          tool_id: tool.id,
          tool_name: tool.name,
        }))
      }
    } else {
      // Get all presets from all tools
      STUDIO_TOOLS.forEach((tool) => {
        if (tool.presets) {
          tool.presets.forEach((preset) => {
            presets.push({
              ...preset,
              tool_id: tool.id,
              tool_name: tool.name,
            })
          })
        }
      })
    }

    return NextResponse.json({
      success: true,
      presets,
      count: presets.length,
    })

  } catch (error) {
    console.error('[Créalia Studio] Presets error:', error)

    return NextResponse.json(
      {
        error: 'Failed to get presets',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/crealia/presets
 * Create a custom preset (user-saved configuration)
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

    // Parse body
    const body = await req.json()
    const { tool_id, name, description, params } = body

    // Validate
    if (!tool_id || !name || !params) {
      return NextResponse.json(
        { error: 'Missing required fields: tool_id, name, params' },
        { status: 400 }
      )
    }

    // Create preset
    const preset = {
      id: `preset_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      tool_id,
      name,
      description,
      params,
      user_id: session.user.id,
      created_at: new Date().toISOString(),
    }

    // In production, save to database
    // For now, just return the preset
    console.log(`[Créalia Studio] Custom preset created: ${preset.id}`)

    return NextResponse.json({
      success: true,
      preset,
    })

  } catch (error) {
    console.error('[Créalia Studio] Create preset error:', error)

    return NextResponse.json(
      {
        error: 'Failed to create preset',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

