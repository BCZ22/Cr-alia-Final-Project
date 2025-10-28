import { NextRequest, NextResponse } from 'next/server';
// import { OpenAIStream, StreamingTextResponse } from 'ai';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // This is a placeholder for the real OpenAI API call
    // const response = await openai.chat.completions.create({
    //   model: 'gpt-4',
    //   stream: true,
    //   messages,
    // });
    
    // const stream = OpenAIStream(response);
    // return new StreamingTextResponse(stream);

    // For now, return a simple streamed response
    const stream = new ReadableStream({
      async start(controller) {
        const textEncoder = new TextEncoder();
        const placeholderResponse = "This is a streamed response from the mock API.";
        for (const char of placeholderResponse) {
          controller.enqueue(textEncoder.encode(char));
          await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
        }
        controller.close();
      }
    });

    return new Response(stream);

  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
