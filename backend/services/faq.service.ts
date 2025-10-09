import { PrismaClient, FAQ } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';
import { slugify } from '../../lib/utils'; // Assuming a slugify utility exists

// A simple Prisma model for FAQ would look like this:
// model FAQ {
//   id        String   @id @default(cuid())
//   slug      String   @unique
//   question  String
//   answer    String
//   isActive  Boolean  @default(true)
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }

export interface CreateFAQData {
  question: string;
  answer: string;
}

export interface UpdateFAQData {
  question?: string;
  answer?: string;
  isActive?: boolean;
}

export class FAQService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaService();
  }

  /**
   * Get all active FAQs.
   */
  async getFAQs(): Promise<FAQ[]> {
    return this.prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  
  /**
   * Get a single FAQ by its slug.
   */
  async getFAQBySlug(slug: string): Promise<FAQ | null> {
    return this.prisma.fAQ.findUnique({
      where: { slug },
    });
  }

  /**
   * Create a new FAQ.
   * Note: In a real app, this should be restricted to ADMIN users.
   */
  async createFAQ(data: CreateFAQData): Promise<FAQ> {
    return this.prisma.fAQ.create({
      data: {
        ...data,
        slug: slugify(data.question),
      },
    });
  }

  /**
   * Update an existing FAQ.
   */
  async updateFAQ(slug: string, data: UpdateFAQData): Promise<FAQ | null> {
    const newSlug = data.question ? slugify(data.question) : undefined;
    try {
      return await this.prisma.fAQ.update({
        where: { slug },
        data: {
          ...data,
          slug: newSlug,
        },
      });
    } catch (error) {
      // Handle potential not found error
      return null;
    }
  }

  /**
   * Delete an FAQ.
   */
  async deleteFAQ(slug: string): Promise<FAQ | null> {
    try {
      return await this.prisma.fAQ.delete({
        where: { slug },
      });
    } catch (error) {
      return null;
    }
  }
}

export default FAQService;

