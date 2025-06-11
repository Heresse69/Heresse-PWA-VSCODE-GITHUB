/**
 * Script de nettoyage pour forcer la suppression du cache Service Worker
 * et permettre le rechargement complet de l'application
 */

console.log('🧹 Début du nettoyage du cache Service Worker...');

async function clearAllCaches() {
  try {
    // 1. Supprimer tous les caches
    const cacheNames = await caches.keys();
    console.log('📦 Caches trouvés:', cacheNames);
    
    for (const cacheName of cacheNames) {
      await caches.delete(cacheName);
      console.log('🗑️ Cache supprimé:', cacheName);
    }
    
    console.log('✅ Tous les caches supprimés');
  } catch (error) {
    console.error('❌ Erreur lors de la suppression des caches:', error);
  }
}

async function unregisterServiceWorkers() {
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log('🔧 Service Workers trouvés:', registrations.length);
      
      for (const registration of registrations) {
        await registration.unregister();
        console.log('🔓 Service Worker désenregistré:', registration.scope);
      }
      
      console.log('✅ Tous les Service Workers désenregistrés');
    }
  } catch (error) {
    console.error('❌ Erreur lors du désenregistrement:', error);
  }
}

async function forceReload() {
  try {
    console.log('🔄 Nettoyage terminé, rechargement forcé...');
    
    // Attendre un peu pour que les changements prennent effet
    setTimeout(() => {
      window.location.reload(true);
    }, 1000);
    
  } catch (error) {
    console.error('❌ Erreur lors du rechargement:', error);
  }
}

// Fonction principale de nettoyage
async function cleanupAndReload() {
  console.log('🚀 Lancement du processus de nettoyage complet...');
  
  await clearAllCaches();
  await unregisterServiceWorkers();
  await forceReload();
}

// Exporter pour utilisation
window.cleanupAndReload = cleanupAndReload;

// Auto-exécution si appelé directement
if (window.location.search.includes('cleanup=true')) {
  cleanupAndReload();
}

console.log('🛠️ Script de nettoyage prêt. Utilisez cleanupAndReload() ou ajoutez ?cleanup=true à l\'URL');
