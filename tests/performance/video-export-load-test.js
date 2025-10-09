import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Métriques personnalisées pour les exports vidéo
const exportErrorRate = new Rate('export_errors');
const exportResponseTime = new Trend('export_response_time');
const exportSuccessRate = new Rate('export_success');

export const options = {
  stages: [
    { duration: '1m', target: 5 }, // Montée en charge
    { duration: '3m', target: 10 }, // Charge normale
    { duration: '1m', target: 20 }, // Charge élevée
    { duration: '3m', target: 20 }, // Charge soutenue
    { duration: '1m', target: 0 }, // Descente
  ],
  thresholds: {
    export_response_time: ['p(95)<10000'], // 95% des exports < 10s
    export_errors: ['rate<0.2'], // < 20% d'erreurs d'export
    export_success: ['rate>0.8'], // > 80% de succès
  },
};

const BASE_URL = 'http://localhost:3000';

export default function() {
  // Test 1: Export de carousel en vidéo
  const carouselData = {
    templateId: 'template-business-1',
    content: {
      slides: [
        { text: `Test Slide 1 - VU${__VU}`, image: 'test1.jpg' },
        { text: `Test Slide 2 - VU${__VU}`, image: 'test2.jpg' },
        { text: `Test Slide 3 - VU${__VU}`, image: 'test3.jpg' }
      ]
    },
    exportOptions: {
      format: 'mp4',
      quality: 'hd',
      duration: 3
    }
  };

  let response = http.post(`${BASE_URL}/api/v1/carousel`, JSON.stringify(carouselData), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(response, {
    'carousel creation for export': (r) => r.status === 201,
  });

  if (response.status === 201) {
    const carouselId = JSON.parse(response.body).id;
    
    // Test 2: Export vidéo
    const exportData = {
      carouselId: carouselId,
      format: 'mp4',
      quality: 'hd',
      duration: 3
    };

    response = http.post(`${BASE_URL}/api/export`, JSON.stringify(exportData), {
      headers: { 'Content-Type': 'application/json' },
    });

    check(response, {
      'export request status is 202': (r) => r.status === 202,
      'export request response time < 5s': (r) => r.timings.duration < 5000,
    });

    exportErrorRate.add(response.status !== 202);
    exportResponseTime.add(response.timings.duration);
    exportSuccessRate.add(response.status === 202);

    if (response.status === 202) {
      const exportId = JSON.parse(response.body).exportId;
      
      // Test 3: Vérification du statut d'export
      let attempts = 0;
      let exportComplete = false;
      
      while (attempts < 10 && !exportComplete) {
        sleep(2);
        response = http.get(`${BASE_URL}/api/export/${exportId}/status`);
        
        check(response, {
          'export status check': (r) => r.status === 200,
        });

        if (response.status === 200) {
          const status = JSON.parse(response.body).status;
          if (status === 'completed') {
            exportComplete = true;
            check(response, {
              'export completed successfully': (r) => true,
            });
          } else if (status === 'failed') {
            exportErrorRate.add(1);
            break;
          }
        }
        attempts++;
      }

      // Test 4: Téléchargement du fichier exporté
      if (exportComplete) {
        response = http.get(`${BASE_URL}/api/export/download/${exportId}`);
        check(response, {
          'export download status is 200': (r) => r.status === 200,
          'export download has content': (r) => r.body.length > 0,
        });
        exportErrorRate.add(response.status !== 200);
      }
    }
  }

  sleep(1);
}

export function handleSummary(data) {
  return {
    'video-export-results.json': JSON.stringify(data, null, 2),
    'video-export-summary.html': htmlReport(data),
  };
}

function htmlReport(data) {
  const exportSuccess = data.metrics.export_success ? data.metrics.export_success.values.rate : 0;
  const exportErrors = data.metrics.export_errors ? data.metrics.export_errors.values.rate : 0;
  const avgResponseTime = data.metrics.export_response_time ? data.metrics.export_response_time.values.avg : 0;

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Rapport de Performance - Exports Vidéo</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .metric { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
            .success { background-color: #d4edda; }
            .warning { background-color: #fff3cd; }
            .error { background-color: #f8d7da; }
        </style>
    </head>
    <body>
        <h1>Rapport de Performance - Exports Vidéo</h1>
        <div class="metric ${exportSuccess > 0.8 ? 'success' : 'error'}">
            <h3>Taux de succès des exports</h3>
            <p>${(exportSuccess * 100).toFixed(2)}%</p>
        </div>
        <div class="metric ${exportErrors < 0.2 ? 'success' : 'error'}">
            <h3>Taux d'erreur des exports</h3>
            <p>${(exportErrors * 100).toFixed(2)}%</p>
        </div>
        <div class="metric ${avgResponseTime < 5000 ? 'success' : 'warning'}">
            <h3>Temps de réponse moyen</h3>
            <p>${avgResponseTime.toFixed(2)}ms</p>
        </div>
    </body>
    </html>
  `;
}



