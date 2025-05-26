#!/bin/bash

# Script de sauvegarde Git pour le projet Heresse PWA
# Utilisation: ./save.sh "Message du commit"

echo "🔄 Sauvegarde du projet Heresse PWA..."

# Aller dans le répertoire racine du projet
cd "/workspaces/Heresse-PWA-VSCODE-GITHUB"

# Ajouter tous les fichiers source (en excluant node_modules grâce au .gitignore)
echo "📁 Ajout des fichiers source..."
git add "horizons-export-1ce9fc5e-d534-4412-9c38-1c21a18adab9 (1)/src/"
git add "horizons-export-1ce9fc5e-d534-4412-9c38-1c21a18adab9 (1)/.gitignore"

# Vérifier s'il y a des changements à committer
if [ -z "$(git diff --cached --name-only)" ]; then
    echo "ℹ️  Aucun changement à sauvegarder."
    exit 0
fi

# Message du commit (utiliser l'argument ou un message par défaut)
MESSAGE=${1:-"💾 Sauvegarde automatique des modifications"}

# Créer le commit
echo "💾 Création du commit..."
git commit -m "$MESSAGE"

# Pousser vers GitHub
echo "⬆️  Envoi vers GitHub..."
git push origin main

echo "✅ Sauvegarde terminée avec succès !"
echo "🔗 Vos changements sont maintenant sur GitHub."
