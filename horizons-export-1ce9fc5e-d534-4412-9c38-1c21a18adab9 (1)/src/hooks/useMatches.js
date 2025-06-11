/**
 * Hook personnalisé pour la gestion des matches
 */
import { useState, useEffect, useCallback } from 'react';
import { matchesService } from '@/services/supabase/matches.js';
import { messagesService } from '@/services/supabase/messages.js';

export const useMatches = () => {
  const [matches, setMatches] = useState([]);
  const [newMatches, setNewMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [totalUnread, setTotalUnread] = useState(0);

  // Charger tous les matches
  const loadMatches = useCallback(async (activeOnly = true) => {
    setLoading(true);
    setError(null);

    try {
      const result = await matchesService.getUserMatches(activeOnly);
      
      if (result.success) {
        setMatches(result.matches);
      } else {
        setError(result.error);
        setMatches([]);
      }
    } catch (err) {
      setError(err.message);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les nouveaux matches
  const loadNewMatches = useCallback(async () => {
    try {
      const result = await matchesService.getNewMatches();
      
      if (result.success) {
        setNewMatches(result.matches);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des nouveaux matches:', err);
    }
  }, []);

  // Charger les compteurs de messages non lus
  const loadUnreadCounts = useCallback(async () => {
    try {
      const result = await messagesService.getUnreadMessagesCounts();
      
      if (result.success) {
        setUnreadCounts(result.counts);
        setTotalUnread(result.total);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des messages non lus:', err);
    }
  }, []);

  // Supprimer un match (unmatch)
  const unmatch = useCallback(async (matchId) => {
    try {
      const result = await matchesService.unmatch(matchId);
      
      if (result.success) {
        // Retirer le match de la liste
        setMatches(prev => prev.filter(m => m.id !== matchId));
        setNewMatches(prev => prev.filter(m => m.id !== matchId));
        
        // Mettre à jour les compteurs de messages non lus
        setUnreadCounts(prev => {
          const newCounts = { ...prev };
          delete newCounts[matchId];
          return newCounts;
        });
        
        setTotalUnread(prev => prev - (unreadCounts[matchId] || 0));
        
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [unreadCounts]);

  // Réactiver un match
  const rematch = useCallback(async (matchId) => {
    try {
      const result = await matchesService.rematch(matchId);
      
      if (result.success) {
        // Recharger les matches pour inclure le match réactivé
        await loadMatches();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [loadMatches]);

  // Obtenir un match spécifique
  const getMatch = useCallback(async (matchId) => {
    try {
      const result = await matchesService.getMatch(matchId);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Marquer les matches comme vus
  const markMatchesAsSeen = useCallback(async (matchIds) => {
    try {
      const result = await matchesService.markMatchesAsSeen(matchIds);
      
      if (result.success) {
        // Retirer ces matches de la liste des nouveaux
        setNewMatches(prev => 
          prev.filter(m => !matchIds.includes(m.id))
        );
      }
      
      return result;
    } catch (err) {
      console.error('Erreur lors du marquage des matches:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Mettre à jour le compteur de messages non lus pour un match
  const updateUnreadCount = useCallback((matchId, count) => {
    setUnreadCounts(prev => ({
      ...prev,
      [matchId]: count
    }));
    
    // Recalculer le total
    setTotalUnread(Object.values({
      ...unreadCounts,
      [matchId]: count
    }).reduce((sum, count) => sum + count, 0));
  }, [unreadCounts]);

  // Ajouter un nouveau match (appelé quand un match est créé)
  const addNewMatch = useCallback((match) => {
    setMatches(prev => [match, ...prev]);
    setNewMatches(prev => [match, ...prev]);
  }, []);

  // Charger les données initiales
  useEffect(() => {
    loadMatches();
    loadNewMatches();
    loadUnreadCounts();
  }, [loadMatches, loadNewMatches, loadUnreadCounts]);

  return {
    matches,
    newMatches,
    loading,
    error,
    unreadCounts,
    totalUnread,
    actions: {
      loadMatches,
      loadNewMatches,
      loadUnreadCounts,
      unmatch,
      rematch,
      getMatch,
      markMatchesAsSeen,
      updateUnreadCount,
      addNewMatch
    }
  };
};

export default useMatches;
