/**
 * Index des hooks personnalisés pour Supabase
 */

// Hooks existants
export { default as useProfiles } from './useProfiles.js';

// Nouveaux hooks pour l'intégration complète
export { default as useSwipes } from './useSwipes.js';
export { default as useMatches } from './useMatches.js';
export { default as useMessages } from './useMessages.js';

// Hook combiné pour l'app dating
export { useSwipes, useMatches, useMessages };

// Réexport avec noms explicites
export { 
  useSwipes as useSwipesHook,
  useMatches as useMatchesHook, 
  useMessages as useMessagesHook,
  useProfiles as useProfilesHook
};

export default {
  useProfiles,
  useSwipes,
  useMatches,
  useMessages
};
