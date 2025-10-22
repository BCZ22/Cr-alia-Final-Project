// tests/auth.integration.test.js
import { POST as registerHandler } from '../app/api/auth/register/route';
import { POST as loginHandler } from '../app/api/auth/login/route';
import { prisma } from '../backend/lib/prisma';
import bcrypt from 'bcryptjs';

describe('Authentication API Integration Tests', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Test User',
    username: `testuser-${Date.now()}`
  };

  afterAll(async () => {
    // Clean up the test user after all tests are done
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  it('should register a new user successfully', async () => {
    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    const response = await registerHandler(request);
    expect(response.status).toBe(201);

    const body = await response.json();
    expect(body.data.user.email).toBe(testUser.email);
    expect(body.data.user.passwordHash).toBeUndefined(); // Ensure the hash isn't returned

    // Verify the user was created in the database
    const dbUser = await prisma.user.findUnique({ where: { email: testUser.email } });
    expect(dbUser).not.toBeNull();
    expect(dbUser.email).toBe(testUser.email);

    // Verify the password was hashed correctly
    const isPasswordCorrect = await bcrypt.compare(testUser.password, dbUser.passwordHash);
    expect(isPasswordCorrect).toBe(true);
  });

  it('should log in an existing user and return a Set-Cookie header', async () => {
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password }),
    });

    const response = await loginHandler(request);
    expect(response.status).toBe(200);

    // Check for the secure cookie
    const setCookieHeader = response.headers.get('Set-Cookie');
    expect(setCookieHeader).not.toBeNull();
    expect(setCookieHeader).toContain('auth_token=');
    expect(setCookieHeader).toContain('HttpOnly');
    expect(setCookieHeader).toContain('SameSite=Strict');
  });

  it('should fail to log in with a wrong password', async () => {
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: 'wrongpassword' }),
    });

    const response = await loginHandler(request);
    expect(response.status).toBe(401);
  });
});






