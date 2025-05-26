import React, { useState } from 'react';
import { motion, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { EyeOff, Undo, Heart, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ActionButton = ({ icon: Icon, onClick, disabled, className, motionStyle, ariaLabel }) => (
        <motion.div style={motionStyle}>
            <Button
                variant="outline"
                size="icon"
                className={className}
                onClick={onClick}
                disabled={disabled}
                aria-label={ariaLabel}
            >
      <Icon size={24} />
            </Button>
        </motion.div>
    );

    const ActionButtons = ({ onRewind, onSwipe, canRewind, isSwiping, historyLength, motionX }) => {
  const [isIncognito, setIsIncognito] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
      const { toast } = useToast();

      const dislikeOpacity = useTransform(motionX, [-80, 0], [1, 0.7]);
      const dislikeScale = useTransform(motionX, [-80, 0], [1.15, 1]);
      const likeOpacity = useTransform(motionX, [0, 80], [0.7, 1]);
      const likeScale = useTransform(motionX, [0, 80], [1, 1.15]);
    
  const handleToggleIncognito = () => {
    if (isIncognito) {
      setShowConfirmation(true);
    } else {
      setIsIncognito(true);
    }
    };

  const confirmDisableIncognito = (confirm) => {
    if (confirm) setIsIncognito(false);
    setShowConfirmation(false);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center py-4 px-6 sm:py-4 sm:px-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10 gap-4 sm:gap-4 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
      <ActionButton
        icon={X}
        onClick={() => onSwipe('left')}
        disabled={isSwiping && motionX.get() > 0}
        className="w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-rose-500/80 to-red-600/80 hover:from-rose-500 hover:to-red-600 border-2 border-rose-400/70 text-white shadow-2xl backdrop-blur-md transition-all duration-150 ease-out hover:shadow-rose-500/40 active:scale-95"
        motionStyle={{ opacity: isSwiping ? dislikeOpacity : 1, scale: isSwiping ? dislikeScale : 1 }}
        ariaLabel="Dislike profile"
      />
      <ActionButton
        icon={Undo}
        onClick={onRewind}
        disabled={!canRewind || historyLength === 0 || isSwiping}
        className="w-12 h-12 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 border-yellow-500/80 text-yellow-500 hover:text-yellow-400 shadow-xl backdrop-blur-sm"
        ariaLabel="Rewind last swipe"
      />
      <motion.div>
        <Button
          onClick={handleToggleIncognito}
          className={`${isIncognito ? 'bg-blue-500' : 'bg-gray-600'} hover:${isIncognito ? 'bg-blue-600' : 'bg-gray-700'} text-white p-3 sm:p-4 md:p-5 rounded-full shadow-lg w-12 h-12 sm:w-12 sm:h-12 md:w-14 md:h-14`}
        >
          <EyeOff size={20} />
        </Button>
        {showConfirmation && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-16 left-0 right-0 mx-auto bg-white p-3 rounded shadow-md"
            >
              <p className="text-black mb-2">Êtes-vous sûr(e) de vouloir désactiver le mode incognito ?</p>
              <div className="flex justify-around">
                <Button onClick={() => confirmDisableIncognito(true)} className="bg-red-500 hover:bg-red-600 text-white p-2 w-1/3 rounded">Oui</Button>
                <Button onClick={() => confirmDisableIncognito(false)} className="bg-gray-300 hover:bg-gray-400 p-2 w-1/3 rounded">Non</Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
      <ActionButton
        icon={Heart}
        onClick={() => onSwipe('right')}
        disabled={isSwiping && motionX.get() < 0}
        className="w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-500/80 to-green-600/80 hover:from-emerald-500 hover:to-green-600 border-2 border-emerald-400/70 text-white shadow-2xl backdrop-blur-md transition-all duration-150 ease-out hover:shadow-emerald-500/40 active:scale-95"
        motionStyle={{ opacity: isSwiping ? likeOpacity : 1, scale: isSwiping ? likeScale : 1 }}
        ariaLabel="Like profile"
      />
    </div>
  );
};

    export default ActionButtons;