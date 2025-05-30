import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext'; 
import { getConversations } from '@/data/mockChatData'; 
import StoryViewer from '@/components/StoryViewer';
import StoriesSection from '@/components/StoriesSection';

const ChatCard = ({ chat, index }) => {
  const formatTimestamp = (timestamp) => {
    // Simple formatting - could be enhanced with moment.js or date-fns
    return timestamp;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-slate-700 rounded-xl p-4 hover:bg-slate-600 transition-colors duration-200"
    >
      <Link to={`/chat/${chat.id}`} className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage src={chat.avatarImage} alt={chat.name} />
            <AvatarFallback className="bg-slate-600">{chat.avatarText}</AvatarFallback>
          </Avatar>
          {chat.online && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-700 rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-white truncate">{chat.name}</h3>
            <span className="text-xs text-gray-400 flex-shrink-0">{formatTimestamp(chat.timestamp)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-300 truncate flex-1 mr-2">{chat.lastMessage}</p>
            {chat.unread > 0 && (
              <Badge variant="destructive" className="bg-pink-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                {chat.unread}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center mt-1 space-x-2">
            {chat.online ? (
              <span className="text-xs text-green-400">En ligne</span>
            ) : (
              <span className="text-xs text-gray-500">Hors ligne</span>
            )}
            {chat.availableMedia && chat.availableMedia.length > 0 && (
              <span className="text-xs text-pink-400">• {chat.availableMedia.length} nouveau{chat.availableMedia.length > 1 ? 'x' : ''} média{chat.availableMedia.length > 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <MessageSquare size={18} className="text-gray-400" />
        </div>
      </Link>
    </motion.div>
  );
};

const ChatPage = () => {
  const { currentUser } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Utiliser les vraies conversations au lieu des données statiques
  const [chatList, setChatList] = useState([]);
  
  // Mettre à jour la liste des conversations quand elles changent
  useEffect(() => {
    const conversations = getConversations();
    const enrichedConversations = conversations.map(conv => ({
      id: conv.id,
      name: conv.participantName,
      lastMessage: conv.lastMessage || "Nouvelle conversation",
      timestamp: conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString() : "Maintenant",
      unread: conv.unreadCount || 0,
      online: conv.online || Math.random() > 0.5,
      avatarImage: conv.participantAvatar,
      avatarText: conv.participantName ? conv.participantName.substring(0, 1).toUpperCase() : 'U',
      availableMedia: []
    }));
    setChatList(enrichedConversations);
  }, []);
  
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [availableStories, setAvailableStories] = useState([]);

  const handleStoriesReady = (stories) => {
    console.log('📚 Stories prêtes dans ChatPage:', stories.length);
    setAvailableStories(stories);
  };

  const openStoryViewer = (storyIndex) => {
    console.log('🎯 Tentative d\'ouverture story index:', storyIndex, 'Stories disponibles:', availableStories.length);
    if (availableStories.length > 0) {
      setCurrentStoryIndex(storyIndex);
      setIsStoryViewerOpen(true);
    } else {
      console.warn('Aucune story disponible pour le viewer');
    }
  };

  const closeStoryViewer = () => {
    setIsStoryViewerOpen(false);
  };

  const filteredChats = chatList.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort chats by timestamp (most recent first) and unread messages
  const sortedChats = filteredChats.sort((a, b) => {
    // First sort by unread messages
    if (a.unread > 0 && b.unread === 0) return -1;
    if (a.unread === 0 && b.unread > 0) return 1;
    
    // Then sort by online status
    if (a.online && !b.online) return -1;
    if (!a.online && b.online) return 1;
    
    // Finally by timestamp (simplified sorting)
    return 0;
  });

  const totalUnreadMessages = chatList.reduce((total, chat) => total + chat.unread, 0);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Container des stories uniquement */}
      <div className="flex-shrink-0 px-4 pt-4 pb-0">
        <StoriesSection 
          usersList={chatList}
          currentUser={currentUser}
          onStoryClick={openStoryViewer}
          onStoriesReady={handleStoriesReady}
          showDebug={true}
        />
      </div>

      {/* Barre de recherche dans son propre container */}
      <div className="flex-shrink-0 px-4 pb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-pink-500 focus:border-pink-500 pl-14 pr-4 rounded-full py-2.5 w-full text-sm"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 flex-shrink-0" />
        </div>
      </div>

      {isStoryViewerOpen && availableStories.length > 0 && (
        <StoryViewer
          stories={availableStories}
          initialIndex={currentStoryIndex}
          onClose={closeStoryViewer}
        />
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">
            Messages ({sortedChats.length})
          </h2>
          {totalUnreadMessages > 0 && (
            <Badge variant="destructive" className="bg-pink-500 text-white">
              {totalUnreadMessages} non lu{totalUnreadMessages > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {sortedChats.length > 0 ? (
          <div className="space-y-3 pb-4">
            {sortedChats.map((chat, index) => (
              <ChatCard key={chat.id} chat={chat} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-gray-400 pt-10">
            <MessageSquare size={64} className="mb-4 opacity-50 text-pink-500/70" />
            <h2 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? `Aucune conversation trouvée pour "${searchTerm}"` : "Aucune conversation"}
            </h2>
            <p className="text-sm">
              {searchTerm ? "Essayez un autre terme de recherche." : "Commencez une conversation avec vos matchs !"}
            </p>
            {!searchTerm && (
              <Link to="/matches" className="mt-4">
                <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white">
                  Voir mes matchs
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;