import React from 'react';
    import { Link } from 'react-router-dom';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Search, MessageCircle, PlusCircle } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useUser } from '@/contexts/UserContext';

    const StoryBubble = ({ story, isOwnStory, isAddButton }) => {
      if (isAddButton) {
        return (
          <Link to="/stories/create" className="flex-shrink-0 flex flex-col items-center space-y-1.5 text-center w-20">
            <Button variant="outline" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-dashed border-primary/50 bg-slate-700/50 text-primary hover:bg-primary/10 flex items-center justify-center">
              <PlusCircle size={30} />
            </Button>
            <span className="text-xs text-gray-300">Ajouter</span>
          </Link>
        );
      }
    
      return (
        <Link to={`/stories/${story.id}`} className="flex-shrink-0 flex flex-col items-center space-y-1.5 text-center w-20">
          <Avatar className={`w-16 h-16 sm:w-20 sm:h-20 border-2 ${!story.seen && !isOwnStory ? 'border-pink-500' : 'border-slate-600'}`}>
            <AvatarImage src={story.url} alt={story.userName} />
            <AvatarFallback className="bg-slate-600 text-lg">{story.userName.substring(0, 1)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-300 truncate w-full">{isOwnStory ? 'Ma Story' : story.userName}</span>
        </Link>
      );
    };

    const ChatList = ({ matches, userStories, searchTerm, onSearchTermChange }) => {
      const { currentUser } = useUser();
      const storiesSectionHeight = 'h-[140px]';
  const searchBarHeight = 'h-[60px]';
      const messagesTitleHeight = 'h-[60px]';

  const topForSearchBar = 'top-[140px]';
  const topForStories = 'top-0';
      const topForMessagesTitle = 'top-[200px]'; 

      return (
        <div className="h-full flex flex-col bg-gradient-to-b from-background to-slate-900 text-white">
          <div className={`sticky ${topForStories} ${storiesSectionHeight} z-20 bg-gradient-to-b from-slate-900 via-slate-900 to-background px-4 pt-4 pb-2`}>
             <h3 className="text-sm font-semibold text-gray-400 mb-3 px-1">Stories</h3>
             <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
              <StoryBubble isAddButton={true} />
              {(userStories || []).map(story => (
                <StoryBubble 
                  key={story.id} 
                  story={story} 
                  isOwnStory={story.isOwnStory || (currentUser && story.userId === currentUser.id)}
                />
              ))}
            </div>
          </div>
          
      <div className={`sticky ${topForSearchBar} ${searchBarHeight} z-30 bg-gradient-to-b from-background to-slate-900 px-4 pt-2 pb-2`}>
        <div className="relative h-full flex items-center">
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-primary focus:border-primary pl-10 rounded-full py-2.5 w-full"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
              </div>

      <div className={`sticky ${topForMessagesTitle} ${messagesTitleHeight} z-10 bg-background px-4 pt-4 pb-2`}>
        <h3 className="text-sm font-semibold text-gray-400 mb-2 px-1">Messages</h3>
              </div>

      <div
        className="flex-grow overflow-y-auto px-4 pb-4 pt-2 space-y-1"
        style={{ height: `calc(100% - (60px + 140px + 60px))` }}
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