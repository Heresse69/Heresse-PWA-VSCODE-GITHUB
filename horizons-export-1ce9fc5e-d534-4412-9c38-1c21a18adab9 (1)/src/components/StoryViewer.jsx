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

  const currentStory = stories[currentStoryIndex];
  const totalSegments = currentStory?.segments?.length || 1;
  
  const currentSegment = currentStory?.segments?.[currentSegmentIndex] || {
    type: 'image',
    url: currentStory?.url,
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

  if (!currentStory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex flex-col"
        onClick={handleClick}
      >
        {/* Espace pour l'encoche */}
        <div className="h-[100px] bg-black" />
        
        {/* Barres de progression */}
        <div className="absolute top-8 left-4 right-4 z-10">
          <div className="flex space-x-1">
            {Array.from({ length: totalSegments }).map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/30 rounded-full">
                <div
                  className="h-full bg-white rounded-full"
                  style={{
                    width: index < currentSegmentIndex ? '100%' : 
                           index === currentSegmentIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-12 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8 border-2 border-white">
              <AvatarImage src={currentStory.url} alt={currentStory.userName} />
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

        {/* Contenu */}
        <div className="flex-1 flex items-center justify-center p-4">
          <img
            src={currentSegment.url}
            alt={`Story de ${currentStory.userName}`}
            className="max-w-full max-h-full object-contain"
            draggable={false}
            onError={(e) => {
              console.error('Erreur de chargement image story:', currentSegment.url);
              // Image de fallback si l'image ne charge pas
              e.target.src = `https://picsum.photos/400/600?random=${currentStory.userId + currentSegmentIndex}`;
            }}
          />
        </div>

        {/* Zones de clic */}
        <div className="absolute top-20 left-0 right-0 bottom-0 flex">
          <div className="w-1/2" onClick={(e) => { e.stopPropagation(); goToPrev(); }} />
          <div className="w-1/2" onClick={(e) => { e.stopPropagation(); goToNext(); }} />
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
      </motion.div>
    </AnimatePresence>
  );
};

export default StoryViewer;