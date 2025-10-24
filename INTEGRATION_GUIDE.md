# 🔌 Guide d'intégration - Créalia Studio V2

## 📋 Étapes d'intégration dans votre app existante

### Étape 1 : Remplacer l'ancien composant

Vous avez actuellement `components/crealia-studio-interface.tsx` (l'ancien).  
Le nouveau est `components/crealia-studio-interface-v2.tsx`.

**Option A : Remplacement complet**

```bash
# Renommer l'ancien (backup)
mv components/crealia-studio-interface.tsx components/crealia-studio-interface.old.tsx

# Renommer le nouveau
mv components/crealia-studio-interface-v2.tsx components/crealia-studio-interface.tsx
```

Ensuite, mettez à jour les imports dans votre app.

**Option B : Coexistence temporaire**

Gardez les deux versions et utilisez le nouveau :

```tsx
// Au lieu de
import { CrealiaStudioInterface } from '@/components/crealia-studio-interface'

// Utilisez
import { CrealiaStudioInterfaceV2 } from '@/components/crealia-studio-interface-v2'
```

---

### Étape 2 : Créer les répertoires nécessaires

```bash
# Répertoires pour uploads
mkdir -p public/uploads/crealia
mkdir -p public/uploads/brand

# Permissions (si nécessaire)
chmod 755 public/uploads/crealia
chmod 755 public/uploads/brand
```

---

### Étape 3 : Configuration environnement

Ajoutez dans votre `.env.local` :

```bash
# Créalia Studio
CREALIA_MOCK=true
UPLOAD_MAX_SIZE_MB=2048
STORAGE_PROVIDER=local
ANALYTICS_ENABLED=true
```

---

### Étape 4 : Intégration dans la navigation

#### Si vous avez un Header/Navigation component

Exemple dans `components/navigation.tsx` ou `components/header.tsx` :

```tsx
import { CrealiaStudioInterfaceV2 } from '@/components/crealia-studio-interface-v2'
import { useState } from 'react'

export function Navigation() {
  const [isStudioOpen, setIsStudioOpen] = useState(false)

  return (
    <>
      <nav>
        {/* Vos autres liens */}
        <button 
          onClick={() => setIsStudioOpen(true)}
          className="nav-link"
        >
          🎬 Créalia Studio
        </button>
      </nav>

      {/* Interface Studio */}
      <CrealiaStudioInterfaceV2
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
      />
    </>
  )
}
```

#### Si vous avez une page dédiée

Créez ou modifiez `app/studio/page.tsx` :

```tsx
'use client'

import { CrealiaStudioInterfaceV2 } from '@/components/crealia-studio-interface-v2'
import { useRouter } from 'next/navigation'

export default function StudioPage() {
  const router = useRouter()

  return (
    <CrealiaStudioInterfaceV2
      isOpen={true}
      onClose={() => router.push('/')}
    />
  )
}
```

---

### Étape 5 : Vérification des dépendances

Assurez-vous que vous avez toutes les dépendances shadcn/ui nécessaires :

```bash
# Si manquantes, installez :
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
```

Ou vérifiez dans `components/ui/`.

---

### Étape 6 : Import des icônes Lucide

Si pas déjà installé :

```bash
npm install lucide-react
```

Les icônes utilisées :
- `Upload`, `X`, `HelpCircle`, `Settings`, `Play`, `Download`
- `AlertCircle`, `CheckCircle`, `Loader2`

---

### Étape 7 : Vérification des types

Assurez-vous que `tsconfig.json` inclut :

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

### Étape 8 : Test initial

```bash
# Démarrer le dev server
npm run dev

# Ouvrir http://localhost:3000
# Cliquer sur "Créalia Studio"
```

**Vérifications :**
- ✅ Interface s'affiche
- ✅ Sidebar visible avec catégories
- ✅ Outils affichés en grille
- ✅ Clic sur un outil ouvre le panneau droit
- ✅ Zone d'upload visible
- ✅ Formulaire de paramètres visible

---

### Étape 9 : Test complet du flow

1. **Sélectionner "Générateur de Reels IA"**
2. **Uploader un fichier test** (MP4 ou JPG)
3. **Attendre message "Fichier uploadé ✅"**
4. **Vérifier analyse automatique** (si vidéo)
5. **Cliquer preset "Viral & Fun"**
6. **Cliquer "Générer"**
7. **Attendre progression** (~5 sec en MOCK)
8. **Vérifier résultats affichés**
9. **Cliquer "Télécharger"**

Si tout fonctionne → ✅ Intégration réussie !

---

## 🔧 Troubleshooting

### Erreur : "Module not found @/components/ui/..."

**Solution :**
```bash
# Installer les composants shadcn manquants
npx shadcn-ui@latest add [component-name]
```

### Erreur : "Cannot find module 'lucide-react'"

**Solution :**
```bash
npm install lucide-react
```

### L'interface ne s'affiche pas

**Vérifications :**
1. `isOpen={true}` ou state géré correctement ?
2. z-index conflits ? (interface utilise `z-[100]`)
3. Console browser : erreurs JavaScript ?

### Upload échoue

**Vérifications :**
1. Répertoire `public/uploads/crealia` existe ?
2. Permissions correctes ?
3. Fichier < 2GB ?
4. Format valide (mp4, mov, webm, jpg, png, webp) ?

### Jobs bloqués sur "queued"

**En mode MOCK :** Normal, simule 5 secondes de processing.

**Si > 10 secondes :**
1. Console browser : erreurs ?
2. Network tab : `/api/crealia/jobs/[id]` appelé ?
3. Vérifier `CREALIA_MOCK=true` dans `.env.local`

### Analyse ne retourne pas de scènes

**Vérifier :**
```bash
# Dans .env.local
CREALIA_MOCK=true
```

Si `false`, le mode production est activé (nécessite FFmpeg).

---

## 🎨 Customisation rapide

### Changer les couleurs

Dans `crealia-studio-interface-v2.tsx`, cherchez :

```tsx
// Primary color
className="bg-primary/10 text-primary"

// Hover states
className="hover:bg-secondary/50"
```

Modifiez selon votre design system.

### Ajouter votre logo

Dans le header :

```tsx
<h2 className="text-2xl font-bold flex items-center gap-2">
  <img src="/your-logo.png" alt="Logo" className="w-8 h-8" />
  Créalia Studio
</h2>
```

### Personnaliser les messages

Tous les textes sont en dur dans le composant. Cherchez et remplacez :

```tsx
// Exemples
"Bienvenue dans Créalia Studio 👋"
"Fichier reçu ✅"
"Génération lancée"
```

Pour i18n futur, utilisez `next-intl` ou `react-i18next`.

---

## 📊 Monitoring

### Analytics

Les events sont envoyés à `/api/analytics/event`. Vérifiez que cet endpoint existe.

Si pas encore créé :

```typescript
// app/api/analytics/event/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log('[Analytics]', body.type, body.metadata)
  
  // Stockez dans DB ou service analytics
  
  return NextResponse.json({ success: true })
}
```

### Logs serveur

Tous les logs Créalia Studio sont préfixés :

```bash
[Créalia Studio] File uploaded: media_xyz by user 123
[Créalia Studio] Job created: job_abc for tool reels-generator
```

Filtrez avec :

```bash
npm run dev | grep "\[Créalia Studio\]"
```

---

## 🚀 Déploiement

### Vercel

1. Push sur GitHub
2. Vercel auto-deploy
3. Configurer variables env dans Vercel dashboard
4. Vérifier build logs

### Variables essentielles en production

```bash
CREALIA_MOCK=true  # Pour commencer
DATABASE_URL=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-domain.com
```

---

## ✅ Checklist finale

- [ ] Ancien composant sauvegardé/remplacé
- [ ] Répertoires uploads créés
- [ ] Variables env configurées
- [ ] Dépendances installées
- [ ] Intégré dans navigation/page
- [ ] Test : interface s'ouvre
- [ ] Test : upload fonctionne
- [ ] Test : génération produit résultats
- [ ] Test : téléchargement fonctionne
- [ ] Analytics trackent les events
- [ ] Logs serveur visibles
- [ ] Déployé (si applicable)

---

## 📞 Support

**Problème technique ?**
1. Consultez `docs/FEATURE-CREALIA-STUDIO.md`
2. Vérifiez `CREALIA_STUDIO_QUICKSTART.md`
3. Tests E2E : `e2e/crealia-studio.spec.ts` (exemples)
4. Créez une issue avec :
   - Erreur exacte
   - Steps to reproduce
   - Console logs
   - Browser/OS

---

**Bonne intégration ! 🎬✨**
