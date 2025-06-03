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
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 via-red-500 to-yellow-400 p-1"
              style={{
                width: '94px',
                height: '94px',
                left: '-4px',
                top: '-4px'
              }}
            >
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <Avatar 
                  className="border-0 relative" 
                  style={{width: '86px', height: '86px', minWidth: '86px', minHeight: '86px'}}
                >
                  <AvatarImage src={story.url} alt={story.userName} />
                  <AvatarFallback className="bg-slate-600" style={{fontSize: '18px'}}>
                    {story.userName.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
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

  // Grouper les stories par utilisateur
  const storiesByUser = stories.reduce((acc, story) => {
    const userId = story.userId;
    if (!acc[userId]) {
      acc[userId] = {
        userId: userId,
        userName: story.userName,
        url: story.url, // Photo de profil de l'utilisateur
        stories: [],
        isOwnStory: story.isOwnStory || (currentUser && story.userId === currentUser.id),
        hasUnseenStories: false
      };
    }
    acc[userId].stories.push(story);
    if (!story.seen) {
      acc[userId].hasUnseenStories = true;
    }
    return acc;
  }, {});

  // Convertir en tableau et trier
  const userStories = Object.values(storiesByUser).sort((a, b) => {
    // Stories personnelles en premier
    if (a.isOwnStory && !b.isOwnStory) return -1;
    if (!a.isOwnStory && b.isOwnStory) return 1;
    // Puis stories non vues
    if (a.hasUnseenStories && !b.hasUnseenStories) return -1;
    if (!a.hasUnseenStories && b.hasUnseenStories) return 1;
    return 0;
  });

  // Nouvelle logique de navigation des stories par utilisateur
  const handleUserStoryClick = (clickedUserIndex) => {
    // Créer la liste ordonnée des utilisateurs à partir de l'utilisateur cliqué
    const orderedUsers = [
      ...userStories.slice(clickedUserIndex), // À partir de l'utilisateur cliqué
      ...userStories.slice(0, clickedUserIndex) // Puis le reste dans l'ordre original
    ];
    
    // Créer un tableau plat de toutes les stories dans l'ordre de navigation souhaité
    const orderedStories = [];
    orderedUsers.forEach(userStory => {
      userStory.stories.forEach(story => {
        orderedStories.push({
          ...story,
          userStoryData: userStory // Garder une référence aux données utilisateur
        });
      });
    });

    // Appeler onStoryClick avec l'index 0 car on commence toujours par la première story
    // de l'utilisateur cliqué, et on passe les stories ordonnées
    if (onStoryClick) {
      onStoryClick(0, orderedStories);
    }
  };

  return (
    <div className={`mb-3 ${className}`}>
      <h2 className="text-sm font-semibold text-gray-400 mb-3 px-1">Stories ✨ (MODIFIÉ)</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar" style={{width: 'fit-content', minWidth: '100%'}}>
        <StoryBubble isAddButton={true} />
        {userStories.map((userStory, index) => (
          <StoryBubble
            key={userStory.userId}
            story={userStory}
            isOwnStory={userStory.isOwnStory}
            onClick={() => handleUserStoryClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default StoryContainer;
