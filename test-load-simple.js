// =============================================================================
// TEST DE CHARGE SIMPLIFIÉ POUR CREALIA (SANS DOCKER)
// =============================================================================

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  url: process.env.TARGET_URL || 'http://localhost:3000',
  connections: parseInt(process.env.CONNECTIONS) || 100,
  duration: parseInt(process.env.DURATION) || 30,
  timeout: parseInt(process.env.TIMEOUT) || 5000
};

// Statistiques
let stats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalTime: 0,
  responseTimes: [],
  startTime: Date.now()
};

// Fonction de requête HTTP/HTTPS
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Crealia-LoadTest/1.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: config.timeout
    };

    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        stats.responseTimes.push(responseTime);
        stats.totalTime += responseTime;
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          stats.successfulRequests++;
        } else {
          stats.failedRequests++;
        }
        
        stats.totalRequests++;
        resolve({ statusCode: res.statusCode, responseTime, data });
      });
    });

    req.on('error', (error) => {
      stats.failedRequests++;
      stats.totalRequests++;
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      stats.failedRequests++;
      stats.totalRequests++;
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Test de charge simple
async function runLoadTest() {
  console.log('🚀 TEST DE CHARGE SIMPLIFIÉ CREALIA');
  console.log('=====================================');
  console.log(`🎯 Cible: ${config.url}`);
  console.log(`👥 Connexions: ${config.connections}`);
  console.log(`⏱️  Durée: ${config.duration}s`);
  console.log(`⏰ Démarrage: ${new Date().toLocaleString()}`);
  
  const promises = [];
  const startTime = Date.now();
  
  // Créer les promesses de requêtes
  for (let i = 0; i < config.connections; i++) {
    const promise = makeRequest(`${config.url}/health`)
      .catch(error => ({ error: error.message }));
    promises.push(promise);
  }
  
  // Attendre la fin des requêtes ou la durée maximale
  const timeoutPromise = new Promise(resolve => {
    setTimeout(() => resolve('timeout'), config.duration * 1000);
  });
  
  try {
    const results = await Promise.race([
      Promise.all(promises),
      timeoutPromise
    ]);
    
    if (results === 'timeout') {
      console.log('⏰ Durée maximale atteinte, arrêt des tests');
    }
    
    // Calculer les statistiques
    const endTime = Date.now();
    const totalDuration = (endTime - startTime) / 1000;
    
    // Trier les temps de réponse pour calculer les percentiles
    stats.responseTimes.sort((a, b) => a - b);
    
    const p50 = stats.responseTimes[Math.floor(stats.responseTimes.length * 0.5)];
    const p90 = stats.responseTimes[Math.floor(stats.responseTimes.length * 0.9)];
    const p99 = stats.responseTimes[Math.floor(stats.responseTimes.length * 0.99)];
    
    const avgResponseTime = stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length;
    const requestsPerSecond = stats.totalRequests / totalDuration;
    const successRate = (stats.successfulRequests / stats.totalRequests) * 100;
    
    // Affichage des résultats
    console.log('\n📊 RÉSULTATS DU TEST DE CHARGE');
    console.log('==================================');
    console.log(`⏱️  Durée totale: ${totalDuration.toFixed(2)}s`);
    console.log(`📈 Requêtes totales: ${stats.totalRequests}`);
    console.log(`✅ Requêtes réussies: ${stats.successfulRequests}`);
    console.log(`❌ Requêtes échouées: ${stats.failedRequests}`);
    console.log(`📊 Taux de succès: ${successRate.toFixed(2)}%`);
    console.log(`🚀 Requêtes/sec: ${requestsPerSecond.toFixed(2)}`);
    console.log(`⏳ Temps de réponse moyen: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`📊 Latence P50: ${p50 || 0}ms`);
    console.log(`📊 Latence P90: ${p90 || 0}ms`);
    console.log(`📊 Latence P99: ${p99 || 0}ms`);
    
    // Évaluation des performances
    console.log('\n🎯 ÉVALUATION DES PERFORMANCES');
    console.log('================================');
    
    if (requestsPerSecond >= 1000) {
      console.log('🟢 EXCELLENT: Débit > 1000 req/s');
    } else if (requestsPerSecond >= 500) {
      console.log('🟡 BON: Débit 500-1000 req/s');
    } else if (requestsPerSecond >= 100) {
      console.log('🟠 MOYEN: Débit 100-500 req/s');
    } else {
      console.log('🔴 FAIBLE: Débit < 100 req/s');
    }
    
    if (avgResponseTime < 100) {
      console.log('🟢 EXCELLENT: Latence < 100ms');
    } else if (avgResponseTime < 200) {
      console.log('🟡 BON: Latence 100-200ms');
    } else if (avgResponseTime < 500) {
      console.log('🟠 MOYEN: Latence 200-500ms');
    } else {
      console.log('🔴 FAIBLE: Latence > 500ms');
    }
    
    if (successRate >= 99.9) {
      console.log('🟢 EXCELLENT: Disponibilité > 99.9%');
    } else if (successRate >= 99) {
      console.log('🟡 BON: Disponibilité 99-99.9%');
    } else if (successRate >= 95) {
      console.log('🟠 MOYEN: Disponibilité 95-99%');
    } else {
      console.log('🔴 FAIBLE: Disponibilité < 95%');
    }
    
    // Sauvegarder les résultats
    const resultsDir = path.join(__dirname, 'tests', 'load', 'results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    const resultsData = {
      timestamp: new Date().toISOString(),
      target: config.url,
      config: config,
      results: {
        totalDuration,
        totalRequests: stats.totalRequests,
        successfulRequests: stats.successfulRequests,
        failedRequests: stats.failedRequests,
        successRate,
        requestsPerSecond,
        avgResponseTime,
        p50,
        p90,
        p99,
        responseTimes: stats.responseTimes
      }
    };
    
    const filename = `simple-load-test-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    const filepath = path.join(resultsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(resultsData, null, 2));
    console.log(`\n💾 Résultats sauvegardés dans: ${filepath}`);
    
    return resultsData;
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    throw error;
  }
}

// Test de charge progressif
async function runProgressiveLoadTest() {
  console.log('\n🔥 TEST DE CHARGE PROGRESSIF');
  console.log('==============================');
  
  const connectionLevels = [10, 25, 50, 100, 200];
  const results = [];
  
  for (const connections of connectionLevels) {
    console.log(`\n📈 Test avec ${connections} connexions simultanées`);
    
    // Mettre à jour la configuration
    config.connections = connections;
    config.duration = 30;
    
    // Réinitialiser les statistiques
    stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalTime: 0,
      responseTimes: [],
      startTime: Date.now()
    };
    
    try {
      const result = await runLoadTest();
      results.push({
        connections,
        ...result
      });
      
      // Pause entre les tests
      console.log('⏸️  Pause de 5 secondes...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } catch (error) {
      console.error(`❌ Erreur avec ${connections} connexions:`, error.message);
      results.push({
        connections,
        error: error.message
      });
    }
  }
  
  // Résumé des tests progressifs
  console.log('\n📊 RÉSUMÉ DES TESTS PROGRESSIFS');
  console.log('==================================');
  
  results.forEach(result => {
    if (result.error) {
      console.log(`❌ ${result.connections} connexions: Erreur`);
    } else {
      console.log(`✅ ${result.connections} connexions: ${result.results.requestsPerSecond.toFixed(2)} req/s, P99: ${result.results.p99}ms`);
    }
  });
  
  return results;
}

// Fonction principale
async function main() {
  try {
    // Test simple
    await runLoadTest();
    
    // Demander si l'utilisateur veut faire un test progressif
    console.log('\n❓ Voulez-vous exécuter un test de charge progressif ? (y/N)');
    
    // Pour l'automatisation, on peut passer une variable d'environnement
    if (process.env.RUN_PROGRESSIVE === 'true') {
      await runProgressiveLoadTest();
    }
    
    console.log('\n🎉 Tests terminés avec succès !');
    
  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error.message);
    process.exit(1);
  }
}

// Gestion des signaux
process.on('SIGINT', () => {
  console.log('\n⏹️  Arrêt des tests...');
  process.exit(0);
});

// Exécution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  runLoadTest,
  runProgressiveLoadTest
};




