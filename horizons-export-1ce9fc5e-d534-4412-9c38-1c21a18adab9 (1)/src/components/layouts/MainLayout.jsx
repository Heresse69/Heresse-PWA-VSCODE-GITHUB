import React from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Home, Heart, MessageSquare, Lock, User, LogOut, Settings, Wallet, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';

const NavItem = ({ to, icon: Icon, label, isActive, notificationCount }) => {
  let displayCount = notificationCount;
  if (notificationCount > 99) {
    displayCount = "99+";
  }

  return (
    <Link 
      to={to} 
      className="flex flex-col items-center justify-center space-y-1 relative p-1 w-1/5 h-full"
      style={{
        pointerEvents: 'auto',
        touchAction: 'manipulation',
        position: 'relative',
        zIndex: '1',
        minHeight: '60px',
        display: 'flex'
      }}
    >
      <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-300'}`} />
      <span className={`text-[10px] transition-colors ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-300'}`}>{label}</span>
      {notificationCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute top-[-2px] right-[calc(50%-22px)] sm:right-[calc(50%-20px)] text-[9px] h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full shadow-md"
        >
          {displayCount}
        </Badge>
      )}
    </Link>
  );
};

const MainLayout = ({ onLogout, isAuthenticated, isKycComplete }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  if (!isAuthenticated && location.pathname !== '/landing' && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/kyc') {
    return <Navigate to="/landing" replace />;
  }
  if (isAuthenticated && !isKycComplete && location.pathname !== '/kyc') {
    return <Navigate to="/kyc" replace />;
  }
  
  const isChatPageActive = location.pathname.startsWith('/chat/'); 
  const isChatListPage = location.pathname === '/chat'; 
  const isProfilePageActive = location.pathname === '/profile' && !location.pathname.startsWith('/profile/');
  const isMyPhotosPage = location.pathname === '/profile/my-photos';
  const isUserPrivateGalleryPage = location.pathname.includes('/gallery/') && location.pathname.startsWith('/profile/'); 
  const isOtherUserProfilePage = location.pathname.startsWith('/profile/') && !isProfilePageActive && !isMyPhotosPage && !isUserPrivateGalleryPage;
  const isHomePage = location.pathname === '/';
  const isSettingsPage = location.pathname === '/settings';
  const isWalletPage = location.pathname === '/wallet';
  const isDashboardPage = location.pathname === '/dashboard';
  const isPremiumPage = location.pathname === '/premium';
  const isPublicGalleriesPage = location.pathname === '/galleries'; 
  const isViewingPublicGalleryContent = location.pathname.startsWith('/galleries/') && location.pathname !== '/galleries'; 
  const isCreateStoryPage = location.pathname === '/stories/create';
  const isViewStoryPage = location.pathname.startsWith('/stories/') && !isCreateStoryPage;
  const isKycPage = location.pathname === '/kyc';

  let headerTitle = "Heresse"; 
  let showBackButton = false;
  let completelyHideLeftElement = false;

  if (isHomePage) {
    headerTitle = "Heresse"; 
    completelyHideLeftElement = true; 
  } else if (location.pathname === '/matches') {
    headerTitle = "Matchs";
    completelyHideLeftElement = true; 
  } else if (isChatListPage) {
    headerTitle = "Messages";
    completelyHideLeftElement = true; 
  } else if (isPublicGalleriesPage) { 
    headerTitle = "Galeries"; 
    showBackButton = false; 
    completelyHideLeftElement = true; 
  } else if (isViewingPublicGalleryContent) { 
    headerTitle = "Galerie"; 
    showBackButton = true; 
  } else if (isProfilePageActive) {
    headerTitle = "Mon Profil";
    completelyHideLeftElement = true; 
  } else if (isMyPhotosPage) { 
    headerTitle = "Mes Photos"; 
    showBackButton = true; 
  } else if (isUserPrivateGalleryPage) { 
    headerTitle = "Ma Galerie Privée"; 
    showBackButton = true; 
  } else if (isOtherUserProfilePage) { 
    headerTitle = "Profil"; 
    showBackButton = true; 
  } else if (isSettingsPage) { 
    headerTitle = "Paramètres"; 
    showBackButton = true; 
  } else if (isWalletPage) { 
    headerTitle = "Portefeuille"; 
    showBackButton = true; 
  } else if (isDashboardPage) { 
    headerTitle = "Tableau de Bord"; 
    showBackButton = true; 
  } else if (isPremiumPage) { 
    headerTitle = "Modes Premium"; 
    showBackButton = true; 
  } else if (isCreateStoryPage) { 
    headerTitle = "Créer une Story"; 
    showBackButton = true; 
  } else if (isViewStoryPage) { 
    headerTitle = "Story"; 
    showBackButton = true; 
  } else if (isKycPage) {
    headerTitle = "Vérification d'Identité";
    showBackButton = false; 
    completelyHideLeftElement = true;
  }

  const showHeader = !isChatPageActive && !isViewStoryPage && !isKycPage; 
  const showNav = !isChatPageActive && 
                  !isOtherUserProfilePage && 
                  !isMyPhotosPage && 
                  !isCreateStoryPage && 
                  !isViewStoryPage && 
                  !isSettingsPage && 
                  !isWalletPage && 
                  !isDashboardPage && 
                  !isPremiumPage &&
                  !isUserPrivateGalleryPage &&
                  !isKycPage; 
  
  const mainContentPaddingBottom = showNav ? 'pb-[calc(56px+env(safe-area-inset-bottom))]' : 'pb-0'; 
  const mainContentPaddingTop = showHeader ? `pt-[calc(3.5rem+env(safe-area-inset-top))]` : 'pt-0';
  
const mainContentOverflow = (isHomePage || isViewStoryPage || isChatPageActive || isKycPage) ? 'overflow-hidden' : 'overflow-y-auto';  
  const headerHeight = `calc(3.5rem + env(safe-area-inset-top))`;

  return (
    <div className="flex flex-col h-full bg-background text-foreground" style={{ overscrollBehavior: 'none', WebkitOverflowScrolling: 'auto' }}>
      {showHeader && (
        <header 
          className="p-2.5 flex items-center justify-between bg-background/80 backdrop-blur-sm z-20 border-b border-border fixed top-0 left-0 right-0 max-w-md mx-auto"
          style={{ 
            paddingTop: `calc(0.625rem + env(safe-area-inset-top))`,
            height: headerHeight,
            overscrollBehavior: 'none'
          }} 
        >
          <div className="flex items-center min-w-0">
            {!completelyHideLeftElement && showBackButton && (
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-gray-300 hover:text-white mr-2 -ml-1 h-8 w-8">
                  <ChevronLeft size={22} />
              </Button>
            )}
            {!completelyHideLeftElement && !showBackButton && (
                 <div className="w-7 h-7 mr-2 shrink-0"></div> 
            )}
            <h1 className="text-lg font-semibold tracking-tight text-gradient-heresse truncate">
              {headerTitle}
            </h1>
          </div>
          <div className="flex items-center space-x-0.5 shrink-0">
            {isProfilePageActive && (
              <>
                <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} className="text-gray-300 hover:text-white w-8 h-8">
                  <Settings className="w-4.5 h-4.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogoutClick} className="text-gray-300 hover:text-white w-8 h-8">
                  <LogOut className="w-4.5 h-4.5" />
                </Button>
              </>
            )}
          </div>
        </header>
      )}
      
      <main 
        className={`flex-grow ${mainContentOverflow} ${mainContentPaddingBottom} ${mainContentPaddingTop}`}
      >
  <motion.div
  key={location.pathname}
  initial={{ opacity: 0, y: (isChatPageActive || isMyPhotosPage || isUserPrivateGalleryPage || isViewStoryPage || isKycPage) ? 0 : 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: (isChatPageActive || isMyPhotosPage || isUserPrivateGalleryPage || isViewStoryPage || isKycPage) ? 0 : -10 }}
  transition={{ duration: 0.18 }}
  style={{ height: 'auto', overflow: 'visible' }}
>
  <Outlet />
</motion.div>
      </main>

      {showNav && (
        <nav 
          className="bg-background/95 backdrop-blur-md py-1 px-4 border-t border-border shadow-2xl fixed bottom-0 left-0 right-0 max-w-md mx-auto flex items-center z-50"
          style={{
            height: '60px',
            position: 'fixed',
            bottom: '0px',
            left: '0px',
            right: '0px',
            zIndex: '9999',
            backgroundColor: 'hsl(222.2, 84%, 4.9%, 0.95)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid hsl(217.2, 32.6%, 17.5%)',
            pointerEvents: 'auto',
            touchAction: 'manipulation'
          }}
        >
          <div className="flex justify-around items-center w-full h-[60px]">
            <NavItem to="/" icon={Home} label="Découvrir" isActive={location.pathname === '/'} />
            <NavItem to="/matches" icon={Heart} label="Matchs" isActive={location.pathname === '/matches'} notificationCount={currentUser?.newMatchesCount || 0} />
            <NavItem to="/chat" icon={MessageSquare} label="Messages" isActive={isChatListPage || isChatPageActive} notificationCount={currentUser?.totalUnreadMessagesCount || 0} />
            <NavItem to="/galleries" icon={Lock} label="Galeries" isActive={isPublicGalleriesPage || isViewingPublicGalleryContent} />
            <NavItem to="/profile" icon={User} label="Profil" isActive={location.pathname === '/profile'} />
          </div>
        </nav>
      )}
    </div>
  );
};

export default MainLayout;