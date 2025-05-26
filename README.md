# 💕 Heresse PWA - Application de Rencontres

## 🚀 Dernières modifications (26 Mai 2025)

### ✅ Flux d'authentification corrigé
- **Utilisateurs existants** avec KYC validé → **accès direct à l'accueil** (plus de KYC!)
- **Nouveaux utilisateurs** → processus KYC obligatoire
- Une fois le KYC validé → **plus jamais à refaire**

### 👥 Comptes de test disponibles
- **Email:** `user@example.com` / **Mot de passe:** `password123`
- **Email:** `test@test.com` / **Mot de passe:** `test123`

## 💾 Comment sauvegarder vos modifications

### Option 1: Script automatique (recommandé)
```bash
./save.sh "Description de vos changements"
```

### Option 2: Commandes Git manuelles
```bash
cd "/workspaces/Heresse-PWA-VSCODE-GITHUB"
git add "horizons-export-1ce9fc5e-d534-4412-9c38-1c21a18adab9 (1)/src/"
git commit -m "Votre message de commit"
git push origin main
```

## 🛠️ Développement

### Lancer l'application
```bash
cd "horizons-export-1ce9fc5e-d534-4412-9c38-1c21a18adab9 (1)"
npm run dev
```

### Structure du projet
- `src/` - Code source de l'application
- `src/utils/userDatabase.js` - Système de gestion des utilisateurs
- `src/pages/` - Pages de l'application (Login, Signup, Home, etc.)
- `src/components/` - Composants réutilisables

## 🔐 Système d'authentification

Le nouveau système distingue automatiquement :
1. **Connexion utilisateur existant** → Vérification KYC → Redirection appropriée
2. **Inscription nouvel utilisateur** → KYC obligatoire → Sauvegarde du statut

## 📱 Fonctionnalités

- ✅ Authentification par email/mot de passe
- ✅ Authentification par SMS (simulation)
- ✅ Système KYC intelligent
- ✅ Gestion des profils utilisateur
- ✅ Chat et messagerie
- ✅ Système de matching
- ✅ Galeries privées
- ✅ Interface responsive

---

**🔄 Dernière sauvegarde:** 26 Mai 2025  
**🌐 Serveur de dev:** `http://localhost:5174`
