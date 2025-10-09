import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Métriques personnalisées
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

// Configuration des tests
export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Montée en charge
    { duration: '5m', target: 50 }, // Charge normale
    { duration: '2m', target: 100 }, // Charge élevée
    { duration: '5m', target: 100 }, // Charge soutenue
    { duration: '2m', target: 0 }, // Descente
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% des requêtes < 2s
    http_req_failed: ['rate<0.1'], // < 10% d'erreurs
    errors: ['rate<0.05'], // < 5% d'erreurs personnalisées
  },
};

const BASE_URL = 'http://localhost:3000';

export default function() {
  // Test 1: Health Check
  let response = http.get(`${BASE_URL}/api/health`);
  check(response, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 1s': (r) => r.timings.duration < 1000,
  });
  errorRate.add(response.status !== 200);
  responseTime.add(response.timings.duration);
  sleep(1);

  // Test 2: Templates API
  response = http.get(`${BASE_URL}/api/v1/templates`);
  check(response, {
    'templates API status is 200': (r) => r.status === 200,
    'templates API has data': (r) => JSON.parse(r.body).length > 0,
  });
  errorRate.add(response.status !== 200);
  responseTime.add(response.timings.duration);
  sleep(1);

  // Test 3: Analytics API
  response = http.get(`${BASE_URL}/api/v1/analytics/templates`);
  check(response, {
    'analytics API status is 200': (r) => r.status === 200,
    'analytics API has metrics': (r) => JSON.parse(r.body).totalTemplates > 0,
  });
  errorRate.add(response.status !== 200);
  responseTime.add(response.timings.duration);
  sleep(1);

  // Test 4: Carousel API
  response = http.get(`${BASE_URL}/api/v1/carousel`);
  check(response, {
    'carousel API status is 200': (r) => r.status === 200,
  });
  errorRate.add(response.status !== 200);
  responseTime.add(response.timings.duration);
  sleep(1);

  // Test 5: Création de template (POST)
  const templateData = {
    name: `Test Template ${__VU}_${__ITER}`,
    category: 'Test',
    description: 'Template de test pour performance',
    config: {
      slides: [
        { type: 'text', content: 'Test Slide 1' },
        { type: 'text', content: 'Test Slide 2' }
      ]
    }
  };

  response = http.post(`${BASE_URL}/api/v1/templates`, JSON.stringify(templateData), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(response, {
    'template creation status is 201': (r) => r.status === 201,
    'template creation response time < 3s': (r) => r.timings.duration < 3000,
  });
  errorRate.add(response.status !== 201);
  responseTime.add(response.timings.duration);
  sleep(2);

  // Test 6: Création de carousel (POST)
  const carouselData = {
    templateId: 'template-business-1',
    content: {
      slides: [
        { text: 'Slide 1', image: 'test1.jpg' },
        { text: 'Slide 2', image: 'test2.jpg' }
      ]
    }
  };

  response = http.post(`${BASE_URL}/api/v1/carousel`, JSON.stringify(carouselData), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(response, {
    'carousel creation status is 201': (r) => r.status === 201,
    'carousel creation response time < 5s': (r) => r.timings.duration < 5000,
  });
  errorRate.add(response.status !== 201);
  responseTime.add(response.timings.duration);
  sleep(2);

  // Test 7: Interface utilisateur (pages)
  const pages = [
    '/analytics/templates',
    '/carousel',
    '/ai/content'
  ];

  const page = pages[Math.floor(Math.random() * pages.length)];
  response = http.get(`${BASE_URL}${page}`);
  check(response, {
    'page load status is 200': (r) => r.status === 200,
    'page load response time < 2s': (r) => r.timings.duration < 2000,
  });
  errorRate.add(response.status !== 200);
  responseTime.add(response.timings.duration);
  sleep(1);
}

export function handleSummary(data) {
  return {
    'performance-results.json': JSON.stringify(data, null, 2),
    'performance-summary.html': htmlReport(data),
  };
}

function htmlReport(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Rapport de Performance - Crealia</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .metric { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
            .success { background-color: #d4edda; }
            .warning { background-color: #fff3cd; }
            .error { background-color: #f8d7da; }
        </style>
    </head>
    <body>
        <h1>Rapport de Performance - Crealia</h1>
        <div class="metric ${data.metrics.http_req_failed.values.rate < 0.1 ? 'success' : 'error'}">
            <h3>Taux d'erreur HTTP</h3>
            <p>${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%</p>
        </div>
        <div class="metric ${data.metrics.http_req_duration.values.p95 < 2000 ? 'success' : 'warning'}">
            <h3>Temps de réponse P95</h3>
            <p>${data.metrics.http_req_duration.values.p95.toFixed(2)}ms</p>
        </div>
        <div class="metric">
            <h3>Requêtes totales</h3>
            <p>${data.metrics.http_reqs.values.count}</p>
        </div>
    </body>
    </html>
  `;
}



