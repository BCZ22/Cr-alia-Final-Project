// =============================================================================
// TESTS DE PERFORMANCE - ÉDITEUR VIDÉO
// =============================================================================

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métriques personnalisées
const errorRate = new Rate('errors');

// Configuration des tests
export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Montée progressive
    { duration: '5m', target: 50 }, // Charge normale
    { duration: '2m', target: 100 }, // Charge élevée
    { duration: '5m', target: 100 }, // Maintien
    { duration: '2m', target: 0 }, // Descente
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% des requêtes < 2s
    http_req_failed: ['rate<0.1'], // < 10% d'erreurs
    errors: ['rate<0.1'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api/video-editor`;

// Données de test
const testUser = {
  id: 'user-123',
  username: 'testuser',
  email: 'test@example.com'
};

const testProject = {
  name: 'Projet de Test',
  resolution: '1920x1080',
  fps: 30
};

export default function () {
  // Test 1: Liste des projets
  const projectsResponse = http.get(`${API_BASE}/projects`, {
    headers: {
      'Authorization': `Bearer ${testUser.id}`,
      'Content-Type': 'application/json'
    }
  });

  check(projectsResponse, {
    'status is 200': (r) => r.status === 200,
    'response time < 1s': (r) => r.timings.duration < 1000,
    'has projects data': (r) => JSON.parse(r.body).success === true
  }) || errorRate.add(1);

  sleep(1);

  // Test 2: Création de projet
  const createResponse = http.post(`${API_BASE}/projects`, JSON.stringify(testProject), {
    headers: {
      'Authorization': `Bearer ${testUser.id}`,
      'Content-Type': 'application/json'
    }
  });

  check(createResponse, {
    'status is 201': (r) => r.status === 201,
    'response time < 2s': (r) => r.timings.duration < 2000,
    'project created': (r) => JSON.parse(r.body).success === true
  }) || errorRate.add(1);

  const projectId = JSON.parse(createResponse.body).data.id;
  sleep(1);

  // Test 3: Récupération du projet
  const getResponse = http.get(`${API_BASE}/projects/${projectId}`, {
    headers: {
      'Authorization': `Bearer ${testUser.id}`,
      'Content-Type': 'application/json'
    }
  });

  check(getResponse, {
    'status is 200': (r) => r.status === 200,
    'response time < 1s': (r) => r.timings.duration < 1000,
    'project retrieved': (r) => JSON.parse(r.body).success === true
  }) || errorRate.add(1);

  sleep(1);

  // Test 4: Ajout de piste
  const trackData = {
    projectId,
    type: 'VIDEO',
    name: 'Piste Vidéo'
  };

  const trackResponse = http.post(`${API_BASE}/tracks`, JSON.stringify(trackData), {
    headers: {
      'Authorization': `Bearer ${testUser.id}`,
      'Content-Type': 'application/json'
    }
  });

  check(trackResponse, {
    'status is 201': (r) => r.status === 201,
    'response time < 1s': (r) => r.timings.duration < 1000,
    'track created': (r) => JSON.parse(r.body).success === true
  }) || errorRate.add(1);

  const trackId = JSON.parse(trackResponse.body).data.id;
  sleep(1);

  // Test 5: Ajout de clip
  const clipData = {
    trackId,
    type: 'VIDEO',
    name: 'Clip Test',
    startTime: 0,
    duration: 10,
    sourceUrl: 'https://example.com/video.mp4'
  };

  const clipResponse = http.post(`${API_BASE}/clips`, JSON.stringify(clipData), {
    headers: {
      'Authorization': `Bearer ${testUser.id}`,
      'Content-Type': 'application/json'
    }
  });

  check(clipResponse, {
    'status is 201': (r) => r.status === 201,
    'response time < 1s': (r) => r.timings.duration < 1000,
    'clip created': (r) => JSON.parse(r.body).success === true
  }) || errorRate.add(1);

  sleep(1);

  // Test 6: Upload de média
  const mediaData = {
    name: 'test-video.mp4',
    type: 'VIDEO',
    size: 1024000,
    mimeType: 'video/mp4'
  };

  const mediaResponse = http.post(`${API_BASE}/media`, JSON.stringify(mediaData), {
    headers: {
      'Authorization': `Bearer ${testUser.id}`,
      'Content-Type': 'application/json'
    }
  });

  check(mediaResponse, {
    'status is 201': (r) => r.status === 201,
    'response time < 2s': (r) => r.timings.duration < 2000,
    'media created': (r) => JSON.parse(r.body).success === true
  }) || errorRate.add(1);

  sleep(1);

  // Test 7: Export de vidéo
  const exportData = {
    projectId,
    format: 'MP4',
    resolution: '1920x1080',
    quality: 'HIGH',
    name: 'Export Test'
  };

  const exportResponse = http.post(`${API_BASE}/export`, JSON.stringify(exportData), {
    headers: {
      'Authorization': `Bearer ${testUser.id}`,
      'Content-Type': 'application/json'
    }
  });

  check(exportResponse, {
    'status is 201': (r) => r.status === 201,
    'response time < 3s': (r) => r.timings.duration < 3000,
    'export started': (r) => JSON.parse(r.body).success === true
  }) || errorRate.add(1);

  sleep(2);
}
