import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Version mobile-friendly simplifiée pour diagnostic
const MobileTestApp = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Test de chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Capture des erreurs
    const handleError = (event) => {
      setError(`Erreur: ${event.error?.message || 'Erreur inconnue'}`);
    };

    window.addEventListener('error', handleError);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (error) {
    return (
      <div style={{
        background: '#ef4444',
        color: 'white',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2>❌ Erreur Détectée</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          🔄 Recharger
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{
        background: '#0f172a',
        color: 'white',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2>🔄 Test Mobile en cours...</h2>
        <p>Vérification de la compatibilité...</p>
      </div>
    );
  }

  return (
    <Router>
      <div style={{
        background: '#0f172a',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

const HomePage = () => {
  const [deviceInfo, setDeviceInfo] = React.useState({});

  React.useEffect(() => {
    setDeviceInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      online: navigator.onLine,
      screenSize: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      isPWA: window.navigator.standalone === true || 
             window.matchMedia('(display-mode: standalone)').matches
    });
  }, []);

  return (
    <div>
      <h1 style={{ color: '#ec4899' }}>✅ Heresse Mobile Test</h1>
      
      <div style={{
        background: '#1e293b',
        padding: '15px',
        borderRadius: '8px',
        margin: '10px 0'
      }}>
        <h3>📱 Informations Appareil</h3>
        {Object.entries(deviceInfo).map(([key, value]) => (
          <p key={key}>
            <strong>{key}:</strong> {String(value)}
          </p>
        ))}
      </div>

      <div style={{
        background: '#1e293b',
        padding: '15px',
        borderRadius: '8px',
        margin: '10px 0'
      }}>
        <h3>🧪 Tests de Fonctionnalité</h3>
        <TestButton label="Test React State" action={() => alert('React fonctionne!')} />
        <TestButton label="Test Navigation" action={() => window.location.hash = '#test'} />
        <TestButton label="Test Fetch API" action={testFetch} />
        <TestButton label="Ouvrir App Complète" action={() => window.location.href = '/'} />
      </div>

      <div style={{
        background: '#1e293b',
        padding: '15px',
        borderRadius: '8px',
        margin: '10px 0'
      }}>
        <h3>🎯 Status</h3>
        <p style={{ color: '#10b981' }}>
          ✅ Application de test chargée avec succès sur mobile !
        </p>
        <p style={{ fontSize: '14px', color: '#94a3b8' }}>
          Si vous voyez ceci, la base React fonctionne. 
          Le problème vient probablement d'un composant spécifique.
        </p>
      </div>
    </div>
  );
};

const TestPage = () => (
  <div>
    <h2>🧪 Page de Test</h2>
    <p>Navigation React Router fonctionne !</p>
    <button onClick={() => window.history.back()}>← Retour</button>
  </div>
);

const TestButton = ({ label, action }) => (
  <button
    onClick={action}
    style={{
      background: '#ec4899',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      margin: '5px',
      borderRadius: '6px',
      cursor: 'pointer'
    }}
  >
    {label}
  </button>
);

const testFetch = async () => {
  try {
    const response = await fetch('/manifest.json');
    const data = await response.json();
    alert(`Fetch OK: ${data.name}`);
  } catch (error) {
    alert(`Fetch Error: ${error.message}`);
  }
};

export default MobileTestApp;
