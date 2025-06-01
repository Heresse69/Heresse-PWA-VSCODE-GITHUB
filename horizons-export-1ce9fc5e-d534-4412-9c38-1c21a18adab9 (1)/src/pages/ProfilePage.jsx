import React from 'react';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { Settings, BarChart3, Wallet, EyeOff, ChevronRight, Zap, ShieldAlert, Image as ImageIcon, Edit3 } from 'lucide-react';
    import { useUser } from '@/contexts/UserContext';
    import { useNavigate } from 'react-router-dom';
    import { useScrollLock } from '@/hooks/useScrollLock';
    import { cn } from '@/lib/utils';

    const ActionButton = ({ icon: Icon, label, onClick, className, bgColor = "bg-slate-800/60 hover:bg-slate-700/80" }) => (
      <Button variant="ghost" className={cn(`flex flex-col items-center justify-center h-14 w-full rounded-xl space-y-0.5 text-gray-300 hover:text-white transition-all duration-200 shadow-md p-1.5`, bgColor, className)} onClick={onClick} >
        <Icon size={16} className="mb-0.5 text-primary" />
        <span className="text-[8px] text-center px-1 leading-tight">{label}</span>
      </Button>
    );

    const PremiumBanner = ({ title, description, buttonText, onClick, icon: Icon, gradientClass, isActive, isManagement = false }) => (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={cn("p-2.5 rounded-xl shadow-lg text-white overflow-hidden relative", gradientClass, isActive && !isManagement && "opacity-75")}
        >
            <div className="flex items-center mb-1">
                <Icon size={16} className="mr-1" />
                <h4 className="text-sm font-semibold">{title} {isActive && "(Actif)"}</h4>
            </div>
            <p className="text-[10px] mb-2 opacity-90 leading-snug line-clamp-2">{description}</p>
            <Button 
                onClick={onClick} 
                size="sm" 
                className={cn(
                    "bg-white/90 hover:bg-white text-black text-[10px] rounded-full px-2.5 py-0.5 h-auto shadow-md",
                    isActive && "bg-green-400/90 hover:bg-green-400 text-white",
                    isManagement && isActive && "bg-orange-500/90 hover:bg-orange-500 text-white" 
                )}
            >
                {buttonText} {!isActive && <ChevronRight size={10} className="ml-0.5" />}
            </Button>
        </motion.div>
    );


    const ProfilePage = () => {
      // Bloquer le scroll pour cette page
      useScrollLock(true);
      
      const { toast } = useToast();
      const { currentUser, updatePremiumStatus } = useUser();
      const navigate = useNavigate();

      if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <p className="text-white">Chargement du profil...</p>
            </div>
        );
      }

      const userFirstName = currentUser.name ? currentUser.name.split(' ')[0] : 'Utilisateur';

      const handleToggleIncognito = () => {
        if (!currentUser.premiumStatus.subscriptionType && !currentUser.premiumStatus.incognitoMode) {
            navigate('/premium'); 
            return;
        }
        const newIncognitoStatus = !currentUser.premiumStatus.incognitoMode;
        updatePremiumStatus('incognitoMode', newIncognitoStatus);
        toast({title: `Mode Incognito ${newIncognitoStatus ? 'activé' : 'désactivé'}`});
      };
      
      const handlePremiumNavigation = () => {
        navigate('/premium');
      };

      const handleProfilePictureClick = () => {
        navigate('/profile/my-photos');
      };

      return (
        <div className="min-h-screen flex flex-col p-1 pt-4 space-y-3 bg-gradient-to-b from-background to-slate-900 text-white">
          <motion.div 
            initial={{ opacity: 0, y: -15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }} 
            className="relative flex flex-col items-center flex-shrink-0 pb-2"
          >
            <button onClick={handleProfilePictureClick} className="relative focus:outline-none group">
                <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-primary shadow-xl group-hover:border-pink-500 transition-all duration-300"> 
                    <AvatarImage src={currentUser.profilePicture || `https://ui-avatars.com/api/?name=${userFirstName}&background=random`} alt={userFirstName} /> 
                    <AvatarFallback className="bg-primary-hover text-3xl sm:text-4xl">{userFirstName.substring(0,1).toUpperCase()}</AvatarFallback> 
                </Avatar>
                <div className="absolute bottom-0 right-0 bg-slate-700 p-1.5 rounded-full border-2 border-background group-hover:bg-pink-500 transition-all duration-300">
                    <Edit3 size={12} className="text-primary group-hover:text-white transition-all duration-300" />
                </div>
            </button>
            <h3 className="mt-2 text-lg sm:text-xl font-bold text-gradient-heresse">{userFirstName}</h3>
            <p className="text-[10px] text-gray-400 max-w-[85%] text-center line-clamp-1">{currentUser.bio || "Aucune bio pour le moment."}</p>
          </motion.div>

          <div className="grid grid-cols-4 gap-2 px-2 flex-shrink-0">
            <ActionButton icon={BarChart3} label="Tableau de bord" onClick={() => navigate('/dashboard')} />
            <ActionButton icon={Wallet} label="Portefeuille" onClick={() => navigate('/wallet')} />
            <ActionButton 
                icon={EyeOff} 
                label={currentUser.premiumStatus.incognitoMode ? "Incognito ON" : "Incognito OFF"} 
                onClick={handleToggleIncognito} 
                bgColor={currentUser.premiumStatus.incognitoMode ? "bg-primary/30 hover:bg-primary/40" : "bg-slate-800/60 hover:bg-slate-700/80"}
                className={currentUser.premiumStatus.incognitoMode ? "text-primary" : ""}
            />
            <ActionButton icon={Settings} label="Paramètres" onClick={() => navigate('/settings')} />
          </div>
          
          <div className="px-2 space-y-2 pt-1 flex-1 overflow-hidden flex flex-col pb-20">
            <PremiumBanner 
                title="Mode Incognito"
                description="Soyez visible uniquement par les profils que vous avez préalablement likés."
                buttonText={currentUser.premiumStatus.incognitoMode ? "Désactiver Incognito" : (currentUser.premiumStatus.subscriptionType ? "Activer Incognito" : "Obtenir Incognito")}
                onClick={handleToggleIncognito}
                icon={ShieldAlert}
                gradientClass="bg-gradient-to-br from-purple-600 to-indigo-700"
                isActive={currentUser.premiumStatus.incognitoMode}
                isManagement={currentUser.premiumStatus.incognitoMode || !!currentUser.premiumStatus.subscriptionType}
            />
             <PremiumBanner 
                title="Heresse Premium"
                description="Swipes illimités, voir qui vous a liké, réinitialiser les dislikes, accès aux filtres de photos/vidéos/live et plus !"
                buttonText={currentUser.premiumStatus.subscriptionType ? "Gérer Premium" : "Obtenir Premium"}
                onClick={handlePremiumNavigation}
                icon={Zap}
                gradientClass="bg-gradient-to-br from-pink-600 to-red-600"
                isActive={!!currentUser.premiumStatus.subscriptionType}
                isManagement={!!currentUser.premiumStatus.subscriptionType}
            />
          </div>
        </div>
      );
    };
    export default ProfilePage;