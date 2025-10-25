import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { subDays } from 'date-fns';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const thirtyDaysAgo = subDays(new Date(), 30);

    // 1. Active Users (users who performed an action recently)
    // For simplicity, we'll count users who created a generation in the last 30 days.
    const activeUsersResult = await prisma.generation.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });
    const usersActive = activeUsersResult.length;

    // 2. Creations
    const creations = await prisma.generation.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });
    
    // 3. Timeseries data for creations
    const creationsByDay = await prisma.generation.groupBy({
        by: ['createdAt'],
        where: {
            createdAt: {
                gte: thirtyDaysAgo,
            },
        },
        _count: {
            id: true,
        },
        orderBy: {
            createdAt: 'asc',
        }
    });

    // We'd need a more robust way to group by day, this is a simplification.
    // Let's format it for the chart.
    const timeseries = creationsByDay.map(day => ({
        date: day.createdAt.toISOString().split('T')[0],
        value: day._count.id,
    }));


    // 4. Top Tools
    const topToolsResult = await prisma.generation.groupBy({
      by: ['tool'],
      _count: {
        tool: true,
      },
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
        tool: {
          not: null,
        },
      },
      orderBy: {
        _count: {
          tool: 'desc',
        },
      },
      take: 3,
    });
    const topTools = topToolsResult.map(item => ({
        tool: item.tool,
        count: item._count.tool
    }));


    const summaryData = {
      usersActive,
      creations,
      revenue: 0, // Still mocked
      timeseries,
      topTools,
    };

    return NextResponse.json(summaryData);
  } catch (error) {
    console.error('[API] Error fetching analytics summary:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics summary' }, { status: 500 });
  }
}

