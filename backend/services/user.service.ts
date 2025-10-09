import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaService();
  }

  /**
   * Get user by their ID.
   */
  async getUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  /**
   * Check if a user has enough credits.
   */
  async hasEnoughCredits(userId: string, amount = 1): Promise<boolean> {
    const user = await this.getUserById(userId);
    return !!user && user.credits >= amount;
  }

  /**
   * Deduct credits from a user and create a history record.
   */
  async deductCreditsAndLog(
    userId: string,
    data: { prompt?: string; imageUrl?: string; creditsUsed?: number }
  ): Promise<User> {
    const { prompt, imageUrl, creditsUsed = 1 } = data;

    // Use a transaction to ensure both operations succeed or fail together
    return this.prisma.$transaction(async (tx) => {
      // 1. Deduct credits
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          credits: {
            decrement: creditsUsed,
          },
        },
      });

      if (updatedUser.credits < 0) {
        throw new Error('Insufficient credits.');
      }

      // 2. Create history record
      await tx.history.create({
        data: {
          userId,
          prompt,
          imageUrl,
        },
      });

      return updatedUser;
    });
  }
  
  /**
   * Add credits to a user's account (e.g., after a purchase).
   */
  async addCredits(userId: string, amount: number): Promise<User> {
      return this.prisma.user.update({
          where: { id: userId },
          data: {
              credits: {
                  increment: amount,
              },
          },
      });
  }
}

export default UserService;

