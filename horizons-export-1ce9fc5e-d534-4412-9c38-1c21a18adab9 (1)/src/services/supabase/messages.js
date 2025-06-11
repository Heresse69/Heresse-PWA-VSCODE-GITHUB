/**
 * Service de gestion des messages avec Supabase
 */
import { supabase } from './client.js';

export const messagesService = {
  /**
   * Envoyer un message dans un match
   * @param {string} matchId - ID du match
   * @param {string} content - Contenu du message
   * @param {string} type - Type de message ('text', 'image', 'media')
   * @returns {Object} Message créé
   */
  async sendMessage(matchId, content, type = 'text') {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      // Vérifier que le match existe et que l'utilisateur en fait partie
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .select('id, user1_id, user2_id, is_active')
        .eq('id', matchId)
        .single();

      if (matchError) throw matchError;

      if (!match.is_active) {
        throw new Error('Ce match n\'est plus actif');
      }

      if (match.user1_id !== user.id && match.user2_id !== user.id) {
        throw new Error('Accès non autorisé à ce match');
      }

      // Créer le message
      const messageData = {
        match_id: matchId,
        sender_id: user.id,
        content: content,
        message_type: type,
        created_at: new Date().toISOString(),
        is_read: false
      };

      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert(messageData)
        .select(`
          id,
          content,
          message_type,
          created_at,
          is_read,
          sender:user_profiles!messages_sender_id_fkey(
            id,
            full_name,
            profile_picture_url
          )
        `)
        .single();

      if (messageError) throw messageError;

      // Mettre à jour le timestamp du dernier message dans le match
      await supabase
        .from('matches')
        .update({ last_message_at: message.created_at })
        .eq('id', matchId);

      return {
        success: true,
        message: {
          id: message.id,
          content: message.content,
          type: message.message_type,
          createdAt: message.created_at,
          isRead: message.is_read,
          senderId: user.id,
          senderName: message.sender.full_name,
          senderPhoto: message.sender.profile_picture_url,
          isOwn: true
        }
      };

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Obtenir les messages d'un match
   * @param {string} matchId - ID du match
   * @param {number} limit - Nombre de messages à récupérer
   * @param {string} before - ID du message avant lequel récupérer (pagination)
   * @returns {Array} Liste des messages
   */
  async getMatchMessages(matchId, limit = 50, before = null) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      // Vérifier l'accès au match
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .select('id, user1_id, user2_id')
        .eq('id', matchId)
        .single();

      if (matchError) throw matchError;

      if (match.user1_id !== user.id && match.user2_id !== user.id) {
        throw new Error('Accès non autorisé à ce match');
      }

      let query = supabase
        .from('messages')
        .select(`
          id,
          content,
          message_type,
          created_at,
          is_read,
          sender_id,
          sender:user_profiles!messages_sender_id_fkey(
            id,
            full_name,
            profile_picture_url
          )
        `)
        .eq('match_id', matchId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (before) {
        // Pour la pagination, récupérer les messages avant un certain ID
        const { data: beforeMessage } = await supabase
          .from('messages')
          .select('created_at')
          .eq('id', before)
          .single();

        if (beforeMessage) {
          query = query.lt('created_at', beforeMessage.created_at);
        }
      }

      const { data: messages, error } = await query;
      if (error) throw error;

      const formattedMessages = messages?.map(msg => ({
        id: msg.id,
        content: msg.content,
        type: msg.message_type,
        createdAt: msg.created_at,
        isRead: msg.is_read,
        senderId: msg.sender_id,
        senderName: msg.sender.full_name,
        senderPhoto: msg.sender.profile_picture_url,
        isOwn: msg.sender_id === user.id
      })).reverse() || []; // Reverse pour avoir l'ordre chronologique

      return {
        success: true,
        messages: formattedMessages
      };

    } catch (error) {
      console.error('Erreur lors du fetch des messages:', error);
      return {
        success: false,
        error: error.message,
        messages: []
      };
    }
  },

  /**
   * Marquer les messages comme lus
   * @param {string} matchId - ID du match
   * @param {Array} messageIds - IDs des messages à marquer comme lus (optionnel)
   * @returns {Object} Résultat de l'opération
   */
  async markMessagesAsRead(matchId, messageIds = null) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      let query = supabase
        .from('messages')
        .update({ is_read: true })
        .eq('match_id', matchId)
        .neq('sender_id', user.id); // Ne pas marquer ses propres messages

      if (messageIds && messageIds.length > 0) {
        query = query.in('id', messageIds);
      }

      const { error } = await query;
      if (error) throw error;

      return {
        success: true,
        message: 'Messages marqués comme lus'
      };

    } catch (error) {
      console.error('Erreur lors du marquage des messages:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Obtenir le nombre de messages non lus par match
   * @returns {Object} Nombre de messages non lus par match
   */
  async getUnreadMessagesCounts() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      // Récupérer tous les matches de l'utilisateur
      const { data: matches } = await supabase
        .from('matches')
        .select('id')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('is_active', true);

      if (!matches || matches.length === 0) {
        return { success: true, counts: {}, total: 0 };
      }

      const matchIds = matches.map(m => m.id);

      // Compter les messages non lus pour chaque match
      const { data: unreadCounts, error } = await supabase
        .from('messages')
        .select('match_id')
        .in('match_id', matchIds)
        .eq('is_read', false)
        .neq('sender_id', user.id);

      if (error) throw error;

      // Grouper par match_id
      const counts = {};
      let total = 0;

      unreadCounts?.forEach(msg => {
        counts[msg.match_id] = (counts[msg.match_id] || 0) + 1;
        total++;
      });

      return {
        success: true,
        counts,
        total
      };

    } catch (error) {
      console.error('Erreur lors du fetch des messages non lus:', error);
      return {
        success: false,
        error: error.message,
        counts: {},
        total: 0
      };
    }
  },

  /**
   * Supprimer un message
   * @param {string} messageId - ID du message à supprimer
   * @returns {Object} Résultat de l'opération
   */
  async deleteMessage(messageId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      // Vérifier que l'utilisateur est l'expéditeur du message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .select('id, sender_id')
        .eq('id', messageId)
        .single();

      if (messageError) throw messageError;

      if (message.sender_id !== user.id) {
        throw new Error('Vous ne pouvez supprimer que vos propres messages');
      }

      // Supprimer le message (ou le marquer comme supprimé)
      const { error: deleteError } = await supabase
        .from('messages')
        .update({ 
          content: '[Message supprimé]',
          is_deleted: true,
          deleted_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (deleteError) throw deleteError;

      return {
        success: true,
        message: 'Message supprimé avec succès'
      };

    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Écouter les nouveaux messages en temps réel
   * @param {string} matchId - ID du match à écouter
   * @param {Function} callback - Fonction appelée lors de nouveaux messages
   * @returns {Object} Subscription pour arrêter l'écoute
   */
  subscribeToMessages(matchId, callback) {
    const { data: { user } } = supabase.auth.getUser();
    
    const subscription = supabase
      .channel(`messages-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`
        },
        async (payload) => {
          // Récupérer les détails complets du message
          const { data: messageDetail } = await supabase
            .from('messages')
            .select(`
              id,
              content,
              message_type,
              created_at,
              is_read,
              sender_id,
              sender:user_profiles!messages_sender_id_fkey(
                id,
                full_name,
                profile_picture_url
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (messageDetail) {
            const formattedMessage = {
              id: messageDetail.id,
              content: messageDetail.content,
              type: messageDetail.message_type,
              createdAt: messageDetail.created_at,
              isRead: messageDetail.is_read,
              senderId: messageDetail.sender_id,
              senderName: messageDetail.sender.full_name,
              senderPhoto: messageDetail.sender.profile_picture_url,
              isOwn: messageDetail.sender_id === user.id
            };

            callback(formattedMessage);
          }
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        subscription.unsubscribe();
      }
    };
  }
};
