import React, { useState } from 'react';
import { motion, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { EyeOff, Undo, Heart, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

const ActionButton = ({ icon: Icon, onClick, disabled, className, motionStyle, ariaLabel, iconSize = 20, strokeWidth = 2 }) => (
  <motion.div style={motionStyle}>
    <Button
      variant="outline"
      size="icon"
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <Icon size={iconSize} strokeWidth={strokeWidth} />
    </Button>
  </motion.div>
);

const ActionButtons = ({ onRewind, onSwipe, canRewind, isSwiping, historyLength, motionX, currentUser }) => {
  const [isIncognito, setIsIncognito] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const dislikeOpacity = useTransform(motionX, [-80, 0], [1, 0.7]);
  const dislikeScale = useTransform(motionX, [-80, 0], [1.15, 1]);
  const dislikeRotate = useTransform(motionX, [-80, 0], [-15, 0]);
  const likeOpacity = useTransform(motionX, [0, 80], [0.7, 1]);
  const likeScale = useTransform(motionX, [0, 80], [1, 1.15]);
  const likeRotate = useTransform(motionX, [0, 80], [0, 15]);

  const handleRewind = () => {
    if (!currentUser?.premiumStatus?.subscriptionType) {
      setShowPremiumDialog(true);
      return;
    }
    if (historyLength === 0) {
      toast({ 
        title: "Aucune action à annuler", 
        description: "Il n'y a pas d'action récente à annuler.", 
        variant: "destructive"
      });
      return;
    }
    onRewind();
  };

  const handleLike = () => {
  if (isSwiping) return; // Prevent double-clicks during swipe
  // Déclencher l'animation de swipe vers la droite avec délai
  setTimeout(() => {
    onSwipe('right');
  }, 50);
};

const handleDislike = () => {
  if (isSwiping) return; // Prevent double-clicks during swipe
  // Déclencher l'animation de swipe vers la gauche avec délai
  setTimeout(() => {
    onSwipe('left');
  }, 50);
};

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
    <>
      <div className="flex justify-center items-center py-0 px-7">
        <div className="flex justify-between items-center gap-4 w-full max-w-sm">
          <ActionButton
            icon={X}
            onClick={handleDislike}
            disabled={isSwiping && motionX.get() > 0}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 border-2 border-red-300/80 text-white shadow-2xl backdrop-blur-md transition-all duration-150 ease-out hover:shadow-red-400/60 active:scale-95 hover:scale-105"
            motionStyle={{ 
              opacity: isSwiping ? dislikeOpacity : 1, 
              scale: isSwiping ? dislikeScale : 1,
              rotateZ: isSwiping ? dislikeRotate : 0
            }}
            ariaLabel="Dislike profile"
            iconSize={26}
            strokeWidth={4}
          />
          <ActionButton
            icon={Undo}
            onClick={handleRewind}
            disabled={isSwiping}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500/90 to-amber-600/90 hover:from-yellow-400 hover:to-amber-500 border-2 border-yellow-300/70 text-white shadow-xl backdrop-blur-sm transition-all duration-150 ease-out hover:shadow-yellow-400/50 active:scale-95 hover:scale-105"
            ariaLabel="Rewind last swipe"
          />
          <motion.div>
            <Button
              onClick={handleToggleIncognito}
              className={`${
                isIncognito 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 border-2 border-blue-300/80 shadow-blue-400/50' 
                  : 'bg-gradient-to-br from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 border-2 border-gray-400/70 shadow-gray-400/40'
              } text-white p-2 rounded-full shadow-xl w-14 h-14 transition-all duration-150 ease-out hover:scale-105 active:scale-95`}
            >
              <EyeOff size={22} />
            </Button>
          </motion.div>
          <ActionButton
            icon={Heart}
            onClick={handleLike}
            disabled={isSwiping && motionX.get() < 0}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 hover:from-green-300 hover:to-emerald-500 border-2 border-green-200/80 text-white shadow-2xl backdrop-blur-md transition-all duration-150 ease-out hover:shadow-green-400/60 active:scale-95 hover:scale-105 [&>svg]:fill-white [&>svg]:stroke-none"
            motionStyle={{ 
              opacity: isSwiping ? likeOpacity : 1, 
              scale: isSwiping ? likeScale : 1,
              rotateZ: isSwiping ? likeRotate : 0
            }}
            ariaLabel="Like profile"
            iconSize={26}
          />
        </div>
      </div>

      {/* Dialog Premium */}
      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">Premium Requis</DialogTitle>
            <DialogDescription className="text-center text-gray-300 text-sm">
              La fonction "Retour" est réservée aux utilisateurs Premium.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-3">
            <Button 
              variant="outline" 
              onClick={() => setShowPremiumDialog(false)}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 text-sm py-2"
            >
              Annuler
            </Button>
            <Button 
              onClick={() => {
                setShowPremiumDialog(false);
                navigate('/premium');
              }}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-none text-sm py-2"
            >
              Souscrire
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation Incognito */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">Désactiver Incognito</DialogTitle>
            <DialogDescription className="text-center text-gray-300 text-sm">
              Êtes-vous sûr(e) de vouloir désactiver le mode incognito ? Tout les utilisateurs pourront voir votre profil
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-3">
            <Button 
              onClick={() => confirmDisableIncognito(false)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm py-2"
            >
              Annuler
            </Button>
            <Button 
              onClick={() => confirmDisableIncognito(true)} 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2"
            >
              Oui
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActionButtons;