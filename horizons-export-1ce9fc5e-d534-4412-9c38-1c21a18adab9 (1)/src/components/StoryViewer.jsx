import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const StoryViewer = ({ stories = [], initialIndex = 0, onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const progressRef = useRef(null);
  const containerRef = useRef(null);
  const STORY_DURATION = 5000; // 5 secondes par story
  const SWIPE_THRESHOLD = 100; // Distance minimale pour déclencher un swipe

  const currentStory = stories[currentStoryIndex];
  const totalSegments = currentStory?.segments?.length || 1;

  // Gestion du timer de progression
  useEffect(() => {
    if (isPaused || !currentStory) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (STORY_DURATION / 100));
        
        if (newProgress >= 100) {
          // Passer au segment suivant ou à la story suivante
          if (currentSegmentIndex < totalSegments - 1) {
            setCurrentSegmentIndex(currentSegmentIndex + 1);
            return 0;
          } else {
            goToNextStory();
            return 0;
          }
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStoryIndex, currentSegmentIndex, isPaused, currentStory, totalSegments]);

  // Réinitialiser la progression quand on change de story
  useEffect(() => {
    setProgress(0);
    setCurrentSegmentIndex(0);
  }, [currentStoryIndex]);

  const goToNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      onClose(); // Fermer si c'est la dernière story
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const goToNextSegment = () => {
    if (currentSegmentIndex < totalSegments - 1) {
      setCurrentSegmentIndex(currentSegmentIndex + 1);
      setProgress(0);
    } else {
      goToNextStory();
    }
  };

  const goToPrevSegment = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(currentSegmentIndex - 1);
      setProgress(0);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  // Gestion des événements tactiles
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
    setTouchEnd(null);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isDownSwipe = distance < -SWIPE_THRESHOLD;
    
    if (isDownSwipe) {
      onClose(); // Fermer avec swipe vers le bas
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Gestion des clics
  const handleClick = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const centerX = rect.width / 2;
    
    if (clickX < centerX) {
      goToPrevSegment(); // Clic à gauche
    } else {
      goToNextSegment(); // Clic à droite
    }
  };

  // Gestion du clavier
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevSegment();
          break;
        case 'ArrowRight':
          goToNextSegment();
          break;
        case ' ':
          e.preventDefault();
          setIsPaused(!isPaused);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStoryIndex, currentSegmentIndex, isPaused]);

  if (!currentStory) return null;

  const currentSegment = currentStory.segments?.[currentSegmentIndex] || {
    type: 'image',
    url: currentStory.url,
    duration: STORY_DURATION
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex flex-col"
        ref={containerRef}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Header noir pour éviter l'encoche iPhone - 115px */}
        <div className="bg-black h-25 w-full flex-shrink-0" style={{height: '115px'}} />
        
        {/* Barres de progression en haut */}
        <div className="absolute left-0 right-0 z-10 p-2" style={{top: '30px'}}>
          <div className="flex space-x-1">
            {Array.from({ length: totalSegments }).map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width: index < currentSegmentIndex ? '100%' : 
                           index === currentSegmentIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Header avec info utilisateur et bouton fermer */}
        <div className="absolute left-0 right-0 z-10 flex items-center justify-between px-4" style={{top: '60px'}}>
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8 border-2 border-white">
              <AvatarImage src={currentStory.url} alt={currentStory.userName} />
              <AvatarFallback className="bg-slate-600 text-white text-sm">
                {currentStory.userName?.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-semibold text-sm">{currentStory.userName}</p>
              <p className="text-white/70 text-xs">
                {currentStory.timestamp ? 
                  new Date(currentStory.timestamp).toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : 
                  'Maintenant'
                }
              </p>
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

        {/* Contenu de la story - avec marge pour éviter l'encoche */}
        <div className="flex-1 flex items-center justify-center relative px-2 pb-8">
          {currentSegment.type === 'video' ? (
            <video
              src={currentSegment.url}
              className="max-w-full max-h-full object-contain"
              autoPlay
              muted
              onEnded={goToNextSegment}
              onPause={() => setIsPaused(true)}
              onPlay={() => setIsPaused(false)}
            />
          ) : (
            <img
              src={currentSegment.url}
              alt="Story content"
              className="max-w-full max-h-full object-contain"
              draggable={false}
            />
          )}
        </div>

        {/* Zones invisibles pour navigation - ajustées pour l'encoche de 115px */}
        <div className="absolute flex" style={{top: '140px', left: 0, right: 0, bottom: 0}}>
          <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); goToPrevSegment(); }} />
          <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }} />
          <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); goToNextSegment(); }} />
        </div>

        {/* Indicateurs de navigation (optionnels, visibles au hover) */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <ChevronLeft size={32} className="text-white/70" />
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <ChevronRight size={32} className="text-white/70" />
        </div>

        {/* Indicateur de pause */}
        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 rounded-full p-4">
              <div className="w-6 h-6 flex space-x-1">
                <div className="w-1 h-full bg-white rounded"></div>
                <div className="w-1 h-full bg-white rounded"></div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default StoryViewer;