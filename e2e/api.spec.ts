import { test, expect } from '@playwright/test';

test.describe('Créalia API', () => {
  const BASE_URL = 'http://localhost:3000/api';

  test.describe('Studio API', () => {
    let projectId: string;

    test('should create a new project', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/studio/projects`, {
        data: {
          name: 'E2E Test Project',
          description: 'This is a project created by a Playwright E2E test.',
        },
      });
      expect(response.status()).toBe(201);
      const project = await response.json();
      expect(project).toHaveProperty('id');
      expect(project.name).toBe('E2E Test Project');
      projectId = project.id;
    });

    test('should retrieve all projects', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/studio/projects`);
      expect(response.status()).toBe(200);
      const projects = await response.json();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
    });

    test('should retrieve a single project by ID', async ({ request }) => {
      expect(projectId, 'Project ID must be set by the create test').toBeDefined();
      const response = await request.get(`${BASE_URL}/studio/projects/${projectId}`);
      expect(response.status()).toBe(200);
      const project = await response.json();
      expect(project.id).toBe(projectId);
    });
    
    test('should delete the project', async ({ request }) => {
      expect(projectId, 'Project ID must be set by the create test').toBeDefined();
      const response = await request.delete(`${BASE_URL}/studio/projects/${projectId}`);
      expect(response.status()).toBe(204);
    });
  });

  test.describe('AI API', () => {
    test('should generate content', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/ai/generate`, {
        data: {
          prompt: 'A test prompt from Playwright',
          type: 'caption',
        },
      });
      expect(response.status()).toBe(200);
      const result = await response.json();
      expect(result.ok).toBe(true);
      expect(result.result).toContain('A test prompt from Playwright');
    });

    test('should get interaction history', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/ai/history`);
      expect(response.status()).toBe(200);
      const result = await response.json();
      expect(result.ok).toBe(true);
      expect(Array.isArray(result.history)).toBe(true);
    });
  });
});

