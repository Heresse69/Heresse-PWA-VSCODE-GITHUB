/**
 * Version mise à jour de HomePage avec intégration Supabase
 * Exemple d'adaptation pour utiliser les vrais services backend
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';
import { useSwipes } from '../hooks/useSwipes.js';
import { useMatches } from '../hooks/useMatches.js';

// Composants existants
import CardWrapper from '@/components/features/swipe/CardWrapper';
import ProfileCardComponent from '@/components/features/swipe/ProfileCardComponent';
import MatchAnimationOverlay from '@/components/features/swipe/MatchAnimationOverlay';
import ActionButtons from '@/components/features/swipe/ActionButtons';
import { usePWA } from '@/hooks/usePWA';

const HomePageWithSupabase = () => {
  // États existants
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const topCardControls = useAnimation();
  const { currentUser, updatePremiumStatus } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const [isSwiping, setIsSwiping] = useState(false);
  const { isPWA } = usePWA();

  // États pour les matches
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

  // Hooks Supabase
  const { 
    profiles, 
    loading: swipesLoading, 
    error: swipesError, 
    stats, 
    actions: swipeActions 
  } = useSwipes();

  const { 
    actions: matchActions,
    newMatches
  } = useMatches();

  // Profil actuel
  const currentProfile = profiles[currentIndex];

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Fonction pour retirer la carte du dessus (adaptée pour Supabase)
  const removeTopCard = useCallback(async (direction) => {
    if (!isMounted.current || currentIndex >= profiles.length) return;
    
    const swipedProfile = profiles[currentIndex];
    setHistory(prev => [...prev, { profile: swipedProfile, direction }]);

    // Logique de swipe avec Supabase
    if (direction === 'right') {
      const likeResult = await swipeActions.like(swipedProfile.id);
      
      if (likeResult.success) {
        if (likeResult.isMatch) {
          // C'est un match !
          setMatchedProfileData(swipedProfile);
          setShowMatchAnimation(true);
          
          // Ajouter le nouveau match au contexte
          matchActions.addNewMatch({
            id: likeResult.match.id,
            partnerId: swipedProfile.id,
            partnerName: swipedProfile.full_name,
            partnerPhoto: swipedProfile.photos?.[0]?.url || swipedProfile.profile_picture_url,
            createdAt: new Date().toISOString()
          });
          
          toast({ 
            title: "C'est un match ! 🎉", 
            description: `Vous et ${swipedProfile.full_name} vous êtes mutuellement likés !`, 
            duration: 4000, 
            className: "bg-gradient-to-r from-pink-500 to-red-600 border-pink-600 text-white shadow-lg" 
          });
        } else {
          toast({ 
            title: "Like envoyé !", 
            description: `Vous avez liké ${swipedProfile.full_name}`, 
            duration: 2000, 
            className: "bg-gradient-to-r from-green-500 to-emerald-600 border-green-600 text-white shadow-lg" 
          });
        }
      } else {
        // Erreur lors du like
        toast({ 
          title: "Erreur", 
          description: likeResult.error || "Impossible d'envoyer le like", 
          variant: "destructive" 
        });
      }
    } else if (direction === 'left') {
      const dislikeResult = await swipeActions.dislike(swipedProfile.id);
      
      if (dislikeResult.success) {
        toast({ 
          title: "Non merci !", 
          description: `Profil de ${swipedProfile.full_name} passé.`, 
          duration: 2000, 
          className: "bg-gradient-to-r from-rose-600 to-red-700 border-red-700 text-white shadow-lg" 
        });
      } else {
        toast({ 
          title: "Erreur", 
          description: dislikeResult.error || "Impossible d'enregistrer le dislike", 
          variant: "destructive" 
        });
      }
    } else if (direction === 'superlike') {
      // Pour un superlike, on peut toujours utiliser le système de like standard
      // mais avec une logique différée ou des métadonnées spéciales
      const superlikeResult = await swipeActions.like(swipedProfile.id);
      
      if (superlikeResult.success) {
        toast({ 
          title: "Superlike !", 
          description: `Vous avez envoyé un Superlike à ${swipedProfile.full_name} !`, 
          duration: 2000, 
          className: "bg-gradient-to-r from-blue-500 to-sky-600 border-blue-600 text-white shadow-lg" 
        });
      }
    }

    setCurrentIndex(prev => prev + 1);
    
    // Auto-refill des profils si nécessaire
    if (profiles.length - currentIndex <= 3) {
      swipeActions.refillProfiles();
    }
    
    if (isMounted.current) {
      topCardControls.set({ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 });
      motionX.set(0);
      motionY.set(0);
    }
  }, [currentIndex, profiles, topCardControls, toast, isMounted, motionX, motionY, swipeActions, matchActions]);

  // Gestion du drag
  const handleDragStart = () => {
    if (!isMounted.current) return;
    setIsSwiping(true);
  };

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
      const offsetY = Math.random() * 40 - 20;
      const finalRotate = direction === 'right' ? 25 : -25;
      
      topCardControls.start({ 
        x: targetX, 
        y: offsetY, 
        opacity: 0, 
        rotate: finalRotate, 
        transition: { duration: 0.3, ease: "easeOut" } 
      }).then(() => { 
        if(isMounted.current) removeTopCard(direction); 
      });
    } else {
      topCardControls.start({ 
        x: 0, 
        y: 0, 
        rotate: 0, 
        scale: 1, 
        transition: { type: "spring", stiffness: 500, damping: 30 } 
      });
      motionX.set(0);
      motionY.set(0);
    }
  }, [topCardControls, removeTopCard, isMounted, motionX, motionY]);

  // Trigger programmatique des swipes
  const triggerSwipe = useCallback((direction) => {
    if (!isMounted.current || profiles.length === 0 || currentIndex >= profiles.length) return;
    
    if (direction === 'info') {
      navigate(`/profile/${profiles[currentIndex].id}`);
      return;
    }
    
    setIsSwiping(true);
    
    // Animations existantes adaptées
    if (direction === 'left' || direction === 'right') {
      const finalX = direction === 'right' ? "120%" : "-120%";
      const finalRotate = direction === 'right' ? 20 : -20;
      
      topCardControls.start({
        x: direction === 'right' ? 30 : -30,
        rotate: direction === 'right' ? 8 : -8,
        transition: { duration: 0.16, ease: "easeOut" }
      }).then(() => {
        if (isMounted.current) {
          topCardControls.start({
            x: finalX,
            y: 20,
            rotate: finalRotate,
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.24, ease: "easeIn" }
          }).then(() => {
            if (isMounted.current) {
              removeTopCard(direction);
              setIsSwiping(false);
            }
          });
        }
      });
    } else if (direction === 'superlike') {
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

  // Gestion du rewind (premium)
  const handleRewind = () => {
    if (!currentUser || !currentUser.premiumStatus.canRewind || history.length === 0) {
      toast({ 
        title: "Fonction Premium", 
        description: "Passez à Premium pour utiliser Retour.", 
        variant: "destructive" 
      });
      return;
    }
    
    const lastAction = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCurrentIndex(prev => Math.max(0, prev - 1));
    
    toast({ 
      title: "Action annulée", 
      description: `Retour au profil de ${lastAction.profile.name}`, 
      duration: 2000 
    });
  };

  // États de chargement et d'erreur
  if (swipesLoading && profiles.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des profils...</p>
        </div>
      </div>
    );
  }

  if (swipesError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Erreur: {swipesError}</p>
          <button 
            onClick={() => swipeActions.loadProfiles()}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (profiles.length === 0 || currentIndex >= profiles.length) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Plus de profils disponibles</p>
          <button 
            onClick={() => {
              setCurrentIndex(0);
              swipeActions.loadProfiles(20);
            }}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Recharger
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* En-tête avec stats */}
      <div className="flex-shrink-0 p-4 pb-0">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold text-white">Découvrir</h1>
          <div className="text-sm text-gray-400">
            {stats.totalSwipes > 0 && (
              <span>Swipes: {stats.totalSwipes} | Matches: {stats.matches}</span>
            )}
          </div>
        </div>
        
        {/* Indicateur de nouveaux matches */}
        {newMatches.length > 0 && (
          <div className="mb-4 p-3 bg-gradient-to-r from-pink-600/20 to-red-600/20 rounded-lg border border-pink-500/30">
            <p className="text-pink-300 text-sm">
              🎉 {newMatches.length} nouveau{newMatches.length > 1 ? 'x' : ''} match{newMatches.length > 1 ? 's' : ''} !
            </p>
          </div>
        )}
      </div>

      {/* Zone de swipe */}
      <div className="flex-1 flex flex-col">
        <div className={`w-full max-w-md ${isPWA ? 'aspect-[3/4.5]' : 'aspect-[3/4]'} relative mx-auto px-2`}>
          <AnimatePresence>
            {profiles.slice(currentIndex, currentIndex + 3).map((profile, index) => {
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
                  onDrag={isTopCard ? (e, info) => { motionX.set(info.offset.x); motionY.set(info.offset.y); } : undefined}
                  onDragEnd={isTopCard ? handleDragEnd : undefined}
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
                    profile={{
                      ...profile,
                      name: profile.full_name || profile.name,
                      photos: profile.photos?.map(p => p.url) || [profile.profile_picture_url],
                      // Adapter les autres champs selon le mapping Supabase
                    }} 
                    isTopCard={isTopCard} 
                    onSwipe={isTopCard ? triggerSwipe : undefined} 
                    isSwiping={isTopCard ? isSwiping : false}
                    isPWA={isPWA}
                  />
                </CardWrapper>
              );
            })}
          </AnimatePresence>
        </div>
        
        {/* Boutons d'action */}
        {currentProfile && (
          <div className="w-full max-w-[240px] mx-auto px-1 -mt-4 relative z-20">
            <ActionButtons
              onRewind={handleRewind}
              onSwipe={triggerSwipe}
              canRewind={currentUser?.premiumStatus?.canRewind}
              canBoost={currentUser?.premiumStatus?.canBoost}
              isSwiping={isSwiping}
              historyLength={history.length}
              motionX={motionX}
              currentUser={currentUser}
              isPWA={isPWA}
            />
          </div>
        )}
      </div>

      {/* Animation de match */}
      <AnimatePresence>
        {showMatchAnimation && matchedProfileData && currentUser && (
          <MatchAnimationOverlay
            currentUserData={currentUser}
            matchedUserData={{
              ...matchedProfileData,
              name: matchedProfileData.full_name || matchedProfileData.name,
              photos: matchedProfileData.photos?.map(p => p.url) || [matchedProfileData.profile_picture_url]
            }}
            onClose={() => {
              setShowMatchAnimation(false);
              setMatchedProfileData(null);
            }}
            onSendMessage={() => {
              setShowMatchAnimation(false);
              setMatchedProfileData(null);
              navigate('/chat');
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default HomePageWithSupabase;
