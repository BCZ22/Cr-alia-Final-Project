// =============================================================================
// TEST DE CHARGE PRODUCTION POUR CREALIA
// =============================================================================

const autocannon = require('autocannon');
const fs = require('fs');
const path = require('path');

// Configuration du test de charge
const config = {
  url: process.env.TARGET_URL || 'http://localhost:3000',
  connections: parseInt(process.env.CONNECTIONS) || 100,
  duration: parseInt(process.env.DURATION) || 60,
  pipelining: parseInt(process.env.PIPELINING) || 1,
  timeout: parseInt(process.env.TIMEOUT) || 10,
  headers: {
    'User-Agent': 'Crealia-LoadTest/1.0',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

// Scénarios de test
const scenarios = [
  {
    name: 'Health Check',
    path: '/health',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'API Status',
    path: '/api/v1',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Metrics',
    path: '/metrics',
    method: 'GET',
    expectedStatus: 200
  }
];

// Fonction de test de charge
async function runLoadTest(scenario) {
  console.log(`\n🚀 Démarrage du test: ${scenario.name}`);
  console.log(`📍 Endpoint: ${config.url}${scenario.path}`);
  console.log(`🔗 Méthode: ${scenario.method}`);
  console.log(`👥 Connexions: ${config.connections}`);
  console.log(`⏱️  Durée: ${config.duration}s`);
  
  const testConfig = {
    ...config,
    url: `${config.url}${scenario.path}`,
    method: scenario.method
  };

  try {
    const result = await autocannon(testConfig);
    
    // Analyse des résultats
    const analysis = {
      scenario: scenario.name,
      endpoint: scenario.path,
      method: scenario.method,
      timestamp: new Date().toISOString(),
      results: {
        requests: {
          total: result.requests.total,
          average: result.requests.average,
          p50: result.requests.p50,
          p90: result.requests.p90,
          p99: result.requests.p99
        },
        latency: {
          average: result.latency.average,
          p50: result.latency.p50,
          p90: result.latency.p90,
          p99: result.latency.p99
        },
        throughput: {
          average: result.throughput.average,
          p50: result.throughput.p50,
          p90: result.throughput.p90,
          p99: result.throughput.p99
        },
        errors: result.errors,
        timeouts: result.timeouts,
        duration: result.duration
      }
    };

    // Affichage des résultats
    console.log(`\n✅ Test terminé: ${scenario.name}`);
    console.log(`📊 Résultats:`);
    console.log(`   - Requêtes totales: ${analysis.results.requests.total}`);
    console.log(`   - Requêtes/sec: ${analysis.results.requests.average.toFixed(2)}`);
    console.log(`   - Latence moyenne: ${analysis.results.latency.average.toFixed(2)}ms`);
    console.log(`   - Latence P99: ${analysis.results.latency.p99.toFixed(2)}ms`);
    console.log(`   - Débit: ${analysis.results.throughput.average.toFixed(2)} KB/s`);
    console.log(`   - Erreurs: ${analysis.results.errors}`);
    console.log(`   - Timeouts: ${analysis.results.timeouts}`);

    return analysis;
  } catch (error) {
    console.error(`❌ Erreur lors du test ${scenario.name}:`, error.message);
    return {
      scenario: scenario.name,
      error: error.message,
      timestamp: new Date().toISOString()
    };
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
    
    const testConfig = { ...config, connections, duration: 30 };
    
    try {
      const result = await autocannon({
        ...testConfig,
        url: `${config.url}/health`
      });

      const analysis = {
        connections,
        timestamp: new Date().toISOString(),
        requestsPerSecond: result.requests.average,
        latencyP99: result.latency.p99,
        errors: result.errors,
        timeouts: result.timeouts
      };

      results.push(analysis);
      
      console.log(`   ✅ ${connections} connexions: ${result.requests.average.toFixed(2)} req/s, P99: ${result.latency.p99.toFixed(2)}ms`);
      
      // Pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error(`   ❌ Erreur avec ${connections} connexions:`, error.message);
    }
  }

  return results;
}

// Test de stress (charge maximale)
async function runStressTest() {
  console.log('\n💥 TEST DE STRESS');
  console.log('==================');
  
  const stressConfig = {
    ...config,
    connections: 500,
    duration: 120,
    timeout: 30
  };

  try {
    const result = await autocannon({
      ...stressConfig,
      url: `${config.url}/health`
    });

    console.log(`\n📊 Résultats du test de stress:`);
    console.log(`   - Connexions: ${stressConfig.connections}`);
    console.log(`   - Durée: ${stressConfig.duration}s`);
    console.log(`   - Requêtes totales: ${result.requests.total}`);
    console.log(`   - Requêtes/sec: ${result.requests.average.toFixed(2)}`);
    console.log(`   - Latence P99: ${result.latency.p99.toFixed(2)}ms`);
    console.log(`   - Erreurs: ${result.errors}`);
    console.log(`   - Timeouts: ${result.timeouts}`);

    return result;
  } catch (error) {
    console.error(`❌ Erreur lors du test de stress:`, error.message);
    return null;
  }
}

// Test de récupération
async function runRecoveryTest() {
  console.log('\n🔄 TEST DE RÉCUPÉRATION');
  console.log('==========================');
  
  // Test normal
  console.log('1️⃣ Test de charge normale...');
  const normalResult = await autocannon({
    ...config,
    connections: 50,
    duration: 30,
    url: `${config.url}/health`
  });

  // Test de stress
  console.log('2️⃣ Test de stress...');
  const stressResult = await autocannon({
    ...config,
    connections: 300,
    duration: 60,
    url: `${config.url}/health`
  });

  // Test de récupération
  console.log('3️⃣ Test de récupération...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  const recoveryResult = await autocannon({
    ...config,
    connections: 50,
    duration: 30,
    url: `${config.url}/health`
  });

  // Analyse de la récupération
  const normalRPS = normalResult.requests.average;
  const stressRPS = stressResult.requests.average;
  const recoveryRPS = recoveryResult.requests.average;

  console.log(`\n📊 Analyse de la récupération:`);
  console.log(`   - Performance normale: ${normalRPS.toFixed(2)} req/s`);
  console.log(`   - Performance sous stress: ${stressRPS.toFixed(2)} req/s`);
  console.log(`   - Performance après récupération: ${recoveryRPS.toFixed(2)} req/s`);
  
  const recoveryRate = (recoveryRPS / normalRPS) * 100;
  console.log(`   - Taux de récupération: ${recoveryRate.toFixed(1)}%`);

  return {
    normal: normalResult,
    stress: stressResult,
    recovery: recoveryResult,
    recoveryRate
  };
}

// Fonction principale
async function main() {
  console.log('🚀 TESTS DE CHARGE PRODUCTION CREALIA');
  console.log('=====================================');
  console.log(`🎯 Cible: ${config.url}`);
  console.log(`⏰ Démarrage: ${new Date().toLocaleString()}`);
  
  const allResults = {
    timestamp: new Date().toISOString(),
    target: config.url,
    scenarios: [],
    progressive: [],
    stress: null,
    recovery: null
  };

  try {
    // Tests des scénarios individuels
    console.log('\n📋 TESTS DES SCÉNARIOS');
    console.log('========================');
    
    for (const scenario of scenarios) {
      const result = await runLoadTest(scenario);
      allResults.scenarios.push(result);
    }

    // Test de charge progressif
    allResults.progressive = await runProgressiveLoadTest();

    // Test de stress
    allResults.stress = await runStressTest();

    // Test de récupération
    allResults.recovery = await runRecoveryTest();

    // Sauvegarde des résultats
    const resultsDir = path.join(__dirname, 'results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    const filename = `load-test-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    const filepath = path.join(resultsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(allResults, null, 2));
    
    console.log(`\n💾 Résultats sauvegardés dans: ${filepath}`);
    
    // Résumé final
    console.log('\n🎉 TOUS LES TESTS TERMINÉS AVEC SUCCÈS !');
    console.log('==========================================');
    
  } catch (error) {
    console.error('\n❌ ERREUR LORS DES TESTS:', error.message);
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
  runProgressiveLoadTest,
  runStressTest,
  runRecoveryTest
};




