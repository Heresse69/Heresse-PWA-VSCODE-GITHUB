import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Search, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext'; 
import { mockMatchesData as initialMockMatchedProfiles } from '@/data/mockChatData'; 
import StoryViewer from '@/components/StoryViewer';

    const StoryBubble = ({ story, isOwnStory, isAddButton }) => {
      if (isAddButton) {
        return (
          <Link to="/stories/create" className="flex-shrink-0 flex flex-col items-center space-y-1.5 text-center w-24">
            <Button variant="outline" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-dashed border-primary/50 bg-slate-700/50 text-primary hover:bg-primary/10 flex items-center justify-center">
              <PlusCircle size={32} />
            </Button>
            <span className="text-xs text-gray-300">Ajouter</span>
          </Link>
        );
      }

      return (
        <Link to={`/stories/${story.id}`} className="flex-shrink-0 flex flex-col items-center space-y-1.5 text-center w-24">
          <Avatar className={`w-20 h-20 sm:w-24 sm:h-24 border-2 ${!story.seen && !isOwnStory ? 'border-pink-500' : 'border-slate-600'}`}>
            <AvatarImage src={story.url} alt={story.userName} />
            <AvatarFallback className="bg-slate-600 text-lg">{story.userName.substring(0, 1)}</AvatarFallback>
          </Avatar>
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
            const matchedUserIds = new Set(matchedProfilesList.map(match => match.id));
            const currentUserStory = allStoriesFromContext.find(s => s.userId === currentUser.id && s.userName === "Moi");
            const storiesFromMatches = allStoriesFromContext.filter(story => 
                matchedUserIds.has(story.userId) && story.userId !== currentUser.id
            );
            const uniqueStoriesFromMatches = Array.from(new Map(storiesFromMatches.map(story => [story.userId, story])).values());
            const sortedStories = [
        ...(currentUserStory ? [{ ...currentUserStory, isOwnStory: true }] : []),
                ...uniqueStoriesFromMatches.sort((a, b) => (a.seen === b.seen) ? 0 : a.seen ? 1 : -1)
            ];
            setDisplayableStories(sortedStories);
        }
      }, [currentUser, allStoriesFromContext, matchedProfilesList]);

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
    <div className="h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Section fixe en haut - Stories */}
      <div className="flex-shrink-0 p-4 pb-2">
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

      {/* Section fixe - Barre de recherche */}
      <div className="flex-shrink-0 px-4 pb-4">
        <div className="relative">
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

      {/* Section scrollable - Liste des matchs */}
      <div className="flex-1 px-4 pb-20 overflow-y-auto">
        {isStoryViewerOpen && (
          <StoryViewer
            stories={displayableStories}
            initialIndex={currentStoryIndex}
            onClose={closeStoryViewer}
          />
        )}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Vos Matchs ({filteredProfiles.length})</h2>
          {filteredProfiles.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
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
      </div>
    </div>
  );
};

    export default MatchesPage;