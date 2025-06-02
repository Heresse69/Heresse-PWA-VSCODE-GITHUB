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
      <Icon size={20} />
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
      <div className="flex justify-center items-center py-3 px-4">
        <div className="flex justify-between items-center gap-4 w-full max-w-sm">
          <ActionButton
            icon={X}
            onClick={handleDislike}
            disabled={isSwiping && motionX.get() > 0}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500/80 to-red-600/80 hover:from-rose-500 hover:to-red-600 border-2 border-rose-400/70 text-white shadow-2xl backdrop-blur-md transition-all duration-150 ease-out hover:shadow-rose-500/40 active:scale-95"
            motionStyle={{ 
              opacity: isSwiping ? dislikeOpacity : 1, 
              scale: isSwiping ? dislikeScale : 1,
              rotateZ: isSwiping ? dislikeRotate : 0
            }}
            ariaLabel="Dislike profile"
          />
          <ActionButton
            icon={Undo}
            onClick={handleRewind}
            disabled={isSwiping}
            className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border-yellow-500/80 text-yellow-500 hover:text-yellow-400 shadow-xl backdrop-blur-sm"
            ariaLabel="Rewind last swipe"
          />
          <motion.div>
            <Button
              onClick={handleToggleIncognito}
              className={`${isIncognito ? 'bg-blue-500' : 'bg-gray-600'} hover:${isIncognito ? 'bg-blue-600' : 'bg-gray-700'} text-white p-2 rounded-full shadow-lg w-14 h-14`}
            >
              <EyeOff size={18} />
            </Button>
          </motion.div>
          <ActionButton
            icon={Heart}
            onClick={handleLike}
            disabled={isSwiping && motionX.get() < 0}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/80 to-green-600/80 hover:from-emerald-500 hover:to-green-600 border-2 border-emerald-400/70 text-white shadow-2xl backdrop-blur-md transition-all duration-150 ease-out hover:shadow-emerald-500/40 active:scale-95"
            motionStyle={{ 
              opacity: isSwiping ? likeOpacity : 1, 
              scale: isSwiping ? likeScale : 1,
              rotateZ: isSwiping ? likeRotate : 0
            }}
            ariaLabel="Like profile"
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