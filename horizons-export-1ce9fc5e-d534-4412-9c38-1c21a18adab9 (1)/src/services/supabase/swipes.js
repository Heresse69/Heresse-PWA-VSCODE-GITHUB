/**
 * Service de gestion des swipes (likes/dislikes) avec Supabase
 */
import { supabase } from './client.js';

export const swipesService = {
  /**
   * Enregistrer un swipe (like ou dislike)
   * @param {string} targetUserId - ID de l'utilisateur cible
   * @param {boolean} isLike - true pour like, false pour dislike
   * @returns {Object} Résultat du swipe avec informations de match éventuel
   */
  async recordSwipe(targetUserId, isLike) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      // Éviter les auto-swipes
      if (user.id === targetUserId) {
        throw new Error('Impossible de swiper sur son propre profil');
      }

      // Vérifier si un swipe existe déjà
      const { data: existingSwipe } = await supabase
        .from('swipes')
        .select('id')
        .eq('swiper_id', user.id)
        .eq('swiped_id', targetUserId)
        .single();

      if (existingSwipe) {
        throw new Error('Vous avez déjà swipé sur ce profil');
      }

      // Enregistrer le swipe
      const { data: swipeData, error: swipeError } = await supabase
        .from('swipes')
        .insert({
          swiper_id: user.id,
          swiped_id: targetUserId,
          is_like: isLike,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (swipeError) throw swipeError;

      // Si c'est un like, vérifier s'il y a match
      let matchData = null;
      if (isLike) {
        const { data: reciprocalSwipe } = await supabase
          .from('swipes')
          .select('id')
          .eq('swiper_id', targetUserId)
          .eq('swiped_id', user.id)
          .eq('is_like', true)
          .single();

        if (reciprocalSwipe) {
          // Créer le match
          const { data: match, error: matchError } = await supabase
            .from('matches')
            .insert({
              user1_id: user.id,
              user2_id: targetUserId,
              created_at: new Date().toISOString(),
              is_active: true
            })
            .select()
            .single();

          if (matchError) {
            console.error('Erreur lors de la création du match:', matchError);
          } else {
            matchData = match;
          }
        }
      }

      return {
        success: true,
        swipe: swipeData,
        match: matchData,
        isMatch: !!matchData
      };

    } catch (error) {
      console.error('Erreur lors du swipe:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Obtenir les profils recommandés pour le swipe
   * @param {number} limit - Nombre de profils à récupérer
   * @returns {Array} Liste des profils recommandés
   */
  async getSwipeRecommendations(limit = 10) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      // Récupérer les IDs des utilisateurs déjà swipés
      const { data: swipedUsers } = await supabase
        .from('swipes')
        .select('swiped_id')
        .eq('swiper_id', user.id);

      const swipedIds = swipedUsers?.map(s => s.swiped_id) || [];
      swipedIds.push(user.id); // Exclure son propre profil

      // Récupérer les profils recommandés
      let query = supabase
        .from('user_profiles')
        .select(`
          id,
          full_name,
          bio,
          age,
          city,
          profile_picture_url,
          public_photos:public_photos(
            id,
            url,
            is_main,
            created_at
          )
        `)
        .not('id', 'in', `(${swipedIds.join(',')})`)
        .eq('is_active', true)
        .limit(limit);

      const { data: profiles, error } = await query;
      if (error) throw error;

      // Trier les photos pour avoir la photo principale en premier
      const formattedProfiles = profiles.map(profile => ({
        ...profile,
        photos: profile.public_photos
          ?.sort((a, b) => {
            if (a.is_main && !b.is_main) return -1;
            if (!a.is_main && b.is_main) return 1;
            return new Date(b.created_at) - new Date(a.created_at);
          })
          ?.map(photo => ({
            id: photo.id,
            url: photo.url,
            isMain: photo.is_main
          })) || []
      }));

      return {
        success: true,
        profiles: formattedProfiles
      };

    } catch (error) {
      console.error('Erreur lors du fetch des recommandations:', error);
      return {
        success: false,
        error: error.message,
        profiles: []
      };
    }
  },

  /**
   * Obtenir l'historique des swipes de l'utilisateur
   * @param {number} limit - Nombre de swipes à récupérer
   * @returns {Array} Historique des swipes
   */
  async getSwipeHistory(limit = 50) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      const { data: swipes, error } = await supabase
        .from('swipes')
        .select(`
          id,
          is_like,
          created_at,
          target_profile:user_profiles!swipes_swiped_id_fkey(
            id,
            full_name,
            profile_picture_url
          )
        `)
        .eq('swiper_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        swipes: swipes || []
      };

    } catch (error) {
      console.error('Erreur lors du fetch de l\'historique:', error);
      return {
        success: false,
        error: error.message,
        swipes: []
      };
    }
  },

  /**
   * Obtenir les statistiques de swipe de l'utilisateur
   * @returns {Object} Statistiques des swipes
   */
  async getSwipeStats() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      // Compter les likes donnés
      const { count: likesGiven, error: likesError } = await supabase
        .from('swipes')
        .select('id', { count: 'exact' })
        .eq('swiper_id', user.id)
        .eq('is_like', true);

      // Compter les dislikes donnés
      const { count: dislikesGiven, error: dislikesError } = await supabase
        .from('swipes')
        .select('id', { count: 'exact' })
        .eq('swiper_id', user.id)
        .eq('is_like', false);

      // Compter les likes reçus
      const { count: likesReceived, error: receivedError } = await supabase
        .from('swipes')
        .select('id', { count: 'exact' })
        .eq('swiped_id', user.id)
        .eq('is_like', true);

      // Compter les matches
      const { count: matchesCount, error: matchesError } = await supabase
        .from('matches')
        .select('id', { count: 'exact' })
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('is_active', true);

      if (likesError || dislikesError || receivedError || matchesError) {
        throw new Error('Erreur lors du calcul des statistiques');
      }

      return {
        success: true,
        stats: {
          likesGiven: likesGiven || 0,
          dislikesGiven: dislikesGiven || 0,
          likesReceived: likesReceived || 0,
          matches: matchesCount || 0,
          totalSwipes: (likesGiven || 0) + (dislikesGiven || 0)
        }
      };

    } catch (error) {
      console.error('Erreur lors du fetch des stats:', error);
      return {
        success: false,
        error: error.message,
        stats: {
          likesGiven: 0,
          dislikesGiven: 0,
          likesReceived: 0,
          matches: 0,
          totalSwipes: 0
        }
      };
    }
  }
};
