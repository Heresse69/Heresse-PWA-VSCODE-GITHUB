import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Search, PlusCircle, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext'; 
import { mockMatchesData as initialChatData } from '@/data/mockChatData'; 
import StoryViewer from '@/components/StoryViewer';

const StoryBubble = ({ story, isOwnStory, isAddButton }) => {
  if (isAddButton) {
    return (
      <Link to="/stories/create" className="flex-shrink-0 flex flex-col items-center space-y-1.5 text-center" style={{width: '90px', minWidth: '90px'}}>
        <Button variant="outline" className="rounded-full border-dashed border-primary/50 bg-slate-700/50 text-primary hover:bg-primary/10 flex items-center justify-center" style={{width: '86px', height: '86px', minWidth: '86px', minHeight: '86px', borderWidth: '2px', borderColor: 'gray'}}>
          <PlusCircle size={32} />
        </Button>
        <span className="text-xs text-gray-300">Ajouter</span>
      </Link>
    );
  }

  const isUnseen = !story.seen && !isOwnStory;

  return (
    <Link to={`/stories/${story.id}`} className="flex-shrink-0 flex flex-col items-center space-y-1.5 text-center" style={{width: '90px', minWidth: '90px'}}>
      <div className="relative">
        <div 
          className={`rounded-full p-1 ${isUnseen ? 'story-gradient-ring' : 'bg-gray-600'}`}
          style={{width: '90px', height: '90px'}}
        >
          <Avatar 
            className="relative z-10 border-2 border-slate-900" 
            style={{width: '82px', height: '82px', minWidth: '82px', minHeight: '82px'}}
          >
            <AvatarImage src={story.url} alt={story.userName} />
            <AvatarFallback className="bg-slate-600" style={{fontSize: '18px'}}>{story.userName.substring(0, 1)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <span className="text-xs text-gray-300 truncate w-full">{isOwnStory ? 'Ma Story' : story.userName}</span>
    </Link>
  );
};

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
  const { currentUser, stories: allStoriesFromContext } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [chatList, setChatList] = useState(initialChatData);
  const [displayableStories, setDisplayableStories] = useState([]);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  useEffect(() => {
    if (currentUser && allStoriesFromContext) {
      // Utiliser toutes les stories du contexte, pas seulement celles des chats
      const currentUserStory = allStoriesFromContext.find(s => s.userId === currentUser.id && s.userName === "Moi");
      const otherStories = allStoriesFromContext.filter(story => story.userId !== currentUser.id);
      
      // Séparer les stories vues et non vues, puis les trier
      const unseenStories = otherStories.filter(story => !story.seen);
      const seenStories = otherStories.filter(story => story.seen);
      
      const sortedStories = [
        ...(currentUserStory ? [{ ...currentUserStory, isOwnStory: true }] : []),
        ...unseenStories, // Stories non vues en premier
        ...seenStories   // Stories vues en dernier
      ];
      setDisplayableStories(sortedStories);
    }
  }, [currentUser, allStoriesFromContext]);

  const openStoryViewer = (storyIndex) => {
    setCurrentStoryIndex(storyIndex);
    setIsStoryViewerOpen(true);
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
      <div className="flex-shrink-0 p-4 pb-0">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-gray-400 mb-3 px-1">Stories</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            <StoryBubble isAddButton={true} />
            {(displayableStories || []).map((story, index) => (
              <div key={story.id} onClick={() => openStoryViewer(index)}>
                <StoryBubble
                  story={story}
                  isOwnStory={story.isOwnStory || (currentUser && story.userId === currentUser.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="relative mb-5">
          <Input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-pink-500 focus:border-pink-500 pl-10 rounded-full py-2.5"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {isStoryViewerOpen && (
        <StoryViewer
          stories={displayableStories}
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

      <style jsx global>{`
        .story-gradient-ring {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
          background-size: 300% 300%;
          animation: story-gradient-animation 3s ease infinite;
        }
        
        @keyframes story-gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default ChatPage;