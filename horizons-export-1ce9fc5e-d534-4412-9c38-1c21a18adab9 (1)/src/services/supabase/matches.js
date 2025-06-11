/**
 * Service de gestion des matches avec Supabase
 */
import { supabase } from './client.js';

export const matchesService = {
  /**
   * Obtenir tous les matches de l'utilisateur
   * @param {boolean} activeOnly - Ne récupérer que les matches actifs
   * @returns {Array} Liste des matches
   */
  async getUserMatches(activeOnly = true) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      let query = supabase
        .from('matches')
        .select(`
          id,
          created_at,
          is_active,
          last_message_at,
          user1:user_profiles!matches_user1_id_fkey(
            id,
            full_name,
            profile_picture_url,
            bio,
            age,
            city
          ),
          user2:user_profiles!matches_user2_id_fkey(
            id,
            full_name,
            profile_picture_url,
            bio,
            age,
            city
          ),
          last_message:messages(
            id,
            content,
            created_at,
            sender_id
          )
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data: matches, error } = await query;
      if (error) throw error;

      // Formater les matches pour identifier le partenaire
      const formattedMatches = matches?.map(match => {
        const isUser1 = match.user1.id === user.id;
        const partner = isUser1 ? match.user2 : match.user1;
        
        return {
          id: match.id,
          partnerId: partner.id,
          partnerName: partner.full_name,
          partnerPhoto: partner.profile_picture_url,
          partnerBio: partner.bio,
          partnerAge: partner.age,
          partnerCity: partner.city,
          createdAt: match.created_at,
          isActive: match.is_active,
          lastMessageAt: match.last_message_at,
          lastMessage: match.last_message?.[0] || null,
          hasUnreadMessages: false // À calculer séparément si nécessaire
        };
      }) || [];

      return {
        success: true,
        matches: formattedMatches
      };

    } catch (error) {
      console.error('Erreur lors du fetch des matches:', error);
      return {
        success: false,
        error: error.message,
        matches: []
      };
    }
  },

  /**
   * Obtenir un match spécifique
   * @param {string} matchId - ID du match
   * @returns {Object} Détails du match
   */
  async getMatch(matchId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      const { data: match, error } = await supabase
        .from('matches')
        .select(`
          id,
          user1_id,
          user2_id,
          created_at,
          is_active,
          last_message_at,
          user1:user_profiles!matches_user1_id_fkey(
            id,
            full_name,
            profile_picture_url,
            bio,
            age,
            city
          ),
          user2:user_profiles!matches_user2_id_fkey(
            id,
            full_name,
            profile_picture_url,
            bio,
            age,
            city
          )
        `)
        .eq('id', matchId)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .single();

      if (error) throw error;

      // Vérifier que l'utilisateur fait partie du match
      if (match.user1_id !== user.id && match.user2_id !== user.id) {
        throw new Error('Accès non autorisé à ce match');
      }

      const isUser1 = match.user1_id === user.id;
      const partner = isUser1 ? match.user2 : match.user1;

      return {
        success: true,
        match: {
          id: match.id,
          partnerId: partner.id,
          partnerName: partner.full_name,
          partnerPhoto: partner.profile_picture_url,
          partnerBio: partner.bio,
          partnerAge: partner.age,
          partnerCity: partner.city,
          createdAt: match.created_at,
          isActive: match.is_active,
          lastMessageAt: match.last_message_at
        }
      };

    } catch (error) {
      console.error('Erreur lors du fetch du match:', error);
      return {
        success: false,
        error: error.message,
        match: null
      };
    }
  },

  /**
   * Désactiver un match (unmatch)
   * @param {string} matchId - ID du match à désactiver
   * @returns {Object} Résultat de l'opération
   */
  async unmatch(matchId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      // Vérifier que l'utilisateur fait partie du match
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .select('id, user1_id, user2_id')
        .eq('id', matchId)
        .single();

      if (matchError) throw matchError;

      if (match.user1_id !== user.id && match.user2_id !== user.id) {
        throw new Error('Accès non autorisé à ce match');
      }

      // Désactiver le match
      const { error: updateError } = await supabase
        .from('matches')
        .update({ 
          is_active: false,
          unmatched_at: new Date().toISOString(),
          unmatched_by: user.id
        })
        .eq('id', matchId);

      if (updateError) throw updateError;

      return {
        success: true,
        message: 'Match supprimé avec succès'
      };

    } catch (error) {
      console.error('Erreur lors du unmatch:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Réactiver un match
   * @param {string} matchId - ID du match à réactiver
   * @returns {Object} Résultat de l'opération
   */
  async rematch(matchId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      // Vérifier que l'utilisateur fait partie du match
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .select('id, user1_id, user2_id')
        .eq('id', matchId)
        .single();

      if (matchError) throw matchError;

      if (match.user1_id !== user.id && match.user2_id !== user.id) {
        throw new Error('Accès non autorisé à ce match');
      }

      // Réactiver le match
      const { error: updateError } = await supabase
        .from('matches')
        .update({ 
          is_active: true,
          unmatched_at: null,
          unmatched_by: null
        })
        .eq('id', matchId);

      if (updateError) throw updateError;

      return {
        success: true,
        message: 'Match réactivé avec succès'
      };

    } catch (error) {
      console.error('Erreur lors du rematch:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Obtenir les nouveaux matches (non vus)
   * @returns {Array} Liste des nouveaux matches
   */
  async getNewMatches() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      // Pour simplifier, on considère les matches des dernières 24h comme "nouveaux"
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data: matches, error } = await supabase
        .from('matches')
        .select(`
          id,
          created_at,
          user1:user_profiles!matches_user1_id_fkey(
            id,
            full_name,
            profile_picture_url
          ),
          user2:user_profiles!matches_user2_id_fkey(
            id,
            full_name,
            profile_picture_url
          )
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('is_active', true)
        .gte('created_at', yesterday.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedMatches = matches?.map(match => {
        const isUser1 = match.user1.id === user.id;
        const partner = isUser1 ? match.user2 : match.user1;
        
        return {
          id: match.id,
          partnerId: partner.id,
          partnerName: partner.full_name,
          partnerPhoto: partner.profile_picture_url,
          createdAt: match.created_at
        };
      }) || [];

      return {
        success: true,
        matches: formattedMatches,
        count: formattedMatches.length
      };

    } catch (error) {
      console.error('Erreur lors du fetch des nouveaux matches:', error);
      return {
        success: false,
        error: error.message,
        matches: [],
        count: 0
      };
    }
  },

  /**
   * Marquer les matches comme vus
   * @param {Array} matchIds - IDs des matches à marquer comme vus
   * @returns {Object} Résultat de l'opération
   */
  async markMatchesAsSeen(matchIds) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      // Pour l'instant, on pourrait juste logger cette action
      // Dans une vraie app, on pourrait avoir une table séparée pour tracking des vues
      console.log('Matches marqués comme vus:', matchIds);

      return {
        success: true,
        message: 'Matches marqués comme vus'
      };

    } catch (error) {
      console.error('Erreur lors du marquage des matches:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};
