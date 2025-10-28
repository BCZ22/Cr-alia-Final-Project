import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/lib/auth" // Assuming auth options are defined
// import { supabase } from "@/lib/supabase" // Assuming supabase client is initialized

export async function GET(req: NextRequest) {
  // const session = await getServerSession(authOptions);

  // if (!session?.user) {
  //   return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  // }

  try {
    // const { data: conversations, error } = await supabase
    //   .from('conversations')
    //   .select('*')
    //   .eq('userId', session.user.id)
    //   .order('createdAt', { ascending: false });

    // if (error) throw error;

    // Hardcoded data for now
    const conversations = [
        { id: '1', title: 'Reel Idea Brainstorm', createdAt: new Date().toISOString(), userId: '1' },
        { id: '2', title: 'TikTok Script for SaaS', createdAt: new Date().toISOString(), userId: '1' },
    ]

    return NextResponse.json(conversations);
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch conversations' }), { status: 500 });
  }
}
