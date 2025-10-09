// =============================================================================
// TESTS DE PERFORMANCE K6 - CHARGE API
// =============================================================================

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Métriques personnalisées
const errorRate = new Rate('error_rate');
const contentGenerationTime = new Trend('content_generation_time');
const carouselCreationTime = new Trend('carousel_creation_time');
const schedulingTime = new Trend('scheduling_time');

// Configuration des tests
export const options = {
  stages: [
    // Montée en charge progressive
    { duration: '2m', target: 10 }, // 10 utilisateurs pendant 2 minutes
    { duration: '5m', target: 50 }, // 50 utilisateurs pendant 5 minutes
    { duration: '2m', target: 100 }, // 100 utilisateurs pendant 2 minutes
    { duration: '5m', target: 100 }, // Maintenir 100 utilisateurs
    { duration: '2m', target: 0 }, // Redescendre à 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% des requêtes < 2s
    http_req_failed: ['rate<0.1'], // Moins de 10% d'erreurs
    error_rate: ['rate<0.05'], // Moins de 5% d'erreurs custom
    content_generation_time: ['p(90)<3000'], // 90% des générations < 3s
    carousel_creation_time: ['p(90)<1500'], // 90% des créations < 1.5s
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const AUTH_TOKEN = 'demo-token'; // Token de test

// Données de test
const testPrompts = [
  'Écris un post LinkedIn sur les tendances du marketing digital',
  'Crée un contenu sur les innovations technologiques',
  'Génère un post sur les bonnes pratiques de leadership',
  'Écris sur les stratégies de croissance startup',
  'Crée du contenu sur le développement personnel'
];

const carouselTemplates = [
  'Business Professional',
  'Marketing Modern',
  'Educational Clean',
  'Lifestyle Vibrant',
  'Tech Innovation'
];

export function setup() {
  console.log('🚀 Démarrage des tests de performance K6');
  console.log(`📍 URL de base: ${BASE_URL}`);
  
  // Vérifier que l'API est accessible
  const healthCheck = http.get(`${BASE_URL}/api/v1`);
  if (healthCheck.status !== 200) {
    throw new Error(`API non accessible: ${healthCheck.status}`);
  }
  
  return { startTime: Date.now() };
}

export default function(data) {
  const userId = `test-user-${__VU}`;
  
  // Test 1: Génération de contenu AI
  testContentGeneration(userId);
  sleep(1);
  
  // Test 2: Création de carrousel
  testCarouselCreation(userId);
  sleep(1);
  
  // Test 3: Planification de contenu
  testContentScheduling(userId);
  sleep(1);
  
  // Test 4: Récupération des templates
  testTemplateRetrieval();
  sleep(0.5);
  
  // Test 5: Analytics et reporting
  testAnalytics(userId);
  sleep(0.5);
}

function testContentGeneration(userId) {
  const prompt = testPrompts[Math.floor(Math.random() * testPrompts.length)];
  const startTime = Date.now();
  
  const payload = JSON.stringify({
    userId,
    type: 'POST',
    platform: 'LINKEDIN',
    format: 'TEXT',
    prompt,
    n: 1,
    options: {
      language: 'fr',
      tone: 'professionnel',
      style: 'clair',
      creativity: 0.7,
      maxLength: 400,
      length: 'medium'
    }
  });
  
  const response = http.post(`${BASE_URL}/api/v1/content/generate`, payload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    }
  });
  
  const duration = Date.now() - startTime;
  contentGenerationTime.add(duration);
  
  const success = check(response, {
    'content generation status is 201': (r) => r.status === 201,
    'content generation response time < 5s': (r) => r.timings.duration < 5000,
    'content generation has valid response': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.success === true && data.data && data.data.results;
      } catch {
        return false;
      }
    }
  });
  
  errorRate.add(!success);
}

function testCarouselCreation(userId) {
  const templateName = carouselTemplates[Math.floor(Math.random() * carouselTemplates.length)];
  const startTime = Date.now();
  
  // D'abord récupérer les templates
  const templatesResponse = http.get(`${BASE_URL}/api/v1/carousel/templates?isPublic=true`, {
    headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
  });
  
  if (templatesResponse.status !== 200) {
    errorRate.add(true);
    return;
  }
  
  const templates = JSON.parse(templatesResponse.body);
  const template = templates.data?.find(t => t.name === templateName);
  
  if (!template) {
    errorRate.add(true);
    return;
  }
  
  // Créer le carrousel
  const payload = JSON.stringify({
    title: `Carrousel Test ${Date.now()}`,
    description: 'Carrousel créé par test de performance',
    templateId: template.id,
    projectId: 'test-project',
    userId
  });
  
  const response = http.post(`${BASE_URL}/api/v1/carousel/create`, payload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    }
  });
  
  const duration = Date.now() - startTime;
  carouselCreationTime.add(duration);
  
  const success = check(response, {
    'carousel creation status is 201': (r) => r.status === 201,
    'carousel creation response time < 2s': (r) => r.timings.duration < 2000,
    'carousel creation has valid response': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.success === true && data.data && data.data.id;
      } catch {
        return false;
      }
    }
  });
  
  errorRate.add(!success);
}

function testContentScheduling(userId) {
  const startTime = Date.now();
  
  // Créer un draft d'abord
  const draftPayload = JSON.stringify({
    title: 'Draft Test',
    content: 'Contenu de test pour planification',
    type: 'POST',
    platform: 'LINKEDIN',
    userId
  });
  
  const draftResponse = http.post(`${BASE_URL}/api/v1/content/drafts`, draftPayload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    }
  });
  
  if (draftResponse.status !== 201) {
    errorRate.add(true);
    return;
  }
  
  const draft = JSON.parse(draftResponse.body);
  const scheduledAt = new Date(Date.now() + 86400000).toISOString(); // Demain
  
  // Planifier le contenu
  const schedulePayload = JSON.stringify({
    draftId: draft.data.id,
    scheduledAt,
    platform: 'LINKEDIN',
    userId
  });
  
  const response = http.post(`${BASE_URL}/api/v1/content/drafts/schedule`, schedulePayload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    }
  });
  
  const duration = Date.now() - startTime;
  schedulingTime.add(duration);
  
  const success = check(response, {
    'scheduling status is 201': (r) => r.status === 201,
    'scheduling response time < 1s': (r) => r.timings.duration < 1000,
    'scheduling has valid response': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.success === true && data.data && data.data.id;
      } catch {
        return false;
      }
    }
  });
  
  errorRate.add(!success);
}

function testTemplateRetrieval() {
  const response = http.get(`${BASE_URL}/api/v1/carousel/templates?isPublic=true`, {
    headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
  });
  
  check(response, {
    'templates retrieval status is 200': (r) => r.status === 200,
    'templates retrieval response time < 500ms': (r) => r.timings.duration < 500,
    'templates retrieval has data': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.success === true && data.data && data.data.length > 0;
      } catch {
        return false;
      }
    }
  });
}

function testAnalytics(userId) {
  // Test de récupération des analytics (simulation)
  const response = http.get(`${BASE_URL}/api/v1/analytics/content/test-content-id`, {
    headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
  });
  
  check(response, {
    'analytics response time < 1s': (r) => r.timings.duration < 1000,
  });
}

export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`✅ Tests de performance terminés en ${duration}s`);
  console.log('📊 Consultez les métriques K6 pour les résultats détaillés');
}


