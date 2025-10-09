import { NextRequest, NextResponse } from 'next/server';

export async function requireAuth(request: NextRequest) {
  // Mock implementation - always return null (no auth required for now)
  return null;
}

export const authMiddleware = requireAuth;
