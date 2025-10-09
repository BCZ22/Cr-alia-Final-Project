/*
// =============================================================================
// SEED DATA - TEMPLATES DE CARROUSELS PAR DÉFAUT
// =============================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const carouselTemplates = [
  // Templates Business
  {
    name: 'Business Professional',
    description: 'Template professionnel pour présenter des services ou produits business',
    category: 'Business',
    thumbnail: 'https://via.placeholder.com/300x300/2563eb/ffffff?text=Business',
    layout: {
      slides: 5,
      structure: 'vertical',
      titleSlide: true,
      contentSlides: 3,
      ctaSlide: true,
      elements: [
        { type: 'title', position: { x: 50, y: 30 }, fontSize: 48, fontWeight: 'bold' },
        { type: 'subtitle', position: { x: 50, y: 45 }, fontSize: 24, fontWeight: 'normal' },
        { type: 'content', position: { x: 50, y: 60 }, fontSize: 20, fontWeight: 'normal' },
        { type: 'cta', position: { x: 50, y: 80 }, fontSize: 18, fontWeight: 'bold' }
      ]
    },
    theme: {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#1e293b',
        textSecondary: '#64748b'
      },
      fonts: {
        primary: 'Inter',
        secondary: 'Arial'
      },
      spacing: {
        margin: 40,
        padding: 30
      }
    },
    slideCount: 5,
    isPublic: true,
    isPremium: false,
    tags: ['business', 'professional', 'corporate', 'services']
  },

  {
    name: 'Marketing Modern',
    description: 'Template moderne et coloré pour les campagnes marketing',
    category: 'Marketing',
    thumbnail: 'https://via.placeholder.com/300x300/ec4899/ffffff?text=Marketing',
    layout: {
      slides: 6,
      structure: 'grid',
      titleSlide: true,
      contentSlides: 4,
      ctaSlide: true,
      elements: [
        { type: 'title', position: { x: 50, y: 25 }, fontSize: 52, fontWeight: 'bold' },
        { type: 'subtitle', position: { x: 50, y: 40 }, fontSize: 22, fontWeight: 'medium' },
        { type: 'content', position: { x: 50, y: 55 }, fontSize: 18, fontWeight: 'normal' },
        { type: 'cta', position: { x: 50, y: 75 }, fontSize: 20, fontWeight: 'bold' }
      ]
    },
    theme: {
      colors: {
        primary: '#ec4899',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        background: '#f8fafc',
        text: '#1e293b',
        textSecondary: '#64748b'
      },
      fonts: {
        primary: 'Poppins',
        secondary: 'Inter'
      },
      spacing: {
        margin: 35,
        padding: 25
      }
    },
    slideCount: 6,
    isPublic: true,
    isPremium: false,
    tags: ['marketing', 'modern', 'colorful', 'campaign']
  },

  // Templates Éducation
  {
    name: 'Educational Clean',
    description: 'Template épuré pour contenu éducatif et formations',
    category: 'Education',
    thumbnail: 'https://via.placeholder.com/300x300/059669/ffffff?text=Education',
    layout: {
      slides: 7,
      structure: 'vertical',
      titleSlide: true,
      contentSlides: 5,
      ctaSlide: true,
      elements: [
        { type: 'title', position: { x: 50, y: 20 }, fontSize: 44, fontWeight: 'bold' },
        { type: 'subtitle', position: { x: 50, y: 35 }, fontSize: 20, fontWeight: 'normal' },
        { type: 'content', position: { x: 50, y: 50 }, fontSize: 16, fontWeight: 'normal' },
        { type: 'bullet', position: { x: 15, y: 65 }, fontSize: 18, fontWeight: 'normal' },
        { type: 'cta', position: { x: 50, y: 85 }, fontSize: 16, fontWeight: 'medium' }
      ]
    },
    theme: {
      colors: {
        primary: '#059669',
        secondary: '#6b7280',
        accent: '#0891b2',
        background: '#ffffff',
        text: '#111827',
        textSecondary: '#6b7280'
      },
      fonts: {
        primary: 'Roboto',
        secondary: 'Arial'
      },
      spacing: {
        margin: 45,
        padding: 35
      }
    },
    slideCount: 7,
    isPublic: true,
    isPremium: false,
    tags: ['education', 'clean', 'training', 'learning']
  },

  // Templates Lifestyle
  {
    name: 'Lifestyle Vibrant',
    description: 'Template dynamique pour contenu lifestyle et inspiration',
    category: 'Lifestyle',
    thumbnail: 'https://via.placeholder.com/300x300/f59e0b/ffffff?text=Lifestyle',
    layout: {
      slides: 4,
      structure: 'centered',
      titleSlide: true,
      contentSlides: 2,
      ctaSlide: true,
      elements: [
        { type: 'title', position: { x: 50, y: 30 }, fontSize: 56, fontWeight: 'bold' },
        { type: 'content', position: { x: 50, y: 50 }, fontSize: 22, fontWeight: 'normal' },
        { type: 'cta', position: { x: 50, y: 75 }, fontSize: 24, fontWeight: 'bold' }
      ]
    },
    theme: {
      colors: {
        primary: '#f59e0b',
        secondary: '#ef4444',
        accent: '#10b981',
        background: '#fef3c7',
        text: '#92400e',
        textSecondary: '#a16207'
      },
      fonts: {
        primary: 'Playfair Display',
        secondary: 'Open Sans'
      },
      spacing: {
        margin: 30,
        padding: 20
      }
    },
    slideCount: 4,
    isPublic: true,
    isPremium: false,
    tags: ['lifestyle', 'vibrant', 'inspiration', 'personal']
  },

  // Templates Premium
  {
    name: 'Premium Corporate',
    description: 'Template premium pour grandes entreprises et présentations importantes',
    category: 'Premium',
    thumbnail: 'https://via.placeholder.com/300x300/1f2937/ffffff?text=Premium',
    layout: {
      slides: 8,
      structure: 'advanced',
      titleSlide: true,
      contentSlides: 6,
      ctaSlide: true,
      elements: [
        { type: 'title', position: { x: 50, y: 25 }, fontSize: 48, fontWeight: 'bold' },
        { type: 'subtitle', position: { x: 50, y: 38 }, fontSize: 24, fontWeight: 'medium' },
        { type: 'content', position: { x: 50, y: 52 }, fontSize: 18, fontWeight: 'normal' },
        { type: 'stats', position: { x: 50, y: 68 }, fontSize: 20, fontWeight: 'bold' },
        { type: 'cta', position: { x: 50, y: 82 }, fontSize: 18, fontWeight: 'bold' }
      ]
    },
    theme: {
      colors: {
        primary: '#1f2937',
        secondary: '#6b7280',
        accent: '#d97706',
        background: '#ffffff',
        text: '#111827',
        textSecondary: '#4b5563'
      },
      fonts: {
        primary: 'Montserrat',
        secondary: 'Source Sans Pro'
      },
      spacing: {
        margin: 50,
        padding: 40
      }
    },
    slideCount: 8,
    isPublic: true,
    isPremium: true,
    tags: ['premium', 'corporate', 'executive', 'presentation']
  },

  {
    name: 'Creative Artist',
    description: 'Template créatif pour artistes et contenu visuel',
    category: 'Creative',
    thumbnail: 'https://via.placeholder.com/300x300/7c3aed/ffffff?text=Creative',
    layout: {
      slides: 5,
      structure: 'asymmetric',
      titleSlide: true,
      contentSlides: 3,
      ctaSlide: true,
      elements: [
        { type: 'title', position: { x: 30, y: 20 }, fontSize: 50, fontWeight: 'bold' },
        { type: 'content', position: { x: 70, y: 45 }, fontSize: 20, fontWeight: 'normal' },
        { type: 'cta', position: { x: 50, y: 80 }, fontSize: 22, fontWeight: 'bold' }
      ]
    },
    theme: {
      colors: {
        primary: '#7c3aed',
        secondary: '#ec4899',
        accent: '#06b6d4',
        background: '#f3f4f6',
        text: '#1f2937',
        textSecondary: '#6b7280'
      },
      fonts: {
        primary: 'Oswald',
        secondary: 'Lato'
      },
      spacing: {
        margin: 25,
        padding: 15
      }
    },
    slideCount: 5,
    isPublic: true,
    isPremium: true,
    tags: ['creative', 'artist', 'visual', 'design']
  },

  // Templates Tech
  {
    name: 'Tech Innovation',
    description: 'Template moderne pour startups tech et innovations',
    category: 'Technology',
    thumbnail: 'https://via.placeholder.com/300x300/0ea5e9/ffffff?text=Tech',
    layout: {
      slides: 6,
      structure: 'minimal',
      titleSlide: true,
      contentSlides: 4,
      ctaSlide: true,
      elements: [
        { type: 'title', position: { x: 50, y: 30 }, fontSize: 46, fontWeight: 'bold' },
        { type: 'subtitle', position: { x: 50, y: 45 }, fontSize: 20, fontWeight: 'light' },
        { type: 'content', position: { x: 50, y: 60 }, fontSize: 16, fontWeight: 'normal' },
        { type: 'cta', position: { x: 50, y: 80 }, fontSize: 18, fontWeight: 'medium' }
      ]
    },
    theme: {
      colors: {
        primary: '#0ea5e9',
        secondary: '#64748b',
        accent: '#84cc16',
        background: '#ffffff',
        text: '#0f172a',
        textSecondary: '#475569'
      },
      fonts: {
        primary: 'Inter',
        secondary: 'Roboto'
      },
      spacing: {
        margin: 60,
        padding: 50
      }
    },
    slideCount: 6,
    isPublic: true,
    isPremium: false,
    tags: ['tech', 'startup', 'innovation', 'minimal']
  },

  // Templates Fitness/Santé
  {
    name: 'Health & Fitness',
    description: 'Template énergique pour contenu santé et fitness',
    category: 'Health',
    thumbnail: 'https://via.placeholder.com/300x300/ef4444/ffffff?text=Health',
    layout: {
      slides: 5,
      structure: 'dynamic',
      titleSlide: true,
      contentSlides: 3,
      ctaSlide: true,
      elements: [
        { type: 'title', position: { x: 50, y: 25 }, fontSize: 52, fontWeight: 'bold' },
        { type: 'content', position: { x: 50, y: 50 }, fontSize: 20, fontWeight: 'normal' },
        { type: 'stats', position: { x: 50, y: 70 }, fontSize: 24, fontWeight: 'bold' },
        { type: 'cta', position: { x: 50, y: 85 }, fontSize: 22, fontWeight: 'bold' }
      ]
    },
    theme: {
      colors: {
        primary: '#ef4444',
        secondary: '#f59e0b',
        accent: '#10b981',
        background: '#fef2f2',
        text: '#991b1b',
        textSecondary: '#dc2626'
      },
      fonts: {
        primary: 'Bebas Neue',
        secondary: 'Roboto'
      },
      spacing: {
        margin: 40,
        padding: 30
      }
    },
    slideCount: 5,
    isPublic: true,
    isPremium: false,
    tags: ['health', 'fitness', 'energy', 'wellness']
  }
];

export async function seedCarouselTemplates() {
  console.log('🌱 Seeding carousel templates...');

  try {
    // Supprimer les templates existants (optionnel)
    await prisma.carouselTemplate.deleteMany({
      where: { isPublic: true }
    });

    // Créer les nouveaux templates
    for (const template of carouselTemplates) {
      await prisma.carouselTemplate.create({
        data: {
          ...template,
          usageCount: Math.floor(Math.random() * 100) + 10 // Usage aléatoire pour démo
        }
      });
    }

    console.log(`✅ ${carouselTemplates.length} templates de carrousels créés avec succès`);
  } catch (error) {
    console.error('❌ Erreur lors du seeding des templates:', error);
    throw error;
  }
}

// Exécuter le seeding si ce fichier est appelé directement
if (require.main === module) {
  seedCarouselTemplates()
    .then(() => {
      console.log('Seeding terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Erreur seeding:', error);
      process.exit(1);
    });
}
*/


