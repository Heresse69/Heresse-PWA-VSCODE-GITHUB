import { useState, useEffect } from 'react';

    const useChatLogic = (initialMatches, currentUser, currentChatId) => {
      const [matches, setMatches] = useState(initialMatches);
      const [currentChat, setCurrentChat] = useState(null);

      useEffect(() => {
        if (currentChatId) {
          const chat = matches.find(m => m.id === currentChatId);
          setCurrentChat(chat);
          if (chat) {
            setMatches(prev => prev.map(m => m.id === currentChatId ? { ...m, unread: 0 } : m));
          }
        } else {
          setCurrentChat(null);
        }
      }, [currentChatId, matches]);

      const addMessageToChat = (messageContent, targetChatId) => {
        const chatToUpdateId = targetChatId || currentChat?.id;
        if (!chatToUpdateId || !currentUser) return;

        const message = {
          id: `msg_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          senderName: messageContent.sender === 'user' ? currentUser.name : messageContent.sender,
          ...messageContent
        };
        
        setMatches(prevMatches => prevMatches.map(match => {
          if (match.id === chatToUpdateId) {
            const newMessages = [...(match.messages || []), message];
            let lastMsgText = message.text || '';
            if (message.type === 'photo') lastMsgText = message.sender === 'user' ? 'Photo envoyée' : 'Photo reçue';
            if (message.type === 'media_request') lastMsgText = message.sender === 'user' ? 'Demande de média envoyée' : 'Vous avez reçu une demande de média';
            return { ...match, messages: newMessages, lastMessage: lastMsgText, timestamp: message.timestamp };
          }
          return match;
        }));

        if (chatToUpdateId === currentChat?.id) {
           setCurrentChat(prev => {
            if (!prev) return null; 
            const newMessages = [...(prev.messages || []), message];
            return {...prev, messages: newMessages};
           });
        }
      };
      
      return { matches, setMatches, currentChat, setCurrentChat, addMessageToChat };
    };

    export default useChatLogic;