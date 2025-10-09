import { PrismaClient, Template } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';

export interface TemplateFilters {
  category?: string;
  tag?: string;
  isPublic?: boolean;
}

export interface CreateTemplateSubmission {
  name: string;
  description?: string;
  type: Template['type'];
  category: string;
  tags: string[];
  data: any; // The template structure
  userId: string;
}

export class InspirationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaService();
  }

  /**
   * Get inspiration templates with optional filtering.
   */
  async getTemplates(filters: TemplateFilters): Promise<Template[]> {
    // For now, we only fetch public templates.
    return this.prisma.template.findMany({
      where: {
        isPublic: true,
        // More sophisticated filtering can be added here based on category, tags, etc.
      },
    });
  }

  /**
   * Handles user submission of a new template.
   * As per requirements, submissions require moderation.
   */
  async submitTemplate(data: CreateTemplateSubmission): Promise<Template> {
    return this.prisma.template.create({
      data: {
        ...data,
        isPublic: false, // Submissions are private until moderated
        isPremium: false,
        usageCount: 0,
        rating: 0,
        downloads: 0,
      },
    });
  }
}

export default InspirationService;

