import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';

const StoriesSection = ({ usersList, currentUser, onStoryClick, onStoriesReady }) => {
  const { seenStories, markStoryAsSeen } = useUser();
  const [displayableStories, setDisplayableStories] = useState([]);

  useEffect(() => {
    if (currentUser && usersList) {
      // Créer des stories avec les vraies photos des utilisateurs
      const testStories = usersList.slice(0, 5).map((user, index) => {
        const segmentCount = Math.floor(Math.random() * 3) + 1; // 1 à 3 segments
        const segments = Array.from({ length: segmentCount }, (_, segIndex) => ({
          id: `${user.id}-segment-${segIndex}`,
          type: 'image',
          // Utiliser les vraies photos des utilisateurs pour les segments
          url: user.photos && user.photos.length > segIndex 
            ? user.photos[segIndex] 
            : user.avatarImage || `https://picsum.photos/400/600?random=${user.id + segIndex + 100}`,
          duration: 4000
        }));

        return {
          id: `story-${user.id}`,
          userId: user.id,
          userName: user.name,
          // Utiliser l'avatar réel de l'utilisateur
          url: user.avatarImage || `https://picsum.photos/100/100?random=${user.id}`,
          seen: seenStories?.has(`story-${user.id}`) || false,
          timestamp: Date.now() - (index * 1000000),
          segments: segments
        };
      });
      
      // Trier : stories non vues en premier
      const sortedStories = testStories.sort((a, b) => {
        if (!a.seen && b.seen) return -1;
        if (a.seen && !b.seen) return 1;
        return b.timestamp - a.timestamp;
      });
      
      setDisplayableStories(sortedStories);
      
      if (onStoriesReady) {
        onStoriesReady(sortedStories);
      }
    }
  }, [currentUser, usersList, onStoriesReady, seenStories]);

  const handleStoryClick = (index) => {
    const story = displayableStories[index];
    if (story && !story.seen) {
      markStoryAsSeen(story.id);
    }
    onStoryClick(index);
  };
  
  return (
    <div className="mb-3">
      <h2 className="text-sm font-semibold text-gray-400 mb-3 px-1">Stories</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
        {/* Bouton Ajouter - réduit de 15% supplémentaires */}
        <Link to="/stories/create" className="flex-shrink-0 flex flex-col items-center space-y-1.5 text-center" style={{width: '65px', minWidth: '65px'}}>
          <Button variant="outline" className="rounded-full border-dashed border-primary/50 bg-slate-700/50 text-primary hover:bg-primary/10 flex items-center justify-center" style={{width: '63px', height: '63px', minWidth: '63px', minHeight: '63px', borderWidth: '2px'}}>
            <PlusCircle size={23} />
          </Button>
          <span className="text-xs text-gray-300">Ajouter</span>
        </Link>
        
        {/* Stories - réduites de 15% supplémentaires */}
        {displayableStories.map((story, index) => {
          const shouldShowBorder = !story.seen;
          
          return (
            <div 
              key={story.id}
              className="flex-shrink-0 flex flex-col items-center space-y-1.5 text-center cursor-pointer" 
              style={{width: '65px', minWidth: '65px'}}
              onClick={() => handleStoryClick(index)}
            >
              <div className="relative">
                {shouldShowBorder && (
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%)',
                      padding: '2px',
                      width: '67px',
                      height: '67px',
                      left: '-2px',
                      top: '-2px',
                      zIndex: 1
                    }}
                  />
                )}
                <Avatar 
                  className={`border-2 ${shouldShowBorder ? 'border-transparent relative z-10' : 'border-slate-600'}`} 
                  style={{width: '63px', height: '63px', minWidth: '63px', minHeight: '63px'}}
                >
                  <AvatarImage src={story.url} alt={story.userName} />
                  <AvatarFallback className="bg-slate-600" style={{fontSize: '13px'}}>
                    {story.userName.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs text-gray-300 truncate w-full">
                {story.userName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoriesSection;
