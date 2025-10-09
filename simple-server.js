// =============================================================================
// SERVEUR NODE.JS SIMPLE POUR TESTS CREALIA
// =============================================================================

const http = require('http');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 3000;

// Statistiques de base
let requestCount = 0;
let startTime = Date.now();

// Créer le serveur HTTP
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  // Incrémenter le compteur de requêtes
  requestCount++;
  
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Gestion des requêtes OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Router les requêtes
  switch (path) {
    case '/health':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: (Date.now() - startTime) / 1000,
        requests: requestCount,
        environment: process.env.NODE_ENV || 'development'
      }));
      break;
      
    case '/metrics':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      const metrics = [
        `# HELP http_requests_total Total number of HTTP requests`,
        `# TYPE http_requests_total counter`,
        `http_requests_total ${requestCount}`,
        `# HELP http_request_duration_seconds HTTP request duration in seconds`,
        `# TYPE http_request_duration_seconds histogram`,
        `http_request_duration_seconds_bucket{le="0.1"} 0`,
        `http_request_duration_seconds_bucket{le="0.5"} 0`,
        `http_request_duration_seconds_bucket{le="1.0"} 0`,
        `http_request_duration_seconds_bucket{le="+Inf"} ${requestCount}`,
        `http_request_duration_seconds_sum 0`,
        `http_request_duration_seconds_count ${requestCount}`,
        `# HELP process_cpu_seconds_total Total user and system CPU time spent in seconds`,
        `# TYPE process_cpu_seconds_total counter`,
        `process_cpu_seconds_total 0`,
        `# HELP process_resident_memory_bytes Resident memory size in bytes`,
        `# TYPE process_resident_memory_bytes gauge`,
        `process_resident_memory_bytes ${process.memoryUsage().rss}`,
        `# HELP nodejs_version_info Node.js version info`,
        `# TYPE nodejs_version_info gauge`,
        `nodejs_version_info{version="${process.version}"} 1`
      ].join('\n');
      res.end(metrics);
      break;
      
    case '/api/v1':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'API Crealia v1',
        status: 'operational',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }));
      break;
      
    case '/':
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Crealia - Serveur de Test</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 800px; margin: 0 auto; }
            .status { padding: 20px; border-radius: 8px; margin: 20px 0; }
            .healthy { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
            .endpoint { background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; margin: 10px 0; border-radius: 5px; }
            code { background-color: #e9ecef; padding: 2px 6px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚀 Crealia - Serveur de Test</h1>
            
            <div class="status healthy">
              <h2>✅ Statut: En ligne</h2>
              <p><strong>Port:</strong> ${PORT}</p>
              <p><strong>Environnement:</strong> ${process.env.NODE_ENV || 'development'}</p>
              <p><strong>Uptime:</strong> ${((Date.now() - startTime) / 1000).toFixed(1)}s</p>
              <p><strong>Requêtes totales:</strong> ${requestCount}</p>
            </div>
            
            <h2>🔗 Endpoints disponibles</h2>
            
            <div class="endpoint">
              <h3>GET <code>/health</code></h3>
              <p>Vérification de la santé du serveur</p>
              <p><strong>Test:</strong> <code>curl http://localhost:${PORT}/health</code></p>
            </div>
            
            <div class="endpoint">
              <h3>GET <code>/metrics</code></h3>
              <p>Métriques Prometheus</p>
              <p><strong>Test:</strong> <code>curl http://localhost:${PORT}/metrics</code></p>
            </div>
            
            <div class="endpoint">
              <h3>GET <code>/api/v1</code></h3>
              <p>API de base</p>
              <p><strong>Test:</strong> <code>curl http://localhost:${PORT}/api/v1</code></p>
            </div>
            
            <h2>🧪 Tests de charge</h2>
            <p>Pour tester les performances, utilisez le script de test de charge :</p>
            <pre><code>node test-load-simple.js</code></pre>
            
            <h2>📊 Monitoring</h2>
            <p>Ce serveur expose des métriques au format Prometheus pour le monitoring.</p>
          </div>
        </body>
        </html>
      `);
      break;
      
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Endpoint non trouvé',
        path: path,
        timestamp: new Date().toISOString()
      }));
  }
});

// Démarrer le serveur
server.listen(PORT, () => {
  console.log('🚀 Serveur Crealia démarré !');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Démarrage: ${new Date().toLocaleString()}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Métriques: http://localhost:${PORT}/metrics`);
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  console.log('⏹️  Signal SIGTERM reçu, arrêt gracieux...');
  server.close(() => {
    console.log('✅ Serveur arrêté gracieusement');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('⏹️  Signal SIGINT reçu, arrêt gracieux...');
  server.close(() => {
    console.log('✅ Serveur arrêté gracieusement');
    process.exit(0);
  });
});

// Gestion des erreurs
server.on('error', (error) => {
  console.error('❌ Erreur serveur:', error.message);
  process.exit(1);
});




