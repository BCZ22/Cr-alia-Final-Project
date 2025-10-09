// =============================================================================
// TESTS DE PERFORMANCE K6 - EXPORT DE CARROUSELS
// =============================================================================

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Métriques personnalisées
const errorRate = new Rate('export_error_rate');
const exportTime = new Trend('export_generation_time');
const exportQueueTime = new Trend('export_queue_time');
const exportCounter = new Counter('exports_processed');

export const options = {
  stages: [
    // Test de charge progressive pour les exports
    { duration: '1m', target: 5 }, // 5 exports simultanés
    { duration: '3m', target: 15 }, // 15 exports simultanés
    { duration: '2m', target: 25 }, // 25 exports simultanés (stress test)
    { duration: '2m', target: 0 }, // Redescendre
  ],
  thresholds: {
    http_req_duration: ['p(95)<10000'], // 95% des requêtes < 10s (exports lourds)
    http_req_failed: ['rate<0.2'], // Moins de 20% d'erreurs (exports peuvent échouer)
    export_error_rate: ['rate<0.15'], // Moins de 15% d'erreurs d'export
    export_generation_time: ['p(90)<15000'], // 90% des exports < 15s
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const AUTH_TOKEN = 'demo-token';

const exportFormats = ['IMAGES_ZIP', 'VIDEO_MP4', 'PDF', 'GIF_ANIMATED', 'INDIVIDUAL_IMAGES'];
const qualityLevels = ['SD', 'HD', '4K'];

export function setup() {
  console.log('🎬 Tests de performance - Export de carrousels');
  
  // Créer un carrousel de test pour les exports
  const templateResponse = http.get(`${BASE_URL}/api/v1/carousel/templates?isPublic=true`, {
    headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
  });
  
  if (templateResponse.status !== 200) {
    throw new Error('Impossible de récupérer les templates');
  }
  
  const templates = JSON.parse(templateResponse.body);
  const template = templates.data[0];
  
  // Créer un carrousel de test
  const carouselPayload = JSON.stringify({
    title: 'Carrousel Test Performance',
    description: 'Carrousel pour tests de performance',
    templateId: template.id,
    userId: 'test-user-performance'
  });
  
  const carouselResponse = http.post(`${BASE_URL}/api/v1/carousel/create`, carouselPayload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    }
  });
  
  if (carouselResponse.status !== 201) {
    throw new Error('Impossible de créer le carrousel de test');
  }
  
  const carousel = JSON.parse(carouselResponse.body);
  console.log(`✅ Carrousel de test créé: ${carousel.data.id}`);
  
  return { testCarouselId: carousel.data.id };
}

export default function(data) {
  const userId = `test-user-${__VU}`;
  const format = exportFormats[Math.floor(Math.random() * exportFormats.length)];
  const quality = qualityLevels[Math.floor(Math.random() * qualityLevels.length)];
  
  // Test d'export de carrousel
  testCarouselExport(data.testCarouselId, userId, format, quality);
  sleep(2); // Attendre entre les exports pour éviter la surcharge
}

function testCarouselExport(carouselId, userId, format, quality) {
  const startTime = Date.now();
  
  // 1. Démarrer l'export
  const exportPayload = JSON.stringify({
    format,
    quality,
    userId
  });
  
  const exportResponse = http.post(`${BASE_URL}/api/v1/carousel/${carouselId}/export`, exportPayload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    }
  });
  
  const queueTime = Date.now() - startTime;
  exportQueueTime.add(queueTime);
  
  if (exportResponse.status !== 201) {
    errorRate.add(true);
    return;
  }
  
  const exportData = JSON.parse(exportResponse.body);
  const exportId = exportData.data.id;
  
  console.log(`🚀 Export démarré: ${exportId} (${format}, ${quality})`);
  
  // 2. Polling du statut de l'export
  const maxWaitTime = 60000; // 60 secondes max
  const pollInterval = 2000; // Vérifier toutes les 2 secondes
  let totalWaitTime = 0;
  
  while (totalWaitTime < maxWaitTime) {
    sleep(pollInterval / 1000);
    totalWaitTime += pollInterval;
    
    const statusResponse = http.get(`${BASE_URL}/api/v1/carousel/export/${exportId}/status`, {
      headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
    });
    
    if (statusResponse.status !== 200) {
      errorRate.add(true);
      return;
    }
    
    const statusData = JSON.parse(statusResponse.body);
    const exportStatus = statusData.data;
    
    console.log(`📊 Export ${exportId}: ${exportStatus.status} (${exportStatus.progress}%)`);
    
    if (exportStatus.status === 'COMPLETED') {
      const totalTime = Date.now() - startTime;
      exportTime.add(totalTime);
      exportCounter.add(1);
      
      console.log(`✅ Export terminé: ${exportId} en ${totalTime}ms`);
      
      // Test de téléchargement
      testExportDownload(exportId);
      return;
    }
    
    if (exportStatus.status === 'FAILED') {
      console.log(`❌ Export échoué: ${exportId} - ${exportStatus.error}`);
      errorRate.add(true);
      return;
    }
  }
  
  // Timeout
  console.log(`⏰ Timeout pour l'export: ${exportId}`);
  errorRate.add(true);
}

function testExportDownload(exportId) {
  const downloadResponse = http.get(`${BASE_URL}/api/v1/carousel/export/${exportId}/download`, {
    headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
  });
  
  check(downloadResponse, {
    'download status is 200': (r) => r.status === 200,
    'download has content': (r) => r.body.length > 0,
    'download response time < 5s': (r) => r.timings.duration < 5000,
  });
  
  if (downloadResponse.status === 200) {
    console.log(`📥 Téléchargement réussi: ${exportId} (${downloadResponse.body.length} bytes)`);
  }
}

export function teardown(data) {
  console.log('🏁 Tests d\'export de carrousels terminés');
  console.log('📈 Métriques disponibles:');
  console.log('- export_generation_time: Temps total de génération');
  console.log('- export_queue_time: Temps de mise en queue');
  console.log('- exports_processed: Nombre d\'exports réussis');
  console.log('- export_error_rate: Taux d\'erreur des exports');
}


