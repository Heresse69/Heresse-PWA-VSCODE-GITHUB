import React, { useRef, useEffect } from 'react';
    import ChatMessageItem from '@/components/chat/ChatMessageItem';

    const ChatMessageList = ({ messages, onPhotoClick, onInitiateSendMedia }) => {
      const messagesEndRef = useRef(null);

      useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);

      return (
        <div 
          className="flex-1 p-4 space-y-4 overflow-y-auto chat-messages scrollable"
          data-scrollable="true"
          style={{
            overflowY: 'scroll',
            WebkitOverflowScrolling: 'touch',
            height: 'auto'
          }}
        >
          {messages.map((msg, index) => (
            <ChatMessageItem 
              key={msg.id || index} 
              msg={msg} 
              onPhotoClick={onPhotoClick} 
              onInitiateSendMedia={onInitiateSendMedia} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      );
    };

    export default ChatMessageList;