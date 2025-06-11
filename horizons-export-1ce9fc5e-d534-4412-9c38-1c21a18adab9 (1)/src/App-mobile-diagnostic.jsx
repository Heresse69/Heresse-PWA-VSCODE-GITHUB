import React, { useState, useEffect } from 'react';

/**
 * Version ultra-simplifiée de l'App pour diagnostic mobile
 * Cette version va nous aider à identifier où exactement ça bloque sur mobile
 */
const AppMobileDiagnostic = () => {
  const [diagnostics, setDiagnostics] = useState({
    react: false,
    dom: false,
    hooks: false,
    rendering: false
  });
  
  const [logs, setLogs] = useState([]);
  
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
    console.log(`[Mobile Diagnostic] ${message}`);
  };
  
  // Test des hooks React
  useEffect(() => {
    addLog('✅ React component mounted', 'success');
    setDiagnostics(prev => ({ ...prev, react: true }));
    
    // Test du DOM
    if (document.getElementById('root')) {
      addLog('✅ DOM root found', 'success');
      setDiagnostics(prev => ({ ...prev, dom: true }));
    }
    
    // Test des hooks
    try {
      const [testState] = useState('test');
      addLog('✅ React hooks working', 'success');
      setDiagnostics(prev => ({ ...prev, hooks: true }));
    } catch (error) {
      addLog(`❌ Hooks error: ${error.message}`, 'error');
    }
    
    // Test du rendering
    setTimeout(() => {
      addLog('✅ Component rendering complete', 'success');
      setDiagnostics(prev => ({ ...prev, rendering: true }));
    }, 100);
    
    // Test des erreurs
    window.addEventListener('error', (e) => {
      addLog(`❌ Window error: ${e.message}`, 'error');
    });
    
    window.addEventListener('unhandledrejection', (e) => {
      addLog(`❌ Promise rejection: ${e.reason}`, 'error');
    });
    
  }, []);
  
  const getDiagnosticIcon = (status) => status ? '✅' : '❌';
  const getDiagnosticColor = (status) => status ? '#10b981' : '#ef4444';
  
  const goToMainApp = () => {
    addLog('🔄 Redirecting to main app...');
    setTimeout(() => window.location.href = '/', 1000);
  };
  
  const reloadPage = () => {
    addLog('🔄 Reloading page...');
    setTimeout(() => window.location.reload(), 1000);
  };
  
  return (
    <div style={{
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        color: '#10b981', 
        marginBottom: '20px',
        fontSize: '1.5rem',
        textAlign: 'center'
      }}>
        📱 App Mobile Diagnostic
      </h1>
      
      <div style={{
        backgroundColor: '#333',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#60a5fa', fontSize: '1.2rem', marginBottom: '15px' }}>
          🔧 React Status
        </h2>
        
        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
          <div style={{ margin: '8px 0' }}>
            <span style={{ color: getDiagnosticColor(diagnostics.react) }}>
              {getDiagnosticIcon(diagnostics.react)} React Component: {diagnostics.react ? 'OK' : 'FAILED'}
            </span>
          </div>
          <div style={{ margin: '8px 0' }}>
            <span style={{ color: getDiagnosticColor(diagnostics.dom) }}>
              {getDiagnosticIcon(diagnostics.dom)} DOM Access: {diagnostics.dom ? 'OK' : 'FAILED'}
            </span>
          </div>
          <div style={{ margin: '8px 0' }}>
            <span style={{ color: getDiagnosticColor(diagnostics.hooks) }}>
              {getDiagnosticIcon(diagnostics.hooks)} React Hooks: {diagnostics.hooks ? 'OK' : 'FAILED'}
            </span>
          </div>
          <div style={{ margin: '8px 0' }}>
            <span style={{ color: getDiagnosticColor(diagnostics.rendering) }}>
              {getDiagnosticIcon(diagnostics.rendering)} Rendering: {diagnostics.rendering ? 'OK' : 'FAILED'}
            </span>
          </div>
        </div>
      </div>
      
      <div style={{
        backgroundColor: '#333',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#60a5fa', fontSize: '1.2rem', marginBottom: '15px' }}>
          📱 Device Info
        </h2>
        
        <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          <div>User Agent: {navigator.userAgent.substring(0, 60)}...</div>
          <div>Screen: {screen.width}x{screen.height}</div>
          <div>Viewport: {window.innerWidth}x{window.innerHeight}</div>
          <div>Pixel Ratio: {window.devicePixelRatio}</div>
          <div>Touch: {('ontouchstart' in window) ? 'Supported' : 'Not supported'}</div>
          <div>Standalone: {window.matchMedia('(display-mode: standalone)').matches ? 'Yes' : 'No'}</div>
        </div>
      </div>
      
      <div style={{
        backgroundColor: '#333',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#60a5fa', fontSize: '1.2rem', marginBottom: '15px' }}>
          📋 Real-time Logs
        </h2>
        
        <div style={{
          backgroundColor: '#000',
          borderRadius: '4px',
          padding: '10px',
          maxHeight: '200px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          {logs.map((log, index) => (
            <div key={index} style={{
              color: log.type === 'error' ? '#ef4444' : log.type === 'success' ? '#10b981' : '#ffffff',
              marginBottom: '4px'
            }}>
              [{log.timestamp}] {log.message}
            </div>
          ))}
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginTop: '20px'
      }}>
        <button
          onClick={goToMainApp}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          📱 Main App
        </button>
        
        <button
          onClick={reloadPage}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🔄 Reload
        </button>
      </div>
      
      {/* Test de rendu dynamique */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '8px',
        padding: '15px',
        marginTop: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#fbbf24', marginBottom: '10px' }}>
          🧪 Dynamic Render Test
        </h3>
        <div style={{ 
          width: '100%', 
          height: '20px', 
          backgroundColor: '#374151', 
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${Object.values(diagnostics).filter(Boolean).length * 25}%`,
            height: '100%',
            backgroundColor: '#10b981',
            transition: 'width 0.5s ease',
            borderRadius: '10px'
          }} />
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px' }}>
          Progress: {Object.values(diagnostics).filter(Boolean).length}/4 tests passed
        </div>
      </div>
    </div>
  );
};

export default AppMobileDiagnostic;
