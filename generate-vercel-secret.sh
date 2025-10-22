#!/bin/bash
# Script pour générer un secret NextAuth et configurer Vercel
# Créé le 20 Octobre 2025

echo "🔐 Génération du Secret NextAuth pour Vercel"
echo "=============================================="
echo ""

# Générer le secret
SECRET=$(openssl rand -base64 32)

echo "✅ Secret généré avec succès !"
echo ""
echo "📋 COPIEZ CE SECRET :"
echo "----------------------------------------"
echo "$SECRET"
echo "----------------------------------------"
echo ""
echo "📝 PROCHAINES ÉTAPES :"
echo ""
echo "1. Copiez le secret ci-dessus (Cmd+C)"
echo ""
echo "2. Ouvrez votre dashboard Vercel :"
echo "   👉 https://vercel.com/anthbcz-9354s-projects/crealia"
echo ""
echo "3. Allez dans Settings > Environment Variables"
echo ""
echo "4. Ajoutez ces variables (une par une) :"
echo ""
echo "   Variable: NEXTAUTH_SECRET"
echo "   Value: [COLLEZ LE SECRET CI-DESSUS]"
echo "   Environments: ✓ Production ✓ Preview ✓ Development"
echo ""
echo "   Variable: NEXTAUTH_URL"
echo "   Value: https://crealia-anthbcz-9354s-projects.vercel.app"
echo "   Environments: ✓ Production ✓ Preview ✓ Development"
echo ""
echo "   Variable: SKIP_ENV_VALIDATION"
echo "   Value: true"
echo "   Environments: ✓ Production ✓ Preview ✓ Development"
echo ""
echo "   Variable: NEXT_PUBLIC_APP_ENV"
echo "   Value: production"
echo "   Environments: ✓ Production ✓ Preview ✓ Development"
echo ""
echo "   Variable: MOCK"
echo "   Value: true"
echo "   Environments: ✓ Production ✓ Preview ✓ Development"
echo ""
echo "5. Retournez dans Deployments et cliquez 'Redeploy'"
echo ""
echo "6. Attendez 2-3 minutes que le build se termine"
echo ""
echo "7. Ouvrez votre site déployé ! 🎉"
echo ""
echo "=============================================="
echo "💾 Le secret a été sauvegardé dans: .nextauth-secret"
echo ""

# Sauvegarder dans un fichier local
echo "$SECRET" > .nextauth-secret
echo "⚠️  IMPORTANT: Ne commitez JAMAIS ce fichier sur Git !"
echo ""


