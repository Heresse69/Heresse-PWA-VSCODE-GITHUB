/**
 * Hook personnalisé pour la gestion des messages
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { messagesService } from '../services/supabase/messages.js';

export const useMessages = (matchId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const subscriptionRef = useRef(null);

  // Charger les messages
  const loadMessages = useCallback(async (limit = 50, before = null) => {
    if (!matchId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await messagesService.getMatchMessages(matchId, limit, before);
      
      if (result.success) {
        if (before) {
          // Pagination - ajouter les messages plus anciens
          setMessages(prev => [...result.messages, ...prev]);
        } else {
          // Premier chargement
          setMessages(result.messages);
        }
        
        // Si on a récupéré moins de messages que demandé, il n'y en a plus
        setHasMore(result.messages.length === limit);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  // Envoyer un message
  const sendMessage = useCallback(async (content, type = 'text') => {
    if (!matchId || !content.trim()) return;

    setSending(true);
    setError(null);

    try {
      const result = await messagesService.sendMessage(matchId, content.trim(), type);
      
      if (result.success) {
        // Ajouter le message à la liste (il sera aussi reçu via subscription)
        setMessages(prev => [...prev, result.message]);
        return { success: true, message: result.message };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setSending(false);
    }
  }, [matchId]);

  // Marquer les messages comme lus
  const markAsRead = useCallback(async (messageIds = null) => {
    if (!matchId) return;

    try {
      const result = await messagesService.markMessagesAsRead(matchId, messageIds);
      
      if (result.success) {
        // Mettre à jour le statut des messages localement
        setMessages(prev => prev.map(msg => ({
          ...msg,
          isRead: messageIds ? messageIds.includes(msg.id) ? true : msg.isRead : !msg.isOwn ? true : msg.isRead
        })));
      }
      
      return result;
    } catch (err) {
      console.error('Erreur lors du marquage des messages:', err);
      return { success: false, error: err.message };
    }
  }, [matchId]);

  // Supprimer un message
  const deleteMessage = useCallback(async (messageId) => {
    try {
      const result = await messagesService.deleteMessage(messageId);
      
      if (result.success) {
        // Mettre à jour le message localement
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: '[Message supprimé]', isDeleted: true }
            : msg
        ));
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Charger plus de messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || loading || messages.length === 0) return;

    const oldestMessage = messages[0];
    await loadMessages(50, oldestMessage.id);
  }, [hasMore, loading, messages, loadMessages]);

  // Écouter les nouveaux messages en temps réel
  useEffect(() => {
    if (!matchId) return;

    // S'abonner aux nouveaux messages
    const subscription = messagesService.subscribeToMessages(matchId, (newMessage) => {
      setMessages(prev => {
        // Éviter les doublons
        const exists = prev.some(msg => msg.id === newMessage.id);
        if (exists) return prev;
        
        return [...prev, newMessage];
      });
    });

    subscriptionRef.current = subscription;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [matchId]);

  // Charger les messages initiaux
  useEffect(() => {
    if (matchId) {
      loadMessages();
    }
  }, [matchId, loadMessages]);

  // Nettoyer à la destruction
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  return {
    messages,
    loading,
    sending,
    error,
    hasMore,
    actions: {
      sendMessage,
      loadMessages,
      loadMoreMessages,
      markAsRead,
      deleteMessage
    }
  };
};

export default useMessages;
