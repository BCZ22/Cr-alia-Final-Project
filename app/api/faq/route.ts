export const dynamic = 'force-dynamic';

/**
 * GET /api/faq
 * Get FAQ items
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET(req: NextRequest) {
  try {
    // Get query params
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // Build query
    const where: any = {
      isPublished: true,
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get FAQ items
    const items = await prisma.fAQItem.findMany({
      where,
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
    })

    // Get categories
    const categories = await prisma.fAQItem.findMany({
      where: { isPublished: true },
      select: { category: true },
      distinct: ['category'],
    })

    return NextResponse.json({
      items: items.map((item) => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
        category: item.category,
      })),
      categories: categories.map((c) => c.category).filter(Boolean),
      count: items.length,
    })
  } catch (error) {
    console.error('Get FAQ error:', error)

    return NextResponse.json(
      {
        error: 'Failed to get FAQ items',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

