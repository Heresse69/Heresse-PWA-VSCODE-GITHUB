import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Search, PlusCircle, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext'; 
import { mockMatchesData as initialMockMatchedProfiles } from '@/data/mockChatData'; 
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

const MatchCard = ({ profile, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative aspect-[3/4] bg-slate-700 rounded-xl overflow-hidden shadow-lg group"
    >
      <img alt={profile.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" src={profile.avatarImage || `https://source.unsplash.com/random/400x600?person&sig=${profile.id}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 flex flex-col justify-end">
        <h3 className="text-xl font-bold text-white">{profile.name}, {profile.age || 'N/A'}</h3>
        <p className={`text-xs mb-1 ${profile.online ? 'text-green-300' : 'text-gray-400'}`}>{profile.online ? 'En ligne' : (profile.lastActivity || 'Actif récemment')}</p>
        {profile.commonInterests > 0 && (
          <p className="text-xs text-gray-200 flex items-center">
            <Heart size={12} className="mr-1 text-pink-400 fill-current" /> {profile.commonInterests} centres d'intérêt en commun
          </p>
        )}
      </div>
      <Link to={`/chat/${profile.id}`} className="absolute inset-0" aria-label={`Chatter avec ${profile.name}`}></Link>
      <Button 
        size="icon" 
        variant="ghost"
        className="absolute top-2 right-2 bg-black/30 hover:bg-pink-500/70 text-white rounded-full w-9 h-9 opacity-0 group-hover:opacity-100 transition-opacity"
        asChild
      >
        <Link to={`/chat/${profile.id}`}>
          <MessageSquare size={18} />
        </Link>
      </Button>
    </motion.div>
  );
};

const MatchesPage = () => {
  const { currentUser, stories: allStoriesFromContext } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [matchedProfilesList, setMatchedProfilesList] = useState(
    initialMockMatchedProfiles.map(profile => ({
      ...profile,
      age: Math.floor(Math.random() * 10) + 20, 
      commonInterests: Math.floor(Math.random() * 5) 
    }))
  );
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

  const filteredProfiles = matchedProfilesList.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            placeholder="Rechercher un match..."
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
            Matchs ({filteredProfiles.length})
          </h2>
        </div>

        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {filteredProfiles.map((profile, index) => (
              <MatchCard key={profile.id} profile={profile} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-gray-400 pt-10">
            <Heart size={64} className="mb-4 opacity-50 text-pink-500/70" />
            <h2 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? `Aucun match trouvé pour "${searchTerm}"` : "Aucun match pour le moment"}
            </h2>
            <p className="text-sm">
              {searchTerm ? "Essayez un autre terme de recherche." : "Continuez à swiper pour trouver des matchs !"}
            </p>
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

export default MatchesPage;