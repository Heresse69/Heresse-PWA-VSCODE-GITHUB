import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';
import CardWrapper from '@/components/features/swipe/CardWrapper';
import ProfileCardComponent from '@/components/features/swipe/ProfileCardComponent';
import MatchAnimationOverlay from '@/components/features/swipe/MatchAnimationOverlay';
import ActionButtons from '@/components/features/swipe/ActionButtons';
import { initialMockProfilesData } from '@/data/mockProfiles';
import { addMatch, createMatchConversation } from '@/data/mockChatData';
import { usePWA } from '@/hooks/usePWA';

const HomePage = () => {
  const [profiles, setProfiles] = useState([...initialMockProfilesData]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const topCardControls = useAnimation();
  const { currentUser, updatePremiumStatus } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const [isSwiping, setIsSwiping] = useState(false);
  const { isPWA } = usePWA(); // Détecter le mode PWA

  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [matchedProfileData, setMatchedProfileData] = useState(null);
  
  const motionX = useMotionValue(0);
  const motionY = useMotionValue(0);

  const rotate = useTransform(motionX, [-200, 0, 200], [-25, 0, 25]);
  const scale = useTransform(
    [motionX, motionY],
    ([latestX, latestY]) => {
      const distance = Math.sqrt(latestX ** 2 + latestY ** 2);
      return Math.max(1 - distance / 1000, 0.9);
    }
  );

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);
  

  const handleDragStart = () => {
    if (!isMounted.current) return;
    setIsSwiping(true);
  };
  
  const removeTopCard = useCallback((direction) => {
    if (!isMounted.current || currentIndex >= profiles.length) return;
    
    const swipedProfile = profiles[currentIndex];
    setHistory(prev => [...prev, { profile: swipedProfile, direction }]);

    if (direction === 'right') {
      const matchUser = {
        id: swipedProfile.id,
        name: swipedProfile.name,
        avatar: swipedProfile.photos[0],
        age: swipedProfile.age,
        distance: swipedProfile.distance
      };
      
      const newMatch = addMatch(matchUser);
      const newConversation = createMatchConversation(matchUser);
      
      setMatchedProfileData(swipedProfile);
      setShowMatchAnimation(true);
    } else if (direction === 'left') {
       toast({ title: "Non merci !", description: `Profil de ${swipedProfile.name} passé.`, duration: 2000, className: "bg-gradient-to-r from-rose-600 to-red-700 border-red-700 text-white shadow-lg" });
    } else if (direction === 'superlike') {
        const matchUser = {
          id: swipedProfile.id,
          name: swipedProfile.name,
          avatar: swipedProfile.photos[0],
          age: swipedProfile.age,
          distance: swipedProfile.distance
        };
        
        const newMatch = addMatch(matchUser);
        const newConversation = createMatchConversation(matchUser);
        
        toast({ title: "Superlike !", description: `Vous avez envoyé un Superlike à ${swipedProfile.name} !`, duration: 2000, className: "bg-gradient-to-r from-blue-500 to-sky-600 border-blue-600 text-white shadow-lg" });
    }

    setCurrentIndex(prev => prev + 1);
    
    if (isMounted.current) {
      topCardControls.set({ x: 0, y:0, opacity: 1, rotate: 0, scale: 1 });
      motionX.set(0);
      motionY.set(0);
    }
  }, [currentIndex, profiles, topCardControls, toast, isMounted, setShowMatchAnimation, setMatchedProfileData, setHistory, motionX, motionY]);

  const handleDragEnd = useCallback((event, info) => {
    if (!isMounted.current) return;
    setIsSwiping(false);
    const swipeThresholdX = 80; 
    const swipeThresholdY = 60; 
    const velocityThreshold = 0.3;

    const offsetX = info.offset.x;
    const offsetY = info.offset.y;
    const velocityX = info.velocity.x;

    if (Math.abs(offsetX) > swipeThresholdX && Math.abs(offsetY) < swipeThresholdY && Math.abs(velocityX) > velocityThreshold) {
      const direction = offsetX > 0 ? 'right' : 'left';
      const targetX = direction === 'right' ? "150%" : "-150%";
      const finalRotate = direction === 'right' ? 25 : -25;
      topCardControls.start({ x: targetX, y: offsetY, opacity: 0, rotate: finalRotate, transition: { duration: 0.3, ease: "easeOut" } }).then(() => { if(isMounted.current) removeTopCard(direction); });
    } else {
      topCardControls.start({ x: 0, y: 0, rotate: 0, scale: 1, transition: { type: "spring", stiffness: 500, damping: 30 } });
      motionX.set(0);
      motionY.set(0);
    }
  }, [topCardControls, removeTopCard, isMounted, motionX, motionY]); 

const triggerSwipe = useCallback((direction) => {
  if (!isMounted.current || profiles.length === 0 || currentIndex >= profiles.length) return;
  
  if (direction === 'info') {
    navigate(`/profile/${profiles[currentIndex].id}`);
    return;
  }
  
  setIsSwiping(true);
  
  // Animation en 2 étapes pour un effet plus fluide
  if (direction === 'left' || direction === 'right') {
    const finalX = direction === 'right' ? "120%" : "-120%";
    const finalRotate = direction === 'right' ? 20 : -20;
    
    // Étape 1: Légère inclinaison et petit mouvement (0.08s)
    topCardControls.start({
      x: direction === 'right' ? 30 : -30,
      rotate: direction === 'right' ? 8 : -8,
      transition: { 
        duration: 0.16, 
        ease: "easeOut" 
      }
    }).then(() => {
      // Étape 2: Glissement complet (0.12s)
      if (isMounted.current) {
        topCardControls.start({
          x: finalX,
          y: 20, // Légère descente pour plus de réalisme
          rotate: finalRotate,
          opacity: 0,
          scale: 0.95,
          transition: { 
            duration: 0.24, 
            ease: "easeIn" 
          }
        }).then(() => {
          if (isMounted.current) {
            removeTopCard(direction);
            setIsSwiping(false);
          }
        });
      }
    });
  } 
  else if (direction === 'superlike') {
    // Animation vers le haut pour superlike
    topCardControls.start({
      y: -10,
      scale: 1.05,
      transition: { duration: 0.25, ease: "easeOut" }
    }).then(() => {
      if (isMounted.current) {
        topCardControls.start({
          y: "-120%",
          opacity: 0,
          scale: 1.2,
          transition: { duration: 0.34, ease: "easeIn" }
        }).then(() => {
          if (isMounted.current) {
            removeTopCard('superlike');
            setIsSwiping(false);
          }
        });
      }
    });
  }
}, [topCardControls, currentIndex, profiles, removeTopCard, navigate, isMounted]);

  const handleRewind = () => {
    if (!currentUser || !currentUser.premiumStatus.canRewind || history.length === 0) {
        toast({ title: "Fonction Premium", description: "Passez à Premium pour utiliser Retour.", variant: "destructive"});
        return;
    }
    const lastAction = history[history.length - 1];
    const direction = lastAction.direction;
    
    const reverseDirection = direction === 'right' ? 'left' : 'right';
    const targetX = reverseDirection === 'right' ? "150%" : "-150%";
    const finalRotate = reverseDirection === 'right' ? 25 : -25;
    
    topCardControls.set({ 
      x: targetX, 
      y: 0, 
      opacity: 0, 
      rotate: finalRotate, 
      scale: 0.9 
    });
    
    topCardControls.start({ 
      x: 0, 
      y: 0, 
      opacity: 1, 
      rotate: 0, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      } 
    });
    
    setCurrentIndex(prev => prev -1);
    setHistory(prev => prev.slice(0, -1));
    
    if (isMounted.current) {
        motionX.set(0);
        motionY.set(0);
        toast({ title: "Retour", description: `Le profil de ${lastAction.profile.name} a été restauré.` });
    }
  };

  const toggleIncognitoMode = () => {
    if (currentUser && !currentUser.premiumStatus.subscriptionType && !currentUser.premiumStatus.incognitoMode) {
      navigate('/premium');
      return;
    }
    if (currentUser) {
      const newIncognitoState = !currentUser.premiumStatus.incognitoMode;
      updatePremiumStatus('incognitoMode', newIncognitoState);
       toast({
        title: `Mode Incognito ${newIncognitoState ? 'Activé' : 'Désactivé'}`,
        description: `Votre visibilité a été mise à jour.`,
      });
    }
  };
  
  const handleBoost = () => {
  };

  const currentProfile = profiles[currentIndex];

  if (!currentUser) return null; 

  if (!currentProfile && !showMatchAnimation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-gradient-to-br from-slate-800 to-slate-900 text-white overflow-hidden">
        <ImageIcon size={64} className="text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Plus de profils pour le moment !</h2>
        <p className="text-gray-400 mb-6">Revenez plus tard ou ajustez vos filtres.</p>
        <Button onClick={() => {setProfiles([...initialMockProfilesData]); setCurrentIndex(0); setHistory([]);}} className="bg-primary hover:bg-primary-hover">Recharger les profils</Button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen flex flex-col bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
      {/* Zone principale - carte collée au header global */}
      <div className="flex-1 flex flex-col">
        <div className={`w-full max-w-md ${isPWA ? 'aspect-[3/4.5]' : 'aspect-[3/4]'} relative mx-auto px-2`}>
          <AnimatePresence>
            {/* Afficher jusqu'à 3 cartes en superposition */}
            {profiles.slice(currentIndex, currentIndex + 30).map((profile, index) => {
              if (!profile) return null;
              
              const isTopCard = index === 0;
              const zIndex = 10 - index;
              const scale = 1 - (index * 0.02);
              const yOffset = index * 4;
              
              return (
                <CardWrapper
                  key={profile.id}
                  controls={isTopCard ? topCardControls : undefined}
                  onDragStart={isTopCard ? handleDragStart : undefined}
                  onDragEnd={isTopCard ? handleDragEnd : undefined}
                  onDrag={isTopCard ? (e, info) => { motionX.set(info.offset.x); motionY.set(info.offset.y); } : undefined}
                  isTopCard={isTopCard}
                  style={isTopCard ? { 
                    zIndex,
                    x: motionX,
                    y: motionY,
                    rotate: rotate,
                    scale: scale,
                  } : {
                    zIndex,
                    scale,
                    y: yOffset,
                  }}
                  className={`absolute inset-0 w-full h-full rounded-xl ${!isTopCard ? 'pointer-events-none' : ''}`}
                >
                  <ProfileCardComponent 
                    profile={profile} 
                    isTopCard={isTopCard} 
                    onSwipe={isTopCard ? triggerSwipe : undefined} 
                    isSwiping={isTopCard ? isSwiping : false}
                    isPWA={isPWA} // Passer l'info PWA au composant
                  />
                </CardWrapper>
              );
            })}
          </AnimatePresence>
        </div>
        
        {/* Boutons d'action remontés pour chevaucher légèrement la carte */}
        {currentProfile && (
          <div className="w-full max-w-[240px] mx-auto px-1 -mt-4 relative z-20">
            <ActionButtons
                onRewind={handleRewind}
                onSwipe={triggerSwipe}
                onBoost={handleBoost}
                canRewind={currentUser.premiumStatus.canRewind}
                canBoost={currentUser.premiumStatus.canBoost}
                isSwiping={isSwiping}
                historyLength={history.length}
                motionX={motionX}
                currentUser={currentUser}
                isPWA={isPWA} // Passer l'info PWA
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showMatchAnimation && matchedProfileData && currentUser && (
          <MatchAnimationOverlay 
            currentUserData={currentUser}
            matchedUserData={matchedProfileData}
            onClose={() => setShowMatchAnimation(false)}
            onSendMessage={() => {
              setShowMatchAnimation(false);
              const conversation = createMatchConversation({
                id: matchedProfileData.id,
                name: matchedProfileData.name,
                avatar: matchedProfileData.photos[0],
                age: matchedProfileData.age,
                distance: matchedProfileData.distance
              });
              navigate(`/chat/${conversation.id}`);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;