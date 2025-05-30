import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const HOST = '0.0.0.0';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './mobile-test.html';
  }
  
  // Sécurité basique
  if (filePath.includes('..')) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Test Mobile - 404</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial; background: #0f172a; color: white; padding: 20px;">
            <h1>🔍 Test Mobile Server</h1>
            <p><strong>404 - Fichier non trouvé:</strong> ${req.url}</p>
            <h3>📁 Fichiers disponibles:</h3>
            <ul>
              <li><a href="/mobile-test.html" style="color: #ec4899;">mobile-test.html</a> - Diagnostic HTML pur</li>
              <li><a href="/mobile-test-app.html" style="color: #ec4899;">mobile-test-app.html</a> - Test React</li>
              <li><a href="/manifest.json" style="color: #ec4899;">manifest.json</a> - Manifest PWA</li>
            </ul>
            <p><em>Serveur de test mobile sur port ${PORT}</em></p>
          </body>
          </html>
        `);
      } else {
        res.writeHead(500);
        res.end('Erreur serveur: ' + err.code);
      }
      return;
    }
    
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 Serveur de test mobile démarré`);
  console.log(`📱 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://${HOST}:${PORT}`);
  console.log(`📋 Diagnostic: http://${HOST}:${PORT}/mobile-test.html`);
});

server.on('error', (err) => {
  console.error('❌ Erreur serveur:', err);
});
