# Guide d'Intégration Supabase - Application de Dating

## 📋 Vue d'ensemble

Cette documentation détaille l'intégration complète de Supabase dans l'application de dating, remplaçant les données mockées par une infrastructure backend réelle.

## 🏗️ Architecture

### Services Supabase
- **`authService`** - Authentification (signup, signin, signout)
- **`profilesService`** - Gestion des profils utilisateurs
- **`photosService`** - Upload et gestion des photos publiques
- **`swipesService`** - Système de like/dislike et recommandations
- **`matchesService`** - Détection et gestion des matches
- **`messagesService`** - Chat en temps réel entre utilisateurs

### Hooks Personnalisés
- **`useSwipes`** - Hook pour le système de swipe
- **`useMatches`** - Hook pour la gestion des matches
- **`useMessages`** - Hook pour le chat en temps réel
- **`useProfiles`** - Hook pour les profils utilisateurs

## 🚀 Utilisation

### 1. Configuration initiale

Assurez-vous que les variables d'environnement sont configurées dans `.env` :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_publique
```

### 2. Utilisation du UserContext

```jsx
import { useUser } from '../contexts/UserContext.jsx';

function MonComposant() {
  const { 
    currentUser, 
    signIn, 
    signUp, 
    signOut, 
    updateBio,
    loading,
    error 
  } = useUser();

  // Connexion
  const handleSignIn = async (email, password) => {
    const result = await signIn(email, password);
    if (result.success) {
      console.log('Connecté !');
    }
  };

  return (
    <div>
      {currentUser ? (
        <p>Bonjour {currentUser.name}</p>
      ) : (
        <button onClick={() => handleSignIn('test@example.com', 'password')}>
          Se connecter
        </button>
      )}
    </div>
  );
}
```

### 3. Système de Swipe

```jsx
import { useSwipes } from '../hooks/useSwipes.js';

function SwipeComponent() {
  const { 
    profiles, 
    loading, 
    stats, 
    actions: { like, dislike } 
  } = useSwipes();

  const handleLike = async (userId) => {
    const result = await like(userId);
    if (result.isMatch) {
      console.log('C\'est un match ! 🎉');
    }
  };

  return (
    <div>
      {profiles.map(profile => (
        <div key={profile.id}>
          <h3>{profile.full_name}</h3>
          <button onClick={() => handleLike(profile.id)}>👍</button>
          <button onClick={() => dislike(profile.id)}>👎</button>
        </div>
      ))}
    </div>
  );
}
```

### 4. Gestion des Matches

```jsx
import { useMatches } from '../hooks/useMatches.js';

function MatchesComponent() {
  const { 
    matches, 
    newMatches, 
    totalUnread,
    actions: { unmatch, loadMatches } 
  } = useMatches();

  return (
    <div>
      <h2>Mes Matches ({matches.length})</h2>
      <p>Nouveaux matches: {newMatches.length}</p>
      <p>Messages non lus: {totalUnread}</p>
      
      {matches.map(match => (
        <div key={match.id}>
          <h4>{match.partnerName}</h4>
          <button onClick={() => unmatch(match.id)}>
            Supprimer le match
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 5. Chat en Temps Réel

```jsx
import { useMessages } from '../hooks/useMessages.js';
import { useState } from 'react';

function ChatComponent({ matchId }) {
  const { 
    messages, 
    sending, 
    actions: { sendMessage, markAsRead } 
  } = useMessages(matchId);
  
  const [newMessage, setNewMessage] = useState('');

  const handleSend = async () => {
    if (newMessage.trim()) {
      await sendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={msg.isOwn ? 'own' : 'other'}>
            <p>{msg.content}</p>
            <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      
      <div className="send-message">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Tapez votre message..."
        />
        <button onClick={handleSend} disabled={sending}>
          {sending ? 'Envoi...' : 'Envoyer'}
        </button>
      </div>
    </div>
  );
}
```

## 🔧 Services Détaillés

### AuthService

```jsx
import { authService } from '../services/supabase/auth.js';

// Inscription
const signUpResult = await authService.signUp('email@example.com', 'password', {
  full_name: 'John Doe',
  age: 25,
  city: 'Paris'
});

// Connexion
const signInResult = await authService.signIn('email@example.com', 'password');

// Déconnexion
const signOutResult = await authService.signOut();
```

### ProfilesService

```jsx
import { profilesService } from '../services/supabase/profiles.js';

// Obtenir un profil
const profile = await profilesService.getProfile(userId);

// Mettre à jour un profil
const updateResult = await profilesService.updateProfile(userId, {
  bio: 'Nouvelle bio',
  age: 26
});

// Obtenir les recommandations
const recommendations = await profilesService.getSwipeRecommendations(10);
```

### SwipesService

```jsx
import { swipesService } from '../services/supabase/swipes.js';

// Effectuer un swipe
const swipeResult = await swipesService.recordSwipe(targetUserId, true); // true = like

// Obtenir les recommandations
const recommendations = await swipesService.getSwipeRecommendations(10);

// Obtenir les statistiques
const stats = await swipesService.getSwipeStats();
```

## 🧪 Tests

Un composant de test est disponible pour vérifier l'intégration :

```jsx
import SupabaseIntegrationTest from '../components/test/SupabaseIntegrationTest.jsx';

// Utiliser ce composant pour tester l'intégration complète
<SupabaseIntegrationTest />
```

## 📊 Structure de la Base de Données

La structure complète est définie dans `db-mapping.json` :

- **user_profiles** - Profils utilisateurs
- **public_photos** - Photos publiques des profils
- **private_galleries** - Galeries privées payantes
- **swipes** - Historique des likes/dislikes
- **matches** - Matches entre utilisateurs
- **messages** - Messages du chat
- **user_stories** - Stories temporaires

## 🔐 Sécurité

- **RLS (Row Level Security)** activé sur toutes les tables
- **Policies** configurées pour protéger les données
- **Authentification** requise pour toutes les opérations
- **Validation** côté client et serveur

## 🚨 Gestion d'Erreurs

Tous les services retournent un objet avec cette structure :

```jsx
{
  success: boolean,
  data?: any,
  error?: string
}
```

Exemple de gestion d'erreur :

```jsx
const result = await swipesService.recordSwipe(userId, true);
if (!result.success) {
  console.error('Erreur:', result.error);
  // Gérer l'erreur
}
```

## 📈 Performance

- **Pagination** implémentée pour les listes longues
- **Cache local** dans les hooks pour éviter les re-fetch
- **Subscriptions temps réel** pour les messages
- **Optimistic updates** pour une meilleure UX

## 🔄 Migration des Données Mockées

Les données existantes dans `userData.js` continuent de fonctionner comme fallback. L'intégration se fait progressivement :

1. ✅ UserContext adapté pour Supabase
2. ✅ Services backend créés
3. ✅ Hooks personnalisés implémentés
4. ✅ Composants UI existants compatibles
5. 🔄 Migration progressive des fonctionnalités

## 🎯 Prochaines Étapes

1. **Tests complets** avec le composant de test
2. **Optimisation** des performances
3. **Features avancées** (notifications push, géolocalisation)
4. **Analytics** et métriques utilisateur
5. **Modération** de contenu

## 💡 Tips & Bonnes Pratiques

1. **Toujours vérifier** les résultats des services
2. **Gérer les états de chargement** dans l'UI
3. **Implémenter des fallbacks** pour les erreurs réseau
4. **Utiliser les hooks** plutôt que les services directement
5. **Tester en local** avant la production

## 📞 Support

En cas de problème :
1. Vérifier les logs de la console
2. Utiliser le composant de test
3. Vérifier la configuration Supabase
4. Consulter la documentation officielle de Supabase
