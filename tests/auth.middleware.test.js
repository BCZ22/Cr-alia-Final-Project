// tests/auth.middleware.test.js
import { middleware } from '../middleware';
import { NextRequest } from 'next/server';
import { SignJWT } from 'jose';

// Mock environment variables
process.env.JWT_SECRET = 'a-very-strong-secret-of-at-least-32-characters';

describe('Authentication Middleware', () => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  async function createToken(payload, expirationTime = '2h') {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(secret);
  }

  it('should return 401 if no token is provided', async () => {
    const req = new NextRequest(new URL('/api/studio/projects', 'http://localhost'));
    const res = await middleware(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.message).toContain('no token provided');
  });

  it('should return 401 if the token is invalid or malformed', async () => {
    const req = new NextRequest(new URL('/api/studio/projects', 'http://localhost'));
    req.cookies.set('auth_token', 'invalid-token-string');
    const res = await middleware(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.message).toContain('invalid token');
  });

  it('should return 401 if the token is expired', async () => {
    const expiredToken = await createToken({ userId: '123' }, '0s');
    const req = new NextRequest(new URL('/api/studio/projects', 'http://localhost'));
    req.cookies.set('auth_token', expiredToken);

    // Wait a moment to ensure the token is expired
    await new Promise(resolve => setTimeout(resolve, 1000));

    const res = await middleware(req);
    expect(res.status).toBe(401);
  });

  it('should call NextResponse.next() if a valid token is provided', async () => {
    const validToken = await createToken({ userId: '123' });
    const req = new NextRequest(new URL('/api/studio/projects', 'http://localhost'));
    req.cookies.set('auth_token', validToken);

    const res = await middleware(req);
    // As we cannot directly spy on NextResponse.next(), 
    // we check if the response has no body and a status indicating success (e.g., 200 family, or no status override).
    // The middleware returns NextResponse.next(), which doesn't set a status code itself, allowing the downstream handler to do so.
    // A simple check is to ensure it's not a 401.
    expect(res.status).not.toBe(401);
  });
});



