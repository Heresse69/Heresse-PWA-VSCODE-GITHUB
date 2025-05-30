import React, { useState, useEffect } from 'react';
import { getConversations } from '../data/mockChatData';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    setConversations(getConversations());
    
    const interval = setInterval(() => {
      setConversations([...getConversations()]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chat-page">
      <h1>Messages</h1>
      <div className="conversations-container">
        {conversations.length === 0 ? (
          <p>Aucune conversation</p>
        ) : (
          conversations.map(conv => (
            <div key={conv.id} className="conversation-item">
              <img src={conv.participantAvatar} alt={conv.participantName} />
              <div className="conversation-info">
                <h3>{conv.participantName}</h3>
                <p>{conv.lastMessage || 'Nouvelle conversation'}</p>
                {conv.lastMessageTime && (
                  <span className="timestamp">
                    {new Date(conv.lastMessageTime).toLocaleTimeString()}
                  </span>
                )}
              </div>
              {conv.unreadCount > 0 && (
                <span className="unread-badge">{conv.unreadCount}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatPage;
