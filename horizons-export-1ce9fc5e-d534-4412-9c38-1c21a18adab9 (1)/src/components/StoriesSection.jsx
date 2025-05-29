import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const StoriesSection = ({ usersList = [], currentUser, onStoryClick, onStoriesReady, showDebug = false }) => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    if (!usersList || usersList.length === 0) {
      setStories([]);
      if (onStoriesReady) onStoriesReady([]);
      return;
    }

    try {
      const storiesData = usersList.slice(0, 8).map((user, index) => ({
        id: user.id || `user-${index}`,
        userId: user.id || `user-${index}`,
        userName: user.name || 'Utilisateur',
        userAvatar: user.avatarImage || `https://images.unsplash.com/photo-${1500000000 + index}0000000?w=200&h=200&fit=crop&crop=face`,
        imageUrl: user.avatarImage || `https://images.unsplash.com/photo-${1500000000 + index}0000000?w=400&h=600&fit=crop&crop=face`,
        viewed: Math.random() > 0.6,
        timestamp: Date.now() - (index * 1000 * 60 * 60),
      }));

      setStories(storiesData);
      if (onStoriesReady) onStoriesReady(storiesData);

      if (showDebug) {
        console.log('📚 Stories créées:', storiesData.length);
      }
    } catch (error) {
      console.error('Erreur lors de la création des stories:', error);
      setStories([]);
      if (onStoriesReady) onStoriesReady([]);
    }
  }, [usersList, onStoriesReady, showDebug]);

  if (!usersList || usersList.length === 0) {
    return null;
  }

  return (
    <div className="pb-4">
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
        {/* Story "Ajouter" pour l'utilisateur actuel */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-gray-600 flex items-center justify-center overflow-hidden">
              {currentUser?.avatarImage ? (
                <img 
                  src={currentUser.avatarImage} 
                  alt="Votre profil" 
                  className="w-16 h-16 object-cover rounded-full"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-16 h-16 bg-slate-600 text-white flex items-center justify-center text-lg font-bold rounded-full">
                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center border-2 border-slate-800">
              <Plus size={12} className="text-white" />
            </div>
          </div>
          <p className="text-xs text-center text-gray-300 mt-1 w-16 truncate">Ajouter</p>
        </div>

        {/* Stories des autres utilisateurs */}
        {stories.map((story, index) => (
          <div 
            key={`story-${story.id}-${index}`}
            className="flex-shrink-0 cursor-pointer" 
            onClick={() => onStoryClick && onStoryClick(index)}
          >
            <div className={`relative w-16 h-16 rounded-full p-0.5 ${
              story.viewed 
                ? 'bg-gray-500' 
                : 'bg-gradient-to-r from-pink-500 to-purple-600'
            }`}>
              <div className="w-full h-full rounded-full bg-slate-800 p-0.5 overflow-hidden flex items-center justify-center">
                <img 
                  src={story.userAvatar} 
                  alt={story.userName} 
                  className="w-14 h-14 object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.userName)}&background=ec4899&color=ffffff&size=56`;
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-center text-gray-300 mt-1 w-16 truncate">
              {story.userName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesSection;
