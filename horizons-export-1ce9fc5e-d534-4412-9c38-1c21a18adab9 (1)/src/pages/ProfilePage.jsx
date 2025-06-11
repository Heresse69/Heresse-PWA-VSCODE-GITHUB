import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, BarChart3, Wallet, EyeOff, ChevronRight, Zap, ShieldAlert, Edit3, Image, Lock, Eye, Play } from 'lucide-react';

// Mock des composants UI
const Avatar = ({ className, children, onClick }) => (
  <div className={`rounded-full overflow-hidden ${className}`} onClick={onClick}>
    {children}
  </div>
);

const AvatarImage = ({ src, alt, className = "" }) => (
  <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />
);

const AvatarFallback = ({ children, className = "" }) => (
  <div className={`w-full h-full flex items-center justify-center bg-pink-600 text-white font-bold ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, className = "", size = "default", variant = "default" }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  const sizeClasses = size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 py-2";
  const variantClasses = variant === "ghost" ? "hover:bg-accent hover:text-accent-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90";
  
  return (
    <button 
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Mock des hooks avec navigation réelle
const useToast = () => ({
  toast: ({ title, description }) => {
    // Simulation d'un toast - en vrai tu utiliseras le système de toast de ton app
    const toastEl = document.createElement('div');
    toastEl.className = 'fixed bottom-20 left-4 right-4 bg-slate-800 text-white p-3 rounded-lg shadow-lg z-50 mx-auto max-w-md';
    toastEl.textContent = `${title}: ${description}`;
    document.body.appendChild(toastEl);
    setTimeout(() => document.body.removeChild(toastEl), 3000);
  }
});

const useNavigate = () => (path) => {
  // Navigation réelle selon le path
  const routes = {
    '/dashboard': () => window.location.href = '#dashboard',
    '/wallet': () => window.location.href = '#wallet', 
    '/premium': () => window.location.href = '#premium',
    '/profile/my-photos': () => window.location.href = '#profile-photos',
    '/profile/my-gallery': () => window.location.href = '#private-gallery',
    '/settings': () => window.location.href = '#settings'
  };
  
  return routes[path] || (() => console.log('Navigate to:', path));
};

const useUser = () => ({
  currentUser: {
    id: 'currentUserHerese',
    name: 'Robin Testeur',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: "Passionné par la tech et les voyages. Toujours prêt pour une nouvelle aventure ! 🚀\nCherche des connexions authentiques.",
    premiumStatus: {
      subscriptionType: null,
      incognitoMode: false
    },
    stats: {
      // Stats par période
      week: { matches: 3, photosSold: 2, revenueGenerated: 8.50 },
      month: { matches: 12, photosSold: 8, revenueGenerated: 34.00 },
      year: { matches: 35, photosSold: 12, revenueGenerated: 68.50 },
      allTime: { matches: 42, photosSold: 15, revenueGenerated: 75.50 }
    },
    privateGallery: {
      itemCount: 8,
      totalRevenue: 45.50,
      coverImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop'
    }
  },
  updatePremiumStatus: (key, value) => console.log('Update premium status:', key, value)
});

const ActionButton = ({ icon: Icon, label, onClick, className, isActive = false }) => (
  <Button 
    variant="ghost" 
    className={cn(
      `flex flex-col items-center justify-center h-16 rounded-lg space-y-1 text-gray-300 hover:text-white transition-all duration-200 shadow-sm p-2 flex-1 min-w-0`,
      "bg-slate-700/50 hover:bg-slate-600/60", 
      className,
      isActive && "bg-pink-600/30 hover:bg-pink-600/40 text-pink-400"
    )} 
    onClick={onClick}
  >
    <Icon size={16} className="text-pink-600 flex-shrink-0" />
    <span className="text-[9px] text-center leading-tight w-full">{label}</span>
  </Button>
);

const PremiumBanner = ({ 
  title, 
  description, 
  buttonText, 
  onClick, 
  icon: Icon, 
  gradientClass, 
  isActive, 
  isManagement = false 
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1 }}
    className={cn(
      "p-3.5 rounded-xl shadow-lg text-white overflow-hidden relative transition-all duration-300",
      gradientClass,
      !isActive && "opacity-60 hover:opacity-80"
    )}
  >
    <div className="flex items-center mb-1.5">
      <Icon size={20} className="mr-1.5 flex-shrink-0" />
      <h4 className="text-base font-semibold">
        {title} {isActive && "(Actif)"}
      </h4>
    </div>
    <p className="text-[11px] mb-2.5 opacity-90 leading-snug">{description}</p>
    <Button 
      onClick={onClick} 
      size="sm" 
      className={cn(
        "text-[11px] rounded-full px-3 py-1 h-auto shadow-md transition-all",
        isActive && "bg-green-400/90 hover:bg-green-400 text-white",
        isManagement && isActive && "bg-orange-500/90 hover:bg-orange-500 text-white",
        !isActive && "bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
      )}
    >
      {buttonText} {!isActive && <ChevronRight size={12} className="ml-1" />}
    </Button>
  </motion.div>
);

const StatsPeriodTabs = ({ activePeriod, onPeriodChange }) => {
  const periods = [
    { key: 'week', label: 'Cette semaine' },
    { key: 'month', label: 'Ce mois-ci' },
    { key: 'year', label: 'Cette année' },
    { key: 'allTime', label: 'Depuis toujours' }
  ];

  return (
    <div className="flex bg-slate-700/30 rounded-lg p-1 mb-3 overflow-x-auto">
      {periods.map((period) => (
        <button
          key={period.key}
          onClick={() => onPeriodChange(period.key)}
          className={cn(
            "flex-1 text-[9px] py-2 px-2 rounded-md transition-all duration-200 whitespace-nowrap",
            activePeriod === period.key
              ? "bg-pink-600 text-white shadow-sm"
              : "text-gray-400 hover:text-white hover:bg-slate-600/50"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

const PrivateGalleryCard = ({ gallery, onClick }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay: 0.1 }}
    onClick={onClick}
    className="relative aspect-square rounded-xl overflow-hidden bg-slate-800 cursor-pointer group shadow-lg"
  >
    <img 
      src={gallery.coverImage} 
      alt="Galerie privée" 
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
    
    {/* Overlay gradient */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    
    {/* Content */}
    <div className="absolute inset-0 p-3 flex flex-col justify-between">
      {/* Badge premium en haut */}
      <div className="flex justify-between items-start">
        <div className="bg-purple-600/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
          <Lock size={10} className="text-white mr-1" />
          <span className="text-[8px] text-white font-semibold">Premium</span>
        </div>
        <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-[8px] text-white font-semibold">{gallery.itemCount} médias</span>
        </div>
      </div>
      
      {/* Infos en bas */}
      <div className="text-center">
        <h4 className="text-white font-bold text-sm mb-1">Ma Galerie Privée</h4>
        <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-300">
          <div className="flex items-center">
            <Eye size={10} className="mr-1" />
            <span>Revenus: {gallery.totalRevenue.toFixed(2)}€</span>
          </div>
        </div>
        
        {/* Bouton d'action */}
        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 text-black px-3 py-1 rounded-full text-[9px] font-semibold">
            Gérer la galerie
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const ProfilePage = () => {
  const { toast } = useToast();
  const { currentUser, updatePremiumStatus } = useUser();
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState('allTime');

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <p className="text-white">Chargement du profil...</p>
      </div>
    );
  }

  const userFirstName = currentUser.name ? currentUser.name.split(' ')[0] : 'Utilisateur';
  const currentStats = currentUser.stats[activePeriod];

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

  const handleGalleryClick = () => {
    navigate('/profile/my-gallery');
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-y-auto overflow-x-hidden pb-32">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Section Profil */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }} 
          className="relative flex flex-col items-center flex-shrink-0 pt-4"
        >
          <button onClick={handleProfilePictureClick} className="relative focus:outline-none group">
            <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-[6px] border-pink-600 shadow-xl group-hover:border-pink-500 transition-all duration-300"> 
              <AvatarImage src={currentUser.profilePicture || `https://ui-avatars.com/api/?name=${userFirstName}&background=random`} alt={userFirstName} /> 
              <AvatarFallback className="text-3xl sm:text-4xl">{userFirstName.substring(0,1).toUpperCase()}</AvatarFallback> 
            </Avatar>
            
            {/* Badge "Modifier" */}
            <div className="absolute -bottom-1 -right-1 bg-slate-700/90 backdrop-blur-sm px-2 py-1 rounded-full border-2 border-slate-900 group-hover:bg-pink-500/90 transition-all duration-300 flex items-center">
              <Edit3 size={12} className="text-pink-600 group-hover:text-white transition-all duration-300 mr-1" />
              <span className="text-[9px] text-pink-600 group-hover:text-white font-semibold">Modifier</span>
            </div>
          </button>
          
          <h3 className="mt-3 text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text">{userFirstName}</h3>
          
          {/* Bio dans un encart */}
          <div className="mt-2 w-full">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
              <p className="text-xs text-gray-300 text-center leading-relaxed">
                {currentUser.bio || "Aucune bio pour le moment."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Galerie Privée mise en valeur - VERSION COMPACTE */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-4 flex-shrink-0"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50 cursor-pointer hover:bg-slate-700/50 transition-all duration-300"
               onClick={handleGalleryClick}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700 relative">
                  <img 
                    src={currentUser.privateGallery.coverImage} 
                    alt="Galerie privée" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                    <Lock size={12} className="text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Ma Galerie Privée</h4>
                  <div className="flex items-center space-x-3 text-[10px] text-gray-400">
                    <span>{currentUser.privateGallery.itemCount} médias</span>
                    <span>•</span>
                    <span>{currentUser.privateGallery.totalRevenue.toFixed(2)}€ générés</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Actions rapides avec layout corrigé */}
        <div className="mt-4 flex-shrink-0">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-3 border border-slate-700/30 w-full">
            <div className="grid grid-cols-4 gap-2">
              <ActionButton 
                icon={BarChart3} 
                label="Tableau de bord" 
                onClick={() => navigate('/dashboard')} 
              />
              <ActionButton 
                icon={Wallet} 
                label="Portefeuille" 
                onClick={() => navigate('/wallet')} 
              />
              <ActionButton 
                icon={EyeOff} 
                label={currentUser.premiumStatus.incognitoMode ? "Incognito ON" : "Incognito OFF"} 
                onClick={handleToggleIncognito} 
                isActive={currentUser.premiumStatus.incognitoMode}
              />
              <ActionButton 
                icon={Settings} 
                label="Paramètres" 
                onClick={() => navigate('/settings')} 
              />
            </div>
          </div>
        </div>
        
        {/* Section Premium */}
        <div className="space-y-2.5 mt-4 flex-shrink-0">
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

        {/* Statistiques avec onglets de période - plus d'espace en bas */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 mb-8 flex-shrink-0"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30">
            <h4 className="text-sm font-semibold text-white mb-3 text-center">Vos statistiques</h4>
            
            {/* Onglets de période */}
            <StatsPeriodTabs 
              activePeriod={activePeriod}
              onPeriodChange={setActivePeriod}
            />
            
            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-pink-600">{currentStats.matches || 0}</div>
                <div className="text-[10px] text-gray-400">Matchs</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-400">{currentStats.photosSold || 0}</div>
                <div className="text-[10px] text-gray-400">Photos vendues</div>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-400">{(currentStats.revenueGenerated || 0).toFixed(0)}€</div>
                <div className="text-[10px] text-gray-400">Revenus</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;