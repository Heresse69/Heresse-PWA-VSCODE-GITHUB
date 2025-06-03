import React, { useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Heart, MessageSquare, SkipForward } from 'lucide-react';

    const MatchAnimationOverlay = ({ currentUserData, matchedUserData, onClose, onSendMessage }) => {
      useEffect(() => {
        const timer = setTimeout(() => {
          onClose();
        }, 8000); 
        return () => clearTimeout(timer);
      }, [onClose]);

      if (!currentUserData || !matchedUserData) return null;

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center z-50 p-4"
          onClick={(e) => { e.stopPropagation(); onClose(); }} 
        >
          <motion.h1 
            className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2, duration: 0.5 } }}
          >
            C'est un Match !
          </motion.h1>
          
          <div className="flex items-center justify-center space-x-[-20px] sm:space-x-[-40px] mb-10">
            <motion.img
              src={currentUserData.profilePicture || `https://ui-avatars.com/api/?name=${currentUserData.name}&background=random&color=fff`}
              alt={currentUserData.name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-pink-500 shadow-2xl object-cover"
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0, transition: { delay: 0.4, type: 'spring', stiffness: 150 } }}
            />
            <motion.img
              src={matchedUserData.photos[0]}
              alt={matchedUserData.name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-yellow-500 shadow-2xl object-cover"
              initial={{ scale: 0, rotate: 15 }}
              animate={{ scale: 1, rotate: 0, transition: { delay: 0.5, type: 'spring', stiffness: 150 } }}
            />
          </div>

          <motion.p 
            className="text-xl text-center text-gray-200 mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.7, duration: 0.5 } }}
          >
            Vous et <span className="font-bold text-white">{matchedUserData.name}</span> vous êtes mutuellement likés !
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { delay: 0.9, type: 'spring' } }}
          >
            <Button 
              onClick={(e) => { e.stopPropagation(); onSendMessage(); }}
              className="bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-full shadow-lg text-lg"
            >
              Envoyer un message <MessageSquare size={20} className="ml-2"/>
            </Button>
            <Button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              variant="outline"
              className="border-gray-400 text-gray-300 hover:bg-white/10 hover:text-white font-semibold py-3 px-6 rounded-full shadow-lg text-lg"
            >
              Continuer de swiper <SkipForward size={20} className="ml-2"/>
            </Button>
          </motion.div>
        </motion.div>
      );
    };

    export default MatchAnimationOverlay;