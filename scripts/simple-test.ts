#!/usr/bin/env ts-node

async function simpleTest() {
  console.log("🧪 Test simple des services Creati...\n");

  // Test 1: Templates de contenu
  console.log("1️⃣ Test des templates de contenu...");
  try {
    const { ContentTemplateService } = require("../lib/ai/content-templates");
    const templates = ContentTemplateService.getTemplates();
    console.log(`✅ ${templates.length} templates trouvés`);
    
    const aidaTemplates = ContentTemplateService.getTemplates("AIDA");
    console.log(`✅ ${aidaTemplates.length} templates AIDA trouvés`);
    
    const linkedinTemplates = ContentTemplateService.getTemplates(undefined, undefined, "LINKEDIN");
    console.log(`✅ ${linkedinTemplates.length} templates LinkedIn trouvés`);
  } catch (error) {
    console.log(`❌ Erreur templates: ${error}`);
  }

  // Test 2: Dépendances
  console.log("\n2️⃣ Test des dépendances...");
  try {
    require("@langchain/openai");
    console.log("✅ LangChain OpenAI disponible");
    
    require("react-big-calendar");
    console.log("✅ react-big-calendar disponible");
    
    require("docx");
    console.log("✅ docx disponible");
    
    require("csv-stringify");
    console.log("✅ csv-stringify disponible");
    
    require("html-to-pdf");
    console.log("✅ html-to-pdf disponible");
    
    require("twitter-api-v2");
    console.log("✅ twitter-api-v2 disponible");
    
    require("googleapis");
    console.log("✅ googleapis disponible");
    
  } catch (error) {
    console.log(`❌ Erreur dépendances: ${error}`);
  }

  // Test 3: Variables d'environnement
  console.log("\n3️⃣ Test des variables d'environnement...");
  const requiredEnvVars = [
    "DATABASE_URL",
    "OPENAI_API_KEY",
    "LANGCHAIN_API_KEY"
  ];

  const optionalEnvVars = [
    "LINKEDIN_CLIENT_ID",
    "TWITTER_CLIENT_ID",
    "INSTAGRAM_CLIENT_ID",
    "YOUTUBE_CLIENT_ID",
    "TIKTOK_CLIENT_ID",
    "FACEBOOK_CLIENT_ID"
  ];

  console.log("Variables requises:");
  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: configurée`);
    } else {
      console.log(`❌ ${envVar}: manquante`);
    }
  });

  console.log("\nVariables optionnelles (APIs sociales):");
  optionalEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: configurée`);
    } else {
      console.log(`⚠️  ${envVar}: non configurée (optionnelle)`);
    }
  });

  console.log("\n🎉 Test simple terminé !");
  console.log("\n📋 Prochaines étapes:");
  console.log("1. Configurer les variables d'environnement manquantes");
  console.log("2. Démarrer PostgreSQL et exécuter les migrations");
  console.log("3. Tester les APIs sociales avec de vraies clés");
  console.log("4. Lancer les tests complets avec Jest");
}

// Exécuter les tests
if (require.main === module) {
  simpleTest().catch(console.error);
}

export { simpleTest };
