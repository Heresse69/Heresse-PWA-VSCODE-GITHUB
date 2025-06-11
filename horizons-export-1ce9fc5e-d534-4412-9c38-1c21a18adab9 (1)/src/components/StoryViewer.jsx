import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const StoryViewer = ({ stories = [], initialIndex = 0, onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const storyContainerRef = useRef(null);

  const currentStory = stories[currentStoryIndex];
  const totalSegments = currentStory?.segments?.length || 1;
  
  const currentSegment = currentStory?.segments?.[currentSegmentIndex] || {
    type: 'image',
    url: currentStory?.imageUrl || currentStory?.userAvatar,
  };

  // Gestionnaire pour les gestes tactiles
  const handleTouchStart = useRef({ x: 0, y: 0 });
  const handleTouchEnd = useRef({ x: 0, y: 0 });

  const onTouchStart = (e) => {
    handleTouchStart.current.x = e.touches[0].clientX;
    handleTouchStart.current.y = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    handleTouchEnd.current.x = e.changedTouches[0].clientX;
    handleTouchEnd.current.y = e.changedTouches[0].clientY;
    
    const deltaX = handleTouchEnd.current.x - handleTouchStart.current.x;
    const deltaY = handleTouchEnd.current.y - handleTouchStart.current.y;
    
    // Swipe vers le bas pour fermer
    if (deltaY > 100 && Math.abs(deltaX) < 50) {
      onClose();
      return;
    }
    
    // Tap gauche/droite pour navigation
    if (Math.abs(deltaY) < 50 && Math.abs(deltaX) < 30) {
      const rect = storyContainerRef.current?.getBoundingClientRect();
      if (rect) {
        const tapX = handleTouchEnd.current.x - rect.left;
        const centerX = rect.width / 2;
        
        if (tapX < centerX) {
          goToPrev();
        } else {
          goToNext();
        }
      }
    }
  };

  // Timer simple qui fonctionne
  useEffect(() => {
    if (isPaused || !currentStory) return;

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2.5; // 2.5% toutes les 100ms = 100% en 4 secondes
        
        if (newProgress >= 100) {
          // Passer au segment/story suivant
          setTimeout(() => {
            if (currentSegmentIndex < totalSegments - 1) {
              setCurrentSegmentIndex(currentSegmentIndex + 1);
              setProgress(0);
            } else if (currentStoryIndex < stories.length - 1) {
              setCurrentStoryIndex(currentStoryIndex + 1);
              setCurrentSegmentIndex(0);
              setProgress(0);
            } else {
              onClose();
            }
          }, 100);
          return 100;
        }
        
        return newProgress;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentStoryIndex, currentSegmentIndex, isPaused, currentStory, totalSegments, stories.length, onClose]);

  // Reset progress when changing story/segment
  useEffect(() => {
    setProgress(0);
  }, [currentStoryIndex, currentSegmentIndex]);

  const goToNext = () => {
    if (currentSegmentIndex < totalSegments - 1) {
      setCurrentSegmentIndex(currentSegmentIndex + 1);
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setCurrentSegmentIndex(0);
    } else {
      onClose();
    }
  };

  const goToPrev = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(currentSegmentIndex - 1);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      const prevStory = stories[currentStoryIndex - 1];
      setCurrentSegmentIndex((prevStory?.segments?.length || 1) - 1);
    }
  };

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const centerX = rect.width / 2;
    
    if (clickX < centerX) {
      goToPrev();
    } else {
      goToNext();
    }
  };

  // Empêcher le scroll en arrière-plan
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('story-viewer-open');
    
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('story-viewer-open');
    };
  }, []);

  if (!currentStory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-[9999] flex flex-col"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        }}
        ref={storyContainerRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={handleClick}
      >
        {/* Header noir pour masquer l'encoche */}
        <div 
          className="bg-black w-full flex-shrink-0"
          style={{
            height: 'env(safe-area-inset-top)',
            minHeight: '44px'
          }}
        />
        
        {/* Barres de progression */}
        <div 
          className="absolute left-4 right-4 z-[10002] flex gap-1"
          style={{
            top: 'calc(env(safe-area-inset-top) + 0.5rem)',
            marginTop: '44px'
          }}
        >
          {Array.from({ length: totalSegments }).map((_, index) => (
            <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full">
              <div
                className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                style={{
                  width: index < currentSegmentIndex ? '100%' : 
                         index === currentSegmentIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Header avec info utilisateur */}
        <div 
          className="absolute left-4 right-4 z-[10002] flex items-center justify-between text-white"
          style={{
            top: 'calc(env(safe-area-inset-top) + 2.5rem)',
            marginTop: '44px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8 border-2 border-white">
              <AvatarImage src={currentStory.userAvatar} alt={currentStory.userName} />
              <AvatarFallback className="bg-slate-600 text-white text-sm">
                {currentStory.userName?.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-semibold text-sm">{currentStory.userName}</p>
              <p className="text-white/70 text-xs">Maintenant</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Contenu principal - image/vidéo */}
        <div className="flex-1 flex items-center justify-center px-4 relative">
          <img
            src={currentSegment.url}
            alt={`Story de ${currentStory.userName}`}
            className="max-w-full max-h-full object-contain rounded-lg"
            draggable={false}
            onError={(e) => {
              console.error('Erreur de chargement image story:', currentSegment.url);
              e.target.src = `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face`;
            }}
          />
        </div>

        {/* Zones de navigation invisibles */}
        <div className="absolute inset-0 flex" style={{ marginTop: '120px' }}>
          <div 
            className="w-1/2 h-full flex items-center justify-start pl-4"
            onClick={(e) => { 
              e.stopPropagation(); 
              goToPrev(); 
            }}
          >
            <ChevronLeft 
              size={32} 
              className="text-white/50 hover:text-white/80 transition-colors pointer-events-none" 
            />
          </div>
          <div 
            className="w-1/2 h-full flex items-center justify-end pr-4"
            onClick={(e) => { 
              e.stopPropagation(); 
              goToNext(); 
            }}
          >
            <ChevronRight 
              size={32} 
              className="text-white/50 hover:text-white/80 transition-colors pointer-events-none" 
            />
          </div>
        </div>

        {/* Indicateur de pause */}
        {isPaused && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2">
            <div className="bg-black/50 rounded-full px-3 py-1 flex items-center space-x-1">
              <div className="w-1 h-3 bg-white rounded"></div>
              <div className="w-1 h-3 bg-white rounded"></div>
            </div>
          </div>
        )}

        {/* Footer pour safe area */}
        <div 
          className="bg-black w-full flex-shrink-0"
          style={{
            height: 'env(safe-area-inset-bottom)',
            minHeight: '34px'
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default StoryViewer;