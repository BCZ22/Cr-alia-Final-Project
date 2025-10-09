import { NextRequest, NextResponse } from 'next/server';
import AIService from '../../../../backend/services/ai/ai.service';
// In a real app, we'd get the user ID from the session.
// import { getSession } from 'next-auth/react';

const aiService = new AIService();

export async function GET(req: NextRequest) {
  try {
    // const session = await getSession({ req });
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // const userId = session.user.id;
    
    // Using a mock user ID for now
    const userId = 'mock-user-id';

    const history = await aiService.getInteractionHistory(userId);

    return NextResponse.json({ ok: true, history: history });
  } catch (error) {
    console.error('Error fetching AI interaction history:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch history', details: errorMessage }, { status: 500 });
  }
}

