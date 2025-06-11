import React from 'react';
import ReactDOM from 'react-dom/client';

// Version d'URGENCE ultra-simple - PAS DE SUPABASE, PAS DE ROUTER
console.log('🚨 URGENCE - Démarrage app ultra-simple');

const UrgenceApp = () => {
  return (
    <div style={{
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#10b981', marginBottom: '20px' }}>
        🚨 APP D'URGENCE FONCTIONNE !
      </h1>
      
      <div style={{
        backgroundColor: '#333',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#60a5fa', marginBottom: '15px' }}>✅ Tests Réussis</h2>
        <div style={{ textAlign: 'left', fontFamily: 'monospace', fontSize: '14px' }}>
          <div>✅ React: Fonctionnel</div>
          <div>✅ JSX: Fonctionnel</div>
          <div>✅ Styles: Fonctionnels</div>
          <div>✅ Serveur: Fonctionnel</div>
          <div>✅ Rendu: Fonctionnel</div>
        </div>
      </div>
      
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#fbbf24', marginBottom: '10px' }}>📱 Infos Device</h3>
        <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
          <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
          <div>Écran: {screen.width}x{screen.height}</div>
          <div>Viewport: {window.innerWidth}x{window.innerHeight}</div>
          <div>Touch: {('ontouchstart' in window) ? 'Supporté' : 'Non supporté'}</div>
          <div>Timestamp: {new Date().toLocaleString()}</div>
        </div>
      </div>
      
      <button
        onClick={() => {
          alert('React Event Handler fonctionne !');
          console.log('Click test réussi');
        }}
        style={{
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          margin: '10px'
        }}
      >
        🧪 Test Click
      </button>
      
      <button
        onClick={() => {
          window.location.reload();
        }}
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          margin: '10px'
        }}
      >
        🔄 Reload
      </button>
    </div>
  );
};

// Montage ultra-simple
try {
  console.log('🔧 Création du root React...');
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  console.log('🎯 Rendu de l\'app d\'urgence...');
  root.render(<UrgenceApp />);
  
  console.log('✅ App d\'urgence rendue avec succès !');
  
} catch (error) {
  console.error('❌ Erreur app d\'urgence:', error);
  
  // Fallback HTML en cas d'échec React
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; background: #1a1a1a; color: white; font-family: monospace; min-height: 100vh;">
      <h1 style="color: #ef4444;">❌ ERREUR REACT</h1>
      <div style="background: #333; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <strong>Erreur:</strong> ${error.message}<br>
        <strong>Stack:</strong> <pre style="margin-top: 10px; font-size: 12px; white-space: pre-wrap;">${error.stack}</pre>
      </div>
      <button onclick="window.location.reload()" style="background: #10b981; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer;">
        🔄 Recharger
      </button>
    </div>
  `;
}
