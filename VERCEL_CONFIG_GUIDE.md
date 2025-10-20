# 🔧 CONFIGURATION VERCEL - VARIABLES D'ENVIRONNEMENT

## 🚨 PROBLÈME IDENTIFIÉ

Les déploiements échouent car les **variables d'environnement ne sont pas configurées** sur Vercel.

---

## ✅ SOLUTION: Configurer les Variables

### **Étape 1: Aller dans les Settings**

1. Sur Vercel Dashboard: [vercel.com/anthbcz-9354s-projects/cr-alia-final-project](https://vercel.com/anthbcz-9354s-projects/cr-alia-final-project)
2. Cliquez sur **"Settings"** (en haut)
3. Dans le menu latéral → **"Environment Variables"**

---

### **Étape 2: Ajouter les Variables OBLIGATOIRES**

Cliquez sur **"Add New"** pour chaque variable:

#### **🔑 Secrets Générés (copiez depuis SECRETS_GENERES.txt)**

```bash
# Variable: NEXTAUTH_SECRET
# Value: YyFRhnmQrPjslqzJUA4GTSQh5NcPgrZtncYqi05DdIY=
# Environments: Production, Preview, Development

# Variable: ENCRYPTION_KEY  
# Value: 91a7744a10c7ed8d5e3a1839d0409655d401ddc9af02420498e1b451e5215d09
# Environments: Production, Preview, Development

# Variable: CRON_SECRET
# Value: 28bc2fd336f7eafff4e24a11510657fabe7b2d083726da744a3284832bf61d2d
# Environments: Production, Preview, Development
```

#### **🗄️ Base de Données**

```bash
# Variable: DATABASE_URL
# Value: postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
# Environments: Production, Preview, Development
# NOTE: Créez un projet sur supabase.com si pas encore fait
```

#### **🌐 URL de l'App**

```bash
# Variable: NEXTAUTH_URL
# Value: https://cr-alia-final-project.vercel.app
# Environments: Production
# NOTE: À ajuster avec votre vraie URL après le premier déploiement
```

#### **💳 Stripe (Vous avez déjà ces valeurs)**

```bash
# Variable: STRIPE_SECRET_KEY
# Value: sk_test_... (ou sk_live_... en prod)
# Environments: Production, Preview, Development

# Variable: STRIPE_WEBHOOK_SECRET
# Value: whsec_...
# Environments: Production

# Variable: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# Value: pk_test_... (ou pk_live_... en prod)
# Environments: Production, Preview, Development

# Variable: STRIPE_PRICE_CREATOR_MONTHLY
# Value: price_...
# Environments: Production, Preview, Development

# Variable: STRIPE_PRICE_CREATOR_YEARLY
# Value: price_...
# Environments: Production, Preview, Development

# Variable: STRIPE_PRICE_VIRAL_MONTHLY
# Value: price_...
# Environments: Production, Preview, Development

# Variable: STRIPE_PRICE_VIRAL_YEARLY
# Value: price_...
# Environments: Production, Preview, Development

# Variable: STRIPE_PRICE_PRO_MONTHLY
# Value: price_...
# Environments: Production, Preview, Development

# Variable: STRIPE_PRICE_PRO_YEARLY
# Value: price_...
# Environments: Production, Preview, Development
```

#### **⚙️ Environment**

```bash
# Variable: NEXT_PUBLIC_APP_ENV
# Value: production
# Environments: Production

# Variable: NODE_ENV
# Value: production
# Environments: Production
```

#### **🤖 OpenAI (Optionnel)**

```bash
# Variable: OPENAI_API_KEY
# Value: sk-... (si vous voulez l'IA réelle, sinon mode MOCK)
# Environments: Production, Preview, Development
```

---

### **Étape 3: Redéployer**

Une fois toutes les variables ajoutées:

1. Allez dans **"Deployments"**
2. Trouvez le dernier déploiement (en erreur)
3. Cliquez sur **"..."** (trois points)
4. Cliquez sur **"Redeploy"**
5. Cochez **"Use existing Build Cache"** si proposé
6. Cliquez sur **"Redeploy"**

**OU**

Faites un nouveau commit/push sur GitHub (déploiement auto):

```bash
git commit --allow-empty -m "trigger: redeploy with env vars"
git push
```

---

## 📋 Checklist Rapide

- [ ] Ouvrir Settings → Environment Variables
- [ ] Ajouter NEXTAUTH_SECRET
- [ ] Ajouter ENCRYPTION_KEY
- [ ] Ajouter CRON_SECRET
- [ ] Ajouter DATABASE_URL (Supabase)
- [ ] Ajouter NEXTAUTH_URL
- [ ] Ajouter les 3 clés Stripe
- [ ] Ajouter les 6 Stripe Price IDs
- [ ] Ajouter NEXT_PUBLIC_APP_ENV=production
- [ ] Ajouter NODE_ENV=production
- [ ] (Optionnel) Ajouter OPENAI_API_KEY
- [ ] Redéployer

---

## 🎯 Résultat Attendu

Après configuration et redéploiement:
- ✅ Status: **Ready** (vert)
- ✅ Build: Réussi
- ✅ URL: Fonctionnelle

---

## 🆘 Si Problèmes Persistent

1. **Vérifier les logs** du déploiement dans Vercel
2. **Vérifier que DATABASE_URL** est accessible
3. **Tester le build localement**:
   ```bash
   SKIP_ENV_VALIDATION=true npm run build
   ```

---

## ⏱️ Temps Estimé

- Configuration variables: **10 minutes**
- Redéploiement: **3 minutes**
- **Total: ~13 minutes**

---

**Une fois les variables configurées, votre déploiement réussira ! 🚀**

