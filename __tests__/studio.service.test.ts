import StudioService from '../backend/services/studio.service';
import { PrismaService } from '../backend/services/prisma/prisma.service';
import { jest } from '@jest/globals';

// Mock PrismaService
jest.mock('../backend/services/prisma/prisma.service', () => {
  const mPrismaClient = {
    project: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };
  return {
    PrismaService: jest.fn(() => mPrismaClient),
  };
});

describe('StudioService', () => {
  let studioService: StudioService;
  let prisma: PrismaService;

  beforeEach(() => {
    studioService = new StudioService();
    prisma = new PrismaService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should create a new project with the provided data', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'A test project.',
        userId: 'user-123',
      };

      const expectedProject = {
        id: 'project-1',
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.project.create as jest.Mock).mockResolvedValue(expectedProject);

      const result = await studioService.createProject(projectData);

      expect(prisma.project.create).toHaveBeenCalledWith({
        data: projectData,
      });
      expect(result).toEqual(expectedProject);
    });
  });

  describe('getProjects', () => {
    it('should retrieve all projects for a given user', async () => {
      const userId = 'user-123';
      const expectedProjects = [
        { id: 'project-1', name: 'Project 1', userId },
        { id: 'project-2', name: 'Project 2', userId },
      ];

      (prisma.project.findMany as jest.Mock).mockResolvedValue(expectedProjects);

      const result = await studioService.getProjects(userId);

      expect(prisma.project.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { assets: true },
      });
      expect(result).toEqual(expectedProjects);
    });
  });
});

