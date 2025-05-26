import React from 'react';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { Settings, BarChart3, Wallet, EyeOff, ChevronRight, Zap, ShieldAlert, Image as ImageIcon, Edit3 } from 'lucide-react';
    import { useUser } from '@/contexts/UserContext';
    import { useNavigate } from 'react-router-dom';
    import { cn } from '@/lib/utils';

    const ActionButton = ({ icon: Icon, label, onClick, className, bgColor = "bg-slate-800/60 hover:bg-slate-700/80" }) => (
      <Button variant="ghost" className={cn(`flex flex-col items-center justify-center h-16 w-full rounded-xl space-y-0.5 text-gray-300 hover:text-white transition-all duration-200 shadow-md p-1`, bgColor, className)} onClick={onClick} >
        <Icon size={20} className="mb-0.5 text-primary" />
        <span className="text-[10px] text-center px-0.5 leading-tight">{label}</span>
      </Button>
    );

    const PremiumBanner = ({ title, description, buttonText, onClick, icon: Icon, gradientClass, isActive, isManagement = false }) => (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={cn("p-3.5 rounded-xl shadow-lg text-white overflow-hidden relative", gradientClass, isActive && !isManagement && "opacity-75")}
        >
            <div className="flex items-center mb-1.5">
                <Icon size={20} className="mr-1.5" />
                <h4 className="text-base font-semibold">{title} {isActive && "(Actif)"}</h4>
            </div>
            <p className="text-[11px] mb-2.5 opacity-90 leading-snug">{description}</p>
            <Button 
                onClick={onClick} 
                size="sm" 
                className={cn(
                    "bg-white/90 hover:bg-white text-black text-[11px] rounded-full px-3 py-1 h-auto shadow-md",
                    isActive && "bg-green-400/90 hover:bg-green-400 text-white",
                    isManagement && isActive && "bg-orange-500/90 hover:bg-orange-500 text-white" 
                )}
            >
                {buttonText} {!isActive && <ChevronRight size={12} className="ml-1" />}
            </Button>
        </motion.div>
    );


    const ProfilePage = () => {
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
        <div className="p-1 pt-4 space-y-3 bg-gradient-to-b from-background to-slate-900 text-white min-h-full overflow-y-auto no-scrollbar pb-16">
          <motion.div 
            initial={{ opacity: 0, y: -15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }} 
            className="relative flex flex-col items-center"
          >
            <button onClick={handleProfilePictureClick} className="relative focus:outline-none group">
                <Avatar className="w-32 h-32 sm:w-36 sm:h-36 border-[6px] border-primary shadow-xl group-hover:border-pink-500 transition-all duration-300"> 
                    <AvatarImage src={currentUser.profilePicture || `https://ui-avatars.com/api/?name=${userFirstName}&background=random`} alt={userFirstName} /> 
                    <AvatarFallback className="bg-primary-hover text-4xl">{userFirstName.substring(0,1).toUpperCase()}</AvatarFallback> 
                </Avatar>
                <div className="absolute bottom-1 right-1 bg-slate-700 p-2 rounded-full border-2 border-background group-hover:bg-pink-500 transition-all duration-300">
                    <Edit3 size={16} className="text-primary group-hover:text-white transition-all duration-300" />
                </div>
            </button>
            <h3 className="mt-3 text-2xl font-bold text-gradient-heresse">{userFirstName}</h3>
            <p className="text-xs text-gray-400 max-w-[85%] text-center line-clamp-2">{currentUser.bio || "Aucune bio pour le moment."}</p>
          </motion.div>

          <div className="grid grid-cols-4 gap-1.5 px-2">
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
          
          <div className="px-2 space-y-2.5 pt-2">
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