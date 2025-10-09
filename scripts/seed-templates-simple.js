#!/usr/bin/env node

// =============================================================================
// SCRIPT DE SEEDING SIMPLIFIÉ POUR LES TEMPLATES DE CARROUSEL
// =============================================================================

const fs = require('fs');
const path = require('path');

console.log('🌱 Seeding des templates de carrousel...');

// Données des templates par défaut
const defaultTemplates = [
  {
    id: 'template-business-1',
    name: 'Business Professional',
    description: 'Template professionnel pour les entreprises',
    category: 'Business',
    thumbnail: '/templates/business-1.jpg',
    designData: {
      backgroundColor: '#ffffff',
      textColor: '#333333',
      accentColor: '#2563eb',
      fontFamily: 'Inter',
      layout: 'centered',
      headerStyle: 'bold',
      footerStyle: 'subtle'
    },
    isDefault: true,
    isCustom: false,
    isShared: true,
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    isArchived: false
  },
  {
    id: 'template-marketing-1',
    name: 'Marketing Vibrant',
    description: 'Template coloré pour le marketing',
    category: 'Marketing',
    thumbnail: '/templates/marketing-1.jpg',
    designData: {
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      accentColor: '#f59e0b',
      fontFamily: 'Poppins',
      layout: 'asymmetric',
      headerStyle: 'gradient',
      footerStyle: 'bold'
    },
    isDefault: true,
    isCustom: false,
    isShared: true,
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    isArchived: false
  },
  {
    id: 'template-education-1',
    name: 'Educational Clean',
    description: 'Template épuré pour l\'éducation',
    category: 'Education',
    thumbnail: '/templates/education-1.jpg',
    designData: {
      backgroundColor: '#ffffff',
      textColor: '#374151',
      accentColor: '#10b981',
      fontFamily: 'Roboto',
      layout: 'grid',
      headerStyle: 'clean',
      footerStyle: 'minimal'
    },
    isDefault: true,
    isCustom: false,
    isShared: true,
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    isArchived: false
  },
  {
    id: 'template-lifestyle-1',
    name: 'Lifestyle Modern',
    description: 'Template moderne pour le lifestyle',
    category: 'Lifestyle',
    thumbnail: '/templates/lifestyle-1.jpg',
    designData: {
      backgroundColor: '#fefefe',
      textColor: '#2d3748',
      accentColor: '#e53e3e',
      fontFamily: 'Open Sans',
      layout: 'flowing',
      headerStyle: 'elegant',
      footerStyle: 'stylish'
    },
    isDefault: true,
    isCustom: false,
    isShared: true,
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    isArchived: false
  },
  {
    id: 'template-tech-1',
    name: 'Tech Innovation',
    description: 'Template pour les innovations tech',
    category: 'Technology',
    thumbnail: '/templates/tech-1.jpg',
    designData: {
      backgroundColor: '#0f172a',
      textColor: '#f1f5f9',
      accentColor: '#06b6d4',
      fontFamily: 'JetBrains Mono',
      layout: 'futuristic',
      headerStyle: 'neon',
      footerStyle: 'cyber'
    },
    isDefault: true,
    isCustom: false,
    isShared: true,
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    isArchived: false
  },
  {
    id: 'template-creative-1',
    name: 'Creative Arts',
    description: 'Template créatif pour les arts',
    category: 'Creative',
    thumbnail: '/templates/creative-1.jpg',
    designData: {
      backgroundColor: '#fef7ff',
      textColor: '#581c87',
      accentColor: '#a855f7',
      fontFamily: 'Playfair Display',
      layout: 'artistic',
      headerStyle: 'flourished',
      footerStyle: 'decorative'
    },
    isDefault: true,
    isCustom: false,
    isShared: true,
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    isArchived: false
  },
  {
    id: 'template-health-1',
    name: 'Health Wellness',
    description: 'Template pour la santé et le bien-être',
    category: 'Health',
    thumbnail: '/templates/health-1.jpg',
    designData: {
      backgroundColor: '#f0fdf4',
      textColor: '#14532d',
      accentColor: '#22c55e',
      fontFamily: 'Source Sans Pro',
      layout: 'balanced',
      headerStyle: 'calm',
      footerStyle: 'natural'
    },
    isDefault: true,
    isCustom: false,
    isShared: true,
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    isArchived: false
  },
  {
    id: 'template-premium-1',
    name: 'Premium Luxury',
    description: 'Template premium pour les marques de luxe',
    category: 'Premium',
    thumbnail: '/templates/premium-1.jpg',
    designData: {
      backgroundColor: '#fafafa',
      textColor: '#1a1a1a',
      accentColor: '#d4af37',
      fontFamily: 'Cormorant Garamond',
      layout: 'sophisticated',
      headerStyle: 'luxury',
      footerStyle: 'premium'
    },
    isDefault: true,
    isCustom: false,
    isShared: true,
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    isArchived: false
  },
  {
    id: 'template-minimal-1',
    name: 'Minimalist Clean',
    description: 'Template minimaliste et épuré',
    category: 'Minimal',
    thumbnail: '/templates/minimal-1.jpg',
    designData: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      accentColor: '#6b7280',
      fontFamily: 'Helvetica',
      layout: 'minimal',
      headerStyle: 'ultra-clean',
      footerStyle: 'invisible'
    },
    isDefault: true,
    isCustom: false,
    isShared: true,
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    isArchived: false
  }
];

// Créer le répertoire de données s'il n'existe pas
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Sauvegarder les templates dans un fichier JSON
const templatesFile = path.join(dataDir, 'carousel-templates.json');
fs.writeFileSync(templatesFile, JSON.stringify(defaultTemplates, null, 2));

console.log(`✅ ${defaultTemplates.length} templates sauvegardés dans ${templatesFile}`);

// Créer un fichier de métadonnées
const metadata = {
  generatedAt: new Date().toISOString(),
  version: '1.0.0',
  templateCount: defaultTemplates.length,
  categories: [...new Set(defaultTemplates.map(t => t.category))],
  description: 'Templates de carrousel par défaut pour Crealia'
};

const metadataFile = path.join(dataDir, 'templates-metadata.json');
fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));

console.log(`✅ Métadonnées sauvegardées dans ${metadataFile}`);

// Afficher un résumé
console.log('\n📊 Résumé du seeding:');
console.log(`   • ${defaultTemplates.length} templates créés`);
console.log(`   • ${metadata.categories.length} catégories: ${metadata.categories.join(', ')}`);
console.log(`   • Fichiers créés: ${templatesFile}, ${metadataFile}`);

console.log('\n🎉 Seeding des templates terminé avec succès!');
console.log('\n📋 Prochaines étapes:');
console.log('   1. Les templates sont prêts à être utilisés');
console.log('   2. Vous pouvez maintenant tester les exports de carrousel');
console.log('   3. L\'interface utilisateur peut charger ces templates');

process.exit(0);


