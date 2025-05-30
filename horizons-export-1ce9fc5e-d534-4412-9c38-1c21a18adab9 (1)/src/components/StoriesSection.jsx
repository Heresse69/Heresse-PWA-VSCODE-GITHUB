import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Camera, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const StoriesSection = ({ usersList = [], currentUser, onStoryClick, onStoriesReady, showDebug = false }) => {
  const [stories, setStories] = useState([]);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const { toast } = useToast();

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

  const handleAddStoryClick = () => {
    setShowAddStoryModal(true);
  };

  const handleFileSelect = (event, isCamera = false) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      toast({
        title: "Type de fichier non supporté",
        description: "Veuillez sélectionner une image ou une vidéo.",
        variant: "destructive"
      });
      return;
    }

    // Vérifier la durée de la vidéo (max 10 secondes)
    if (isVideo) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        if (video.duration > 10) {
          toast({
            title: "Vidéo trop longue",
            description: "La vidéo ne peut pas dépasser 10 secondes.",
            variant: "destructive"
          });
          return;
        }
        processStoryFile(file, isVideo);
      };
      video.src = URL.createObjectURL(file);
    } else {
      processStoryFile(file, false);
    }
  };

  const processStoryFile = (file, isVideo) => {
    // Ici tu peux traiter le fichier sélectionné
    console.log('📸 Fichier story sélectionné:', {
      name: file.name,
      type: file.type,
      size: file.size,
      isVideo
    });

    toast({
      title: "Story ajoutée !",
      description: `Votre ${isVideo ? 'vidéo' : 'photo'} a été ajoutée à vos stories.`,
      className: "bg-green-500 text-white"
    });

    setShowAddStoryModal(false);

    // Reset les inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  if (!usersList || usersList.length === 0) {
    return null;
  }

  return (
    <div className="pb-4">
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}>
        {/* Story "Ajouter" pour l'utilisateur actuel avec sa photo de profil */}
        <div className="flex-shrink-0 min-w-[64px]">
          <div className="relative cursor-pointer" onClick={handleAddStoryClick}>
            <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-gray-600 flex items-center justify-center overflow-hidden">
              {currentUser?.avatarImage ? (
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img 
                    src={currentUser.avatarImage} 
                    alt="Votre profil" 
                    className="w-full h-full object-cover"
                    style={{ 
                      borderRadius: '50%',
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-slate-600 text-white flex items-center justify-center text-lg font-bold rounded-full">
                  {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
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
            className="flex-shrink-0 min-w-[64px] cursor-pointer" 
            onClick={() => onStoryClick && onStoryClick(index)}
          >
            <div className={`relative w-16 h-16 rounded-full p-0.5 ${
              story.viewed 
                ? 'bg-gray-500' 
                : 'bg-gradient-to-r from-pink-500 to-purple-600'
            }`}>
              <div className="w-full h-full rounded-full bg-slate-800 p-0.5 overflow-hidden flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img 
                    src={story.userAvatar} 
                    alt={story.userName} 
                    className="w-full h-full object-cover"
                    style={{ 
                      borderRadius: '50%',
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%'
                    }}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.userName)}&background=ec4899&color=ffffff&size=56`;
                    }}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-gray-300 mt-1 w-16 truncate">
              {story.userName}
            </p>
          </div>
        ))}
      </div>

      {/* Modal pour ajouter une story */}
      <Dialog open={showAddStoryModal} onOpenChange={setShowAddStoryModal}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-lg">Ajouter une Story</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col space-y-3 p-4">
            <Button
              onClick={openCamera}
              className="bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center py-3"
            >
              <Camera size={20} className="mr-2" />
              Prendre une photo/vidéo
            </Button>
            
            <Button
              onClick={openGallery}
              variant="outline"
              className="border-gray-600 text-white hover:bg-slate-700 flex items-center justify-center py-3"
            >
              <ImageIcon size={20} className="mr-2" />
              Choisir depuis la galerie
            </Button>
            
            <Button
              onClick={() => setShowAddStoryModal(false)}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Inputs cachés pour les fichiers */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e, false)}
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e, true)}
      />
    </div>
  );
};

export default StoriesSection;
