import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, size } = await request.json()

    console.log("[v0] Text-to-image API called with:", { prompt, model, size })

    // Mock implementation - returns a demo image
    // Replace this with actual API call to Replicate, Stability AI, or OpenAI DALL·E
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Return a demo image URL
    return NextResponse.json({
      url: "/generated-image.jpg",
      prompt,
      model,
      size,
    })
  } catch (error) {
    console.error("[v0] Text-to-image API error:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
