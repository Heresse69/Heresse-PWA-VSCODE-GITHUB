import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const StoryBubble = ({ story, isOwnStory, isAddButton, onClick }) => {
  if (isAddButton) {
    return (
      <Link to="/stories/create" className="flex-shrink-0 flex flex-col items-center space-y-1.5 text-center" style={{width: '90px', minWidth: '90px'}}>
        <Button variant="outline" className="rounded-full border-dashed border-primary/50 bg-slate-700/50 text-primary hover:bg-primary/10 flex items-center justify-center" style={{width: '86px', height: '86px', minWidth: '86px', minHeight: '86px', borderWidth: '2px', borderColor: 'hsl(var(--primary))'}}>
          <PlusCircle size={32} />
        </Button>
        <span className="text-xs text-gray-300">Ajouter</span>
      </Link>
    );
  }

  // FORCER L'AFFICHAGE DU CONTOUR POUR TOUTES LES STORIES NON PERSONNELLES
  const shouldShowBorder = !isOwnStory;

  return (
    <div 
      className="flex-shrink-0 flex flex-col items-center space-y-1.5 text-center cursor-pointer" 
      style={{width: '90px', minWidth: '90px'}}
      onClick={onClick}
    >
      <div className="relative">
        {shouldShowBorder ? (
          // Contour dégradé visible
          <div className="relative">
            <div 
              className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-spin"
              style={{
                padding: '4px',
                width: '94px',
                height: '94px',
                left: '-4px',
                top: '-4px'
              }}
            />
            <Avatar 
              className="border-0 relative bg-slate-900 rounded-full" 
              style={{width: '86px', height: '86px', minWidth: '86px', minHeight: '86px', zIndex: 10}}
            >
              <AvatarImage src={story.url} alt={story.userName} />
              <AvatarFallback className="bg-slate-600" style={{fontSize: '18px'}}>
                {story.userName.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          // Story personnelle sans contour
          <Avatar 
            className="border-2 border-slate-600" 
            style={{width: '86px', height: '86px', minWidth: '86px', minHeight: '86px'}}
          >
            <AvatarImage src={story.url} alt={story.userName} />
            <AvatarFallback className="bg-slate-600" style={{fontSize: '18px'}}>
              {story.userName.substring(0, 1)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <span className="text-xs text-gray-300 truncate w-full">
        {isOwnStory ? 'Ma Story' : story.userName}
      </span>
    </div>
  );
};

const StoryContainer = ({ 
  stories = [], 
  currentUser, 
  onStoryClick, 
  className = "" 
}) => {
  console.log('🚀 StoryContainer rendu avec', stories.length, 'stories');

  const sortedStories = [...stories].sort((a, b) => {
    const aIsOwn = a.isOwnStory || (currentUser && a.userId === currentUser.id);
    const bIsOwn = b.isOwnStory || (currentUser && b.userId === currentUser.id);
    
    if (aIsOwn && !bIsOwn) return -1;
    if (!aIsOwn && bIsOwn) return 1;
    if (!a.seen && b.seen) return -1;
    if (a.seen && !b.seen) return 1;
    
    return 0;
  });

  return (
    <div className={`mb-3 ${className}`}>
      <h2 className="text-sm font-semibold text-gray-400 mb-3 px-1">Stories ✨ (MODIFIÉ)</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
        <StoryBubble isAddButton={true} />
        {sortedStories.map((story, index) => (
          <StoryBubble
            key={story.id}
            story={story}
            isOwnStory={story.isOwnStory || (currentUser && story.userId === currentUser.id)}
            onClick={() => onStoryClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default StoryContainer;
