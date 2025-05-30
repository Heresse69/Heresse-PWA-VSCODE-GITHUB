import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate as useReactRouterNavigate } from 'react-router-dom';
    import { Toaster } from '@/components/ui/toaster';
    import LandingPage from '@/pages/LandingPage';
    import LoginPage from '@/pages/LoginPage';
    import SignupPage from '@/pages/SignupPage';
    import HomePage from '@/pages/HomePage';
    import ChatPage from '@/pages/ChatPage';
    import ChatPageConversation from '@/pages/ChatPage_new';
    import ProfilePage from '@/pages/ProfilePage';
    import UserProfilePage from '@/pages/UserProfilePage'; 
    import MatchesPage from '@/pages/MatchesPage';
    import PrivateGalleriesPage from '@/pages/PrivateGalleriesPage';
    import UserPrivateGalleryPage from '@/pages/UserPrivateGalleryPage';
    import SettingsPage from '@/pages/SettingsPage';
    import WalletPage from '@/pages/WalletPage';
    import StatsDashboardPage from '@/pages/StatsDashboardPage';
    import PremiumModesPage from '@/pages/PremiumModesPage';
    import MyPhotosPage from '@/pages/MyPhotosPage';
    import WithdrawFundsPage from '@/pages/WithdrawFundsPage';
    import ProtectedRoute from '@/components/ProtectedRoute';
    import MainLayout from '@/components/layouts/MainLayout';
    import PWAWrapper from '@/components/PWAWrapper';
    import { UserProvider } from '@/contexts/UserContext';
    import CreateStoryPage from '@/pages/CreateStoryPage';
    import ViewStoryPage from '@/pages/ViewStoryPage';
    import KycPage from '@/pages/KycPage';
    import { initializeUserDatabase, getUserById, updateUserKycStatus } from '@/utils/userDatabase';

    const AppContent = () => {
      const navigate = useReactRouterNavigate(); 
      const [isAuthenticated, setIsAuthenticated] = React.useState(false);
      const [isKycComplete, setIsKycComplete] = React.useState(false);
      const [currentUser, setCurrentUser] = React.useState(null);
      const [isLoading, setIsLoading] = React.useState(true);

      React.useEffect(() => {
        // Initialiser la base de données utilisateurs
        initializeUserDatabase();
        
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('currentUserId');
        
        if (token && userId) {
          const user = getUserById(userId);
          if (user) {
            setIsAuthenticated(true);
            setCurrentUser(user);
            setIsKycComplete(user.kycComplete);
          } else {
            // Si l'utilisateur n'existe pas, nettoyer le localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('currentUserId');
          }
        }
        
        setIsLoading(false);
      }, []);

      const handleLogin = (user) => {
        localStorage.setItem('token', 'fake-token'); 
        localStorage.setItem('currentUserId', user.id);
        setIsAuthenticated(true);
        setCurrentUser(user);
        setIsKycComplete(user.kycComplete);
        
        // Les utilisateurs existants avec KYC validé vont directement à la page d'accueil
        if (user.kycComplete) {
          navigate('/'); 
        } else {
          // Les utilisateurs existants sans KYC doivent le compléter
          navigate('/kyc'); 
        }
      };
      
      const handleKycComplete = () => {
        if (currentUser) {
          // Mettre à jour le statut KYC dans la base de données
          updateUserKycStatus(currentUser.id, true);
          setIsKycComplete(true);
          // Mettre à jour l'utilisateur local
          setCurrentUser({ ...currentUser, kycComplete: true });
        }
        navigate('/'); 
      };

      const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUserId');
        setIsAuthenticated(false);
        setIsKycComplete(false);
        setCurrentUser(null);
        navigate('/landing'); 
      };
      
      const handleSignup = (newUser) => {
        localStorage.setItem('token', 'fake-token'); 
        localStorage.setItem('currentUserId', newUser.id);
        setIsAuthenticated(true);
        setCurrentUser(newUser);
        setIsKycComplete(false); // Les nouveaux utilisateurs doivent toujours faire le KYC
        navigate('/kyc'); 
      }

      if (isLoading) {
        return (
          <div className="flex items-center justify-center h-screen bg-background">
            <div className="text-foreground text-xl">Chargement...</div>
          </div>
        );
      }

      return (
        <div className="max-w-md mx-auto h-screen flex flex-col shadow-2xl overflow-hidden bg-background">
          <Toaster />
          <Routes>
            <Route path="/landing" element={isAuthenticated && isKycComplete ? <Navigate to="/" replace /> : (isAuthenticated && !isKycComplete ? <Navigate to="/kyc" replace /> : <LandingPage />)} />
            <Route path="/login" element={isAuthenticated && isKycComplete ? <Navigate to="/" replace /> : (isAuthenticated && !isKycComplete ? <Navigate to="/kyc" replace /> : <LoginPage onLogin={handleLogin} />)} />
            <Route path="/signup" element={isAuthenticated && isKycComplete ? <Navigate to="/" replace /> : (isAuthenticated && !isKycComplete ? <Navigate to="/kyc" replace /> : <SignupPage onSignup={handleSignup} />)} />
            
            <Route 
                path="/kyc" 
                element={
                    !isAuthenticated ? <Navigate to="/login" replace /> : 
                    isKycComplete ? <Navigate to="/" replace /> : 
                    <KycPage onKycComplete={handleKycComplete} />
                } 
            />
            
            <Route element={<MainLayout onLogout={handleLogout} isAuthenticated={isAuthenticated} isKycComplete={isKycComplete} />}>
              <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><HomePage /></ProtectedRoute>} />
              <Route path="/matches" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><MatchesPage /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><ChatPage /></ProtectedRoute>} />
              <Route path="/chat/:matchId" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><ChatPageConversation /></ProtectedRoute>} />
              <Route path="/chat/*" element={<Navigate to="/chat" replace />} />
              <Route path="/galleries" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><PrivateGalleriesPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><ProfilePage onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/profile/my-photos" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><MyPhotosPage /></ProtectedRoute>} />
              <Route path="/profile/:userId" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><UserProfilePage /></ProtectedRoute>} />
              <Route path="/profile/:userId/gallery/:galleryId" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><UserPrivateGalleryPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><SettingsPage /></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><WalletPage /></ProtectedRoute>} />
              <Route path="/withdraw-funds" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><WithdrawFundsPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><StatsDashboardPage /></ProtectedRoute>} />
              <Route path="/premium" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><PremiumModesPage /></ProtectedRoute>} />
              <Route path="/stories/create" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><CreateStoryPage /></ProtectedRoute>} />
              <Route path="/stories/:storyId" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><ViewStoryPage /></ProtectedRoute>} />
            </Route>
            
            <Route path="*" element={<Navigate to={isAuthenticated ? (isKycComplete ? "/" : "/kyc") : "/landing"} replace />} />
          </Routes>
        </div>
      );
    }


    const App = () => {
      return (
        <UserProvider>
          <Router>
            <PWAWrapper>
              <AppContent />
            </PWAWrapper>
          </Router>
        </UserProvider>
      );
    };

    export default App;