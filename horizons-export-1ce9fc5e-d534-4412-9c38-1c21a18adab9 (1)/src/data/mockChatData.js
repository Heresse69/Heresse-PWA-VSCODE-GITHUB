import React from 'react';

// Structure pour les matchs (utilisateurs avec qui on a matché)
export const mockMatchesData = [];

// Structure pour les conversations actives
export const mockConversationsData = [];

// Fonction pour ajouter un nouveau match
export const addMatch = (user) => {
  const newMatch = {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    age: user.age,
    distance: user.distance,
    matchedAt: new Date().toISOString(),
    hasConversation: false
  };
  
  // Vérifier si le match n'existe pas déjà
  const existingMatch = mockMatchesData.find(match => match.id === user.id);
  if (!existingMatch) {
    mockMatchesData.push(newMatch);
  }
  
  return newMatch;
};

// Fonction pour démarrer une conversation avec un match
export const startConversation = (matchId) => {
  const match = mockMatchesData.find(m => m.id === matchId);
  if (!match) return null;
  
  // Marquer le match comme ayant une conversation
  match.hasConversation = true;
  
  const newConversation = {
    id: `conv_${matchId}_${Date.now()}`,
    matchId: matchId,
    participantName: match.name,
    participantAvatar: match.avatar,
    messages: [],
    lastMessage: null,
    lastMessageTime: null,
    unreadCount: 0
  };
  
  // Vérifier si la conversation n'existe pas déjà
  const existingConv = mockConversationsData.find(conv => conv.matchId === matchId);
  if (!existingConv) {
    mockConversationsData.push(newConversation);
  }
  
  return newConversation;
};

// Fonction pour ajouter un message à une conversation
export const addMessage = (conversationId, message, isFromUser = true) => {
  const conversation = mockConversationsData.find(conv => conv.id === conversationId);
  if (!conversation) return null;
  
  const newMessage = {
    id: `msg_${Date.now()}`,
    text: message,
    timestamp: new Date().toISOString(),
    isFromUser: isFromUser
  };
  
  conversation.messages.push(newMessage);
  conversation.lastMessage = message;
  conversation.lastMessageTime = newMessage.timestamp;
  
  if (!isFromUser) {
    conversation.unreadCount++;
  }
  
  return newMessage;
};

// Fonction pour obtenir tous les matchs
export const getMatches = () => mockMatchesData;

// Fonction pour obtenir toutes les conversations
export const getConversations = () => mockConversationsData;

// Fonction pour obtenir une conversation spécifique
export const getConversation = (conversationId) => {
  return mockConversationsData.find(conv => conv.id === conversationId);
};

// Fonction pour marquer une conversation comme lue
export const markConversationAsRead = (conversationId) => {
  const conversation = mockConversationsData.find(conv => conv.id === conversationId);
  if (conversation) {
    conversation.unreadCount = 0;
  }
};

// Fonction pour créer automatiquement une conversation lors d'un match
export const createMatchConversation = (matchUser) => {
  // Vérifier si une conversation existe déjà pour ce match
  const existingConv = mockConversationsData.find(conv => conv.matchId === matchUser.id);
  if (existingConv) {
    return existingConv;
  }

  // Créer une nouvelle conversation
  const newConversation = {
    id: `conv_${matchUser.id}_${Date.now()}`,
    matchId: matchUser.id,
    participantName: matchUser.name,
    participantAvatar: matchUser.avatar,
    messages: [
      {
        id: `msg_welcome_${Date.now()}`,
        text: `Vous avez matché avec ${matchUser.name} ! Dites bonjour 👋`,
        timestamp: new Date().toISOString(),
        isFromUser: false,
        type: 'system'
      }
    ],
    lastMessage: `Nouveau match avec ${matchUser.name}`,
    lastMessageTime: new Date().toISOString(),
    unreadCount: 1,
    online: Math.random() > 0.3, // Simulation statut en ligne
    avatarImage: matchUser.avatar,
    name: matchUser.name,
    avatarText: matchUser.name.substring(0, 1).toUpperCase()
  };

  mockConversationsData.push(newConversation);
  
  // Marquer le match comme ayant une conversation
  const match = mockMatchesData.find(m => m.id === matchUser.id);
  if (match) {
    match.hasConversation = true;
  }

  return newConversation;
};