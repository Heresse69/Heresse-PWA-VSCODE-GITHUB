import React from 'react';
    import { Link } from 'react-router-dom';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import { MessageCircle } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useUser } from '@/contexts/UserContext';

    const ChatList = ({ matches, userStories, searchTerm, onSearchTermChange }) => {
      const { currentUser } = useUser();

      return (
        <div className="h-full flex flex-col bg-gradient-to-b from-background to-slate-900 text-white">
          <div className="sticky top-0 z-10 bg-background px-4 pt-4 pb-2">
            <h3 className="text-sm font-semibold text-gray-400 mb-2 px-1">Messages</h3>
          </div>

      <div
        className="flex-1 overflow-y-auto px-4 pb-4 pt-2 space-y-1 scrollable"
        data-scrollable="true"
        style={{ 
          overflowY: 'scroll',
          WebkitOverflowScrolling: 'touch',
          height: 'auto'
        }}
      >
        {matches.length === 0 && !searchTerm && (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-400 pt-10">
            <MessageCircle size={50} className="mb-4 opacity-50" />
            <p className="text-lg">Aucune conversation.</p>
            <p className="text-sm">Vos messages apparaîtront ici.</p>
                    </div>
                      )}
        {matches.length === 0 && searchTerm && (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-400 pt-10">
            <Search size={50} className="mb-4 opacity-50" />
            <p className="text-lg">Aucun résultat pour "{searchTerm}".</p>
                    </div>
        )}
        <AnimatePresence>
          {matches.map(match => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={`/chat/${match.id}`} className="flex items-center p-3 hover:bg-slate-700/70 rounded-lg transition-colors duration-150">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={match.avatarImage} alt={match.name} />
                    <AvatarFallback className="bg-primary text-white">{match.avatarText}</AvatarFallback>
                  </Avatar>
                  {match.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-background" />}
                </div>
                <div className="ml-3 flex-grow overflow-hidden">
                  <h4 className="font-semibold text-white text-sm">{match.name}</h4>
                  <p className="text-xs text-gray-400 truncate">{match.lastMessage}</p>
                </div>
                <div className="flex flex-col items-end ml-2">
                  <span className="text-xs text-gray-500 mb-1">{match.timestamp}</span>
                  {match.unread > 0 && (
                    <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {match.unread}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
    };

    export default ChatList;