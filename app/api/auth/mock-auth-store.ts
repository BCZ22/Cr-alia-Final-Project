// This is a temporary mock user store to be used while the DB connection is blocked.
import crypto from 'crypto';

export const mockUserStore = new Map<string, any>();

// Pre-populate with a user for testing purposes
const testEmail = 'test@example.com';
mockUserStore.set(testEmail, {
    email: testEmail,
    id: `user_${crypto.randomBytes(4).toString('hex')}`,
    passwordHash: null, // No password initially
    passwordResetToken: null,
    passwordResetTokenExpiry: null,
});
