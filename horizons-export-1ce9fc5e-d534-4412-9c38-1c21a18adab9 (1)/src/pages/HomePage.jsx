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
import HomePageHeader from '@/components/features/swipe/HomePageHeader';
import { initialMockProfilesData } from '@/data/mockProfiles';

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
          setMatchedProfileData(swipedProfile);
          setShowMatchAnimation(true);
        } else if (direction === 'left') {
           toast({ title: "Non merci !", description: `Profil de ${swipedProfile.name} passé.`, duration: 2000, className: "bg-gradient-to-r from-rose-600 to-red-700 border-red-700 text-white shadow-lg" });
        } else if (direction === 'superlike') {
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
        let targetX = 0;
        let targetY = 0;
        let finalRotate = 0;
        let swipeDirection = direction;

        if (direction === 'left') { targetX = "-150%"; finalRotate = -25; }
        else if (direction === 'right') { targetX = "150%"; finalRotate = 25; }
        else if (direction === 'superlike') { targetY = "-150%"; finalRotate = 0; } 
        else if (direction === 'info') {
          navigate(`/profile/${profiles[currentIndex].id}`);
          return;
        }
        
        setIsSwiping(true); 
        if (direction === 'superlike') {
          topCardControls.start({ y: targetY, opacity: 0, scale: 1.1, transition: { duration: 0.4, ease: "circOut" } })
            .then(() => { 
              if(isMounted.current) {
                removeTopCard(swipeDirection);
                setIsSwiping(false);
              }
            });
        } else {
            topCardControls.start({ x: targetX, opacity: 0, rotate: finalRotate, transition: { duration: 0.4, ease: "easeOut" } })
            .then(() => { 
              if(isMounted.current) {
                removeTopCard(swipeDirection);
                setIsSwiping(false);
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
        
        // Animation inverse avant de restaurer le profil
        const reverseDirection = direction === 'right' ? 'left' : 'right';
        const targetX = reverseDirection === 'right' ? "150%" : "-150%";
        const finalRotate = reverseDirection === 'right' ? 25 : -25;
        
        // Démarrer l'animation inverse
        topCardControls.set({ 
          x: targetX, 
          y: 0, 
          opacity: 0, 
          rotate: finalRotate, 
          scale: 0.9 
        });
        
        // Puis animer vers la position normale
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
          <HomePageHeader 
            onOpenFilters={() => navigate('/settings')}
          />

          {/* Zone principale centrée pour la carte avec espace pour les boutons */}
          <div className="flex-1 flex flex-col justify-center px-2 pt-2 min-h-0">
            <div className="w-full max-w-md aspect-[3/4] relative mx-auto flex-shrink-0">
              <AnimatePresence>
                {currentProfile && (
                    <CardWrapper
                      key={currentProfile.id}
                      controls={topCardControls}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    onDrag={(e, info) => { motionX.set(info.offset.x); motionY.set(info.offset.y); }}
                    isTopCard={true}
                    style={{ 
                      zIndex: 10,
                      x: motionX,
                      y: motionY,
                      rotate: rotate,
                      scale: scale,
                    }}
                    className="w-full h-full rounded-xl"
                  >
                    <ProfileCardComponent profile={currentProfile} isTopCard={true} onSwipe={triggerSwipe} isSwiping={isSwiping}/>
                  </CardWrapper>
                )}
              </AnimatePresence>
            </div>
            
            {/* Boutons d'action ENTRE la carte et la navigation */}
            {currentProfile && (
              <div className="px-4 py-4 flex-shrink-0">
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
                  navigate(`/chat/${matchedProfileData.id}`);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      );
    };

    export default HomePage;