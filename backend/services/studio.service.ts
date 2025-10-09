import { PrismaClient, Project, Asset } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';

// Basic types for creation and update, can be expanded
interface CreateProjectData {
  name: string;
  description?: string;
  userId: string;
}

interface UpdateProjectData {
  name?: string;
  description?: string;
}

export class StudioService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaService();
  }

  // Get all projects for a user
  async getProjects(userId: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { userId },
      include: { assets: true },
    });
  }

  // Get a single project by ID
  async getProjectById(id: string, userId: string): Promise<Project | null> {
    return this.prisma.project.findFirst({
      where: { id, userId },
      include: { assets: true },
    });
  }

  // Create a new project
  async createProject(data: CreateProjectData): Promise<Project> {
    return this.prisma.project.create({
      data,
    });
  }

  // Update a project
  async updateProject(id: string, data: UpdateProjectData, userId: string): Promise<Project | null> {
    // Ensure the project belongs to the user before updating
    const project = await this.getProjectById(id, userId);
    if (!project) {
      return null;
    }
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  // Delete a project
  async deleteProject(id: string, userId: string): Promise<Project | null> {
    // Ensure the project belongs to the user before deleting
    const project = await this.getProjectById(id, userId);
    if (!project) {
      return null;
    }
    return this.prisma.project.delete({
      where: { id },
    });
  }

  // NOTE: File upload handling would be more complex.
  // It involves receiving the file stream, saving it to a storage
  // (like S3 or local disk), and then creating the Asset record in the DB.
  // This service would handle the database part of that operation.
}

export default StudioService;

