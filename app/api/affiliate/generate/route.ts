import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { ensureAffiliateCodeForUser } from "@/lib/affiliate";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const code = await ensureAffiliateCodeForUser(user.id);

    return NextResponse.json({ code }, { status: 200 });
  } catch (error: any) {
    console.error("Error generating affiliate code:", error);
    return NextResponse.json(
      { error: error.message || "server_error" },
      { status: 500 }
    );
  }
}

