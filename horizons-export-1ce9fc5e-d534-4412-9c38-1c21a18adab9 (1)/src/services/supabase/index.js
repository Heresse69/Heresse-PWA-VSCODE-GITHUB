/**
 * Index des services Supabase
 * Point d'entrée centralisé pour tous les services
 */

// Client Supabase
export { supabase } from './client.js';

// Services principaux
export { authService } from './auth.js';
export { profilesService } from './profiles.js';
export { photosService } from './photos.js';
export { swipesService } from './swipes.js';
export { matchesService } from './matches.js';
export { messagesService } from './messages.js';

// Types TypeScript (si utilisés) - commentés car fichier .js
// export type * from './client.js';

// Helpers pour l'intégration
export const supabaseServices = {
  auth: authService,
  profiles: profilesService,
  photos: photosService,
  swipes: swipesService,
  matches: matchesService,
  messages: messagesService
};

export default supabaseServices;
