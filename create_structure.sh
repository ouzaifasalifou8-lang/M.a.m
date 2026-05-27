#!/bin/bash
mkdir -p app/{auth,public,account,seller/dashboard,admin/{products,orders,sellers,deliveries,technicians,settings},checkout,installation}
mkdir -p components/{admin,ui}
mkdir -p lib/{supabase,payments,whatsapp,utils}
mkdir -p .github/workflows
touch .github/workflows/deploy.yml
# Créez les fichiers de base
touch app/(auth)/login/page.tsx app/(auth)/register/page.tsx app/(auth)/layout.tsx
# Ajoutez ici le reste des touch pour vos fichiers .tsx spécifiques...
echo "Structure créée avec succès !"
