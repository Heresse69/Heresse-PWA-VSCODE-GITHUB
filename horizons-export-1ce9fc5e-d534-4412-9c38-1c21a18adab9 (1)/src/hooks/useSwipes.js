/**
 * Hook personnalisé pour la gestion des swipes
 */
import { useState, useEffect, useCallback } from 'react';
import { swipesService } from '@/services/supabase/swipes.js';
import { matchesService } from '@/services/supabase/matches.js';

export const useSwipes = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    likesGiven: 0,
    dislikesGiven: 0,
    likesReceived: 0,
    matches: 0,
    totalSwipes: 0
  });

  // Charger les profils recommandés
  const loadProfiles = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const result = await swipesService.getSwipeRecommendations(limit);
      
      if (result.success) {
        setProfiles(result.profiles);
      } else {
        setError(result.error);
        setProfiles([]);
      }
    } catch (err) {
      setError(err.message);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les statistiques
  const loadStats = useCallback(async () => {
    try {
      const result = await swipesService.getSwipeStats();
      if (result.success) {
        setStats(result.stats);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des stats:', err);
    }
  }, []);

  // Effectuer un swipe
  const swipe = useCallback(async (targetUserId, isLike) => {
    try {
      const result = await swipesService.recordSwipe(targetUserId, isLike);
      
      if (result.success) {
        // Retirer le profil swipé de la liste
        setProfiles(prev => prev.filter(p => p.id !== targetUserId));
        
        // Mettre à jour les stats
        setStats(prev => ({
          ...prev,
          likesGiven: prev.likesGiven + (isLike ? 1 : 0),
          dislikesGiven: prev.dislikesGiven + (isLike ? 0 : 1),
          totalSwipes: prev.totalSwipes + 1,
          matches: prev.matches + (result.isMatch ? 1 : 0)
        }));

        return {
          success: true,
          isMatch: result.isMatch,
          match: result.match
        };
      } else {
        setError(result.error);
        return {
          success: false,
          error: result.error
        };
      }
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    }
  }, []);

  // Effectuer un like
  const like = useCallback((targetUserId) => {
    return swipe(targetUserId, true);
  }, [swipe]);

  // Effectuer un dislike
  const dislike = useCallback((targetUserId) => {
    return swipe(targetUserId, false);
  }, [swipe]);

  // Recharger plus de profils si la liste devient courte
  const refillProfiles = useCallback(async () => {
    if (profiles.length < 3 && !loading) {
      await loadProfiles(10);
    }
  }, [profiles.length, loading, loadProfiles]);

  // Charger les données initiales
  useEffect(() => {
    loadProfiles();
    loadStats();
  }, [loadProfiles, loadStats]);

  // Auto-refill quand on manque de profils
  useEffect(() => {
    refillProfiles();
  }, [refillProfiles]);

  return {
    profiles,
    loading,
    error,
    stats,
    actions: {
      like,
      dislike,
      swipe,
      loadProfiles,
      loadStats,
      refillProfiles
    }
  };
};

export default useSwipes;
