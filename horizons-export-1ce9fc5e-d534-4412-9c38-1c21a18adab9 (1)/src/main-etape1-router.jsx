import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Version ÉTAPE 1 - Ajout du Router seulement
console.log('🔧 ÉTAPE 1 - Test Router');

const TestRouter = () => {
  return (
    <div style={{
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#10b981', marginBottom: '20px' }}>
        🔧 Test Router - Étape 1
      </h1>
      
      <div style={{
        backgroundColor: '#333',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#60a5fa', marginBottom: '15px' }}>
          Navigation Test
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <button 
            onClick={() => window.location.hash = '#home'}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              margin: '5px',
              cursor: 'pointer'
            }}
          >
            Home
          </button>
          
          <button 
            onClick={() => window.location.hash = '#profile'}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              margin: '5px',
              cursor: 'pointer'
            }}
          >
            Profile
          </button>
        </div>
        
        <div style={{
          backgroundColor: '#1f2937',
          padding: '15px',
          borderRadius: '6px',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          URL actuelle: {window.location.href}<br/>
          Hash: {window.location.hash}<br/>
          Router: React Router installé ✅
        </div>
      </div>
      
      <button 
        onClick={() => window.location.href = '/main-etape2.html'}
        style={{
          backgroundColor: '#f59e0b',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        ➡️ Étape 2 : Ajouter CSS
      </button>
    </div>
  );
};

const HomePage = () => (
  <div style={{ padding: '20px', color: '#10b981' }}>
    <h2>🏠 Page Home</h2>
    <p>Router fonctionne ! Cette page est affichée via React Router.</p>
  </div>
);

const ProfilePage = () => (
  <div style={{ padding: '20px', color: '#3b82f6' }}>
    <h2>👤 Page Profile</h2>
    <p>Navigation réussie vers le profil !</p>
  </div>
);

const AppWithRouter = () => {
  return (
    <Router>
      <div style={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        minHeight: '100vh'
      }}>
        <TestRouter />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={
            <div style={{ padding: '20px', color: '#ef4444' }}>
              <h2>❌ Page non trouvée</h2>
              <p>Route: {window.location.pathname}</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

// Test de montage avec gestion d'erreur
try {
  console.log('🚀 Tentative de montage avec Router...');
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  root.render(
    <React.StrictMode>
      <AppWithRouter />
    </React.StrictMode>
  );
  
  console.log('✅ App avec Router montée avec succès');
  
} catch (error) {
  console.error('❌ Erreur montage Router:', error);
  
  // Fallback sans Router
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <TestRouter />
    </React.StrictMode>
  );
}
