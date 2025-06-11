/**
 * Composant de test pour l'intégration Supabase des swipes
 * À utiliser pour vérifier que l'intégration fonctionne correctement
 */
import React, { useState } from 'react';
import { useSwipes } from '../hooks/useSwipes.js';
import { useMatches } from '../hooks/useMatches.js';
import { useUser } from '../contexts/UserContext.jsx';

const SupabaseIntegrationTest = () => {
  const { currentUser, signIn, signUp, signOut, loading: userLoading, error: userError } = useUser();
  const { 
    profiles, 
    loading: swipesLoading, 
    error: swipesError, 
    stats, 
    actions: swipeActions 
  } = useSwipes();
  const { 
    matches, 
    newMatches, 
    loading: matchesLoading, 
    totalUnread,
    actions: matchActions 
  } = useMatches();

  const [testResults, setTestResults] = useState([]);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('testpassword123');

  const addTestResult = (test, success, message) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      timestamp: new Date().toISOString()
    }]);
  };

  const testAuthentication = async () => {
    try {
      // Test Sign Up
      const signUpResult = await signUp(testEmail, testPassword, {
        full_name: 'Test User',
        age: 25
      });
      
      if (signUpResult.success) {
        addTestResult('Sign Up', true, 'Inscription réussie');
      } else {
        addTestResult('Sign Up', false, signUpResult.error);
      }

      // Test Sign In
      const signInResult = await signIn(testEmail, testPassword);
      
      if (signInResult.success) {
        addTestResult('Sign In', true, 'Connexion réussie');
      } else {
        addTestResult('Sign In', false, signInResult.error);
      }

    } catch (error) {
      addTestResult('Authentication', false, error.message);
    }
  };

  const testSwipeFeatures = async () => {
    try {
      // Test recommandations
      await swipeActions.loadProfiles(5);
      addTestResult('Load Profiles', true, `${profiles.length} profils chargés`);

      // Test stats
      await swipeActions.loadStats();
      addTestResult('Load Stats', true, `Stats: ${stats.totalSwipes} swipes total`);

      // Test swipe (si des profils sont disponibles)
      if (profiles.length > 0) {
        const firstProfile = profiles[0];
        const likeResult = await swipeActions.like(firstProfile.id);
        
        if (likeResult.success) {
          addTestResult('Like Action', true, `Like envoyé${likeResult.isMatch ? ' - Match!' : ''}`);
        } else {
          addTestResult('Like Action', false, likeResult.error);
        }
      }

    } catch (error) {
      addTestResult('Swipe Features', false, error.message);
    }
  };

  const testMatchFeatures = async () => {
    try {
      // Test chargement des matches
      await matchActions.loadMatches();
      addTestResult('Load Matches', true, `${matches.length} matches trouvés`);

      // Test nouveaux matches
      await matchActions.loadNewMatches();
      addTestResult('Load New Matches', true, `${newMatches.length} nouveaux matches`);

      // Test compteur de messages non lus
      await matchActions.loadUnreadCounts();
      addTestResult('Load Unread Counts', true, `${totalUnread} messages non lus`);

    } catch (error) {
      addTestResult('Match Features', false, error.message);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    addTestResult('Test Suite', true, 'Début des tests d\'intégration Supabase...');
    
    await testAuthentication();
    await testSwipeFeatures();
    await testMatchFeatures();
    
    addTestResult('Test Suite', true, 'Tests terminés');
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Chargement de l'utilisateur...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Test d'Intégration Supabase</h1>
        
        {/* Informations utilisateur */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Utilisateur Actuel</h2>
          <p><strong>ID:</strong> {currentUser?.id}</p>
          <p><strong>Nom:</strong> {currentUser?.name}</p>
          <p><strong>Email:</strong> {currentUser?.email}</p>
          <p><strong>Portefeuille:</strong> {currentUser?.walletBalance}€</p>
        </div>

        {/* Statistiques en temps réel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Swipes</h3>
            <p className="text-sm text-blue-600">Profils: {profiles.length}</p>
            <p className="text-sm text-blue-600">Total swipes: {stats.totalSwipes}</p>
            <p className="text-sm text-blue-600">Likes donnés: {stats.likesGiven}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Matches</h3>
            <p className="text-sm text-green-600">Total: {matches.length}</p>
            <p className="text-sm text-green-600">Nouveaux: {newMatches.length}</p>
            <p className="text-sm text-green-600">Messages non lus: {totalUnread}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">État</h3>
            <p className="text-sm text-purple-600">
              Swipes: {swipesLoading ? 'Chargement...' : 'Prêt'}
            </p>
            <p className="text-sm text-purple-600">
              Matches: {matchesLoading ? 'Chargement...' : 'Prêt'}
            </p>
          </div>
        </div>

        {/* Erreurs */}
        {(userError || swipesError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">Erreurs</h3>
            {userError && <p className="text-sm text-red-600">User: {userError}</p>}
            {swipesError && <p className="text-sm text-red-600">Swipes: {swipesError}</p>}
          </div>
        )}

        {/* Configuration de test */}
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-3">Configuration de Test</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email de test"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="px-3 py-2 border border-yellow-300 rounded-md"
            />
            <input
              type="password"
              placeholder="Mot de passe de test"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              className="px-3 py-2 border border-yellow-300 rounded-md"
            />
          </div>
        </div>

        {/* Boutons de test */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={runAllTests}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Lancer Tous les Tests
          </button>
          <button
            onClick={testAuthentication}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Test Auth
          </button>
          <button
            onClick={testSwipeFeatures}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Test Swipes
          </button>
          <button
            onClick={testMatchFeatures}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            Test Matches
          </button>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Déconnexion
          </button>
        </div>

        {/* Résultats des tests */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Résultats des Tests</h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {testResults.length === 0 ? (
              <p className="text-gray-500">Aucun test exécuté</p>
            ) : (
              testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-sm ${
                    result.success 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <span className="font-semibold">{result.test}:</span> {result.message}
                  <span className="text-xs opacity-75 ml-2">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseIntegrationTest;
