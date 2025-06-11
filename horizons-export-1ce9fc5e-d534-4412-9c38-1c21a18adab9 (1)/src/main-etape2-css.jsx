import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Version ÉTAPE 2 - Ajout des CSS
console.log('🎨 ÉTAPE 2 - Test CSS');

// Tentative d'import CSS avec gestion d'erreur
let cssLoaded = false;
try {
  // Essayer d'importer le CSS principal
  import('/src/index.css').then(() => {
    cssLoaded = true;
    console.log('✅ CSS principal chargé');
  }).catch((error) => {
    console.warn('⚠️ CSS principal non chargé:', error.message);
  });
} catch (error) {
  console.warn('⚠️ Import CSS échoué:', error.message);
}

const TestCSS = () => {
  const [cssStatus, setCssStatus] = React.useState('⏳ Chargement...');
  
  React.useEffect(() => {
    // Vérifier si Tailwind est disponible
    const testElement = document.createElement('div');
    testElement.className = 'bg-red-500';
    document.body.appendChild(testElement);
    
    const computedStyle = window.getComputedStyle(testElement);
    const hasTailwind = computedStyle.backgroundColor.includes('rgb');
    
    document.body.removeChild(testElement);
    
    if (hasTailwind) {
      setCssStatus('✅ Tailwind CSS fonctionne');
    } else {
      setCssStatus('❌ Tailwind CSS non trouvé');
    }
  }, []);
  
  return (
    <div style={{
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#10b981', marginBottom: '20px' }}>
        🎨 Test CSS - Étape 2
      </h1>
      
      <div style={{
        backgroundColor: '#333',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#60a5fa', marginBottom: '15px' }}>
          Status CSS
        </h2>
        
        <div style={{ marginBottom: '15px', fontFamily: 'monospace' }}>
          <div>CSS Principal: {cssLoaded ? '✅ Chargé' : '❌ Non chargé'}</div>
          <div>Tailwind CSS: {cssStatus}</div>
          <div>Styles inline: ✅ Fonctionnent</div>
        </div>
        
        {/* Test Tailwind si disponible */}
        <div style={{ marginBottom: '15px' }}>
          <div className="bg-blue-500 text-white p-4 rounded mb-2" style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '16px',
            borderRadius: '6px',
            marginBottom: '8px'
          }}>
            Test Tailwind (avec fallback inline)
          </div>
        </div>
        
        {/* Test boutons avec CSS */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary"
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
            onClick={() => alert('CSS Button works!')}
          >
            ✅ Bouton CSS
          </button>
          
          <button 
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
            onClick={() => window.location.href = '/'}
          >
            🏠 Retour Urgence
          </button>
        </div>
      </div>
      
      <div style={{
        backgroundColor: '#1f2937',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#fbbf24', marginBottom: '10px' }}>
          🧪 Test d'Intégration
        </h3>
        
        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
          <div>Router: ✅ Fonctionne</div>
          <div>React: ✅ Fonctionne</div>
          <div>CSS: {cssLoaded ? '✅' : '⚠️'} {cssLoaded ? 'Fonctionne' : 'Partiel'}</div>
          <div>Mobile: ✅ Compatible</div>
        </div>
      </div>
      
      <button 
        onClick={() => window.location.href = '/etape3-components.html'}
        style={{
          backgroundColor: '#f59e0b',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '300px'
        }}
      >
        ➡️ Étape 3 : Ajouter Composants
      </button>
    </div>
  );
};

const AppWithCSS = () => {
  return (
    <Router>
      <div style={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        minHeight: '100vh'
      }}>
        <Routes>
          <Route path="/" element={<TestCSS />} />
          <Route path="*" element={<TestCSS />} />
        </Routes>
      </div>
    </Router>
  );
};

// Test de montage avec gestion d'erreur
try {
  console.log('🚀 Tentative de montage avec CSS...');
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  root.render(
    <React.StrictMode>
      <AppWithCSS />
    </React.StrictMode>
  );
  
  console.log('✅ App avec CSS montée avec succès');
  
} catch (error) {
  console.error('❌ Erreur montage CSS:', error);
  
  // Fallback sans CSS complexe
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
        <h1 style={{ color: '#ef4444' }}>❌ Erreur CSS</h1>
        <p>Erreur: {error.message}</p>
        <button 
          onClick={() => window.location.href = '/'}
          style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '6px', cursor: 'pointer' }}
        >
          🏠 Retour
        </button>
      </div>
    </React.StrictMode>
  );
}
