import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate as useReactRouterNavigate } from 'react-router-dom';
    import { Toaster } from '@/components/ui/toaster';
    import LandingPage from '@/pages/LandingPage';
    import LoginPage from '@/pages/LoginPage';
    import SignupPage from '@/pages/SignupPage';
    import HomePage from '@/pages/HomePage';
    import ChatPage from '@/pages/ChatPage';
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
    import ProtectedRoute from '@/components/ProtectedRoute';
    import MainLayout from '@/components/layouts/MainLayout';
    import { UserProvider } from '@/contexts/UserContext';
    import CreateStoryPage from '@/pages/CreateStoryPage';
    import ViewStoryPage from '@/pages/ViewStoryPage';
    import KycPage from '@/pages/KycPage';

    const AppContent = () => {
      const navigate = useReactRouterNavigate(); 
      const [isAuthenticated, setIsAuthenticated] = React.useState(false);
      const [isKycComplete, setIsKycComplete] = React.useState(false);
      const [isLoading, setIsLoading] = React.useState(true);

      React.useEffect(() => {
        const token = localStorage.getItem('token');
        const kycStatus = localStorage.getItem('kycComplete');
        setIsAuthenticated(!!token);
        setIsKycComplete(!!kycStatus);
        setIsLoading(false);
      }, []);

      const handleLogin = () => {
        localStorage.setItem('token', 'fake-token'); 
        setIsAuthenticated(true);
        const kycStatusFromStorage = !!localStorage.getItem('kycComplete');
        setIsKycComplete(kycStatusFromStorage);
        
        if (kycStatusFromStorage) {
          navigate('/'); 
        } else {
          navigate('/kyc'); 
        }
      };
      
      const handleKycComplete = () => {
        localStorage.setItem('kycComplete', 'true');
        setIsKycComplete(true);
        navigate('/'); 
      };

      const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('kycComplete');
        setIsAuthenticated(false);
        setIsKycComplete(false);
        navigate('/landing'); 
      };
      
      const handleSignup = () => {
        localStorage.setItem('token', 'fake-token'); 
        localStorage.removeItem('kycComplete'); 
        setIsAuthenticated(true);
        setIsKycComplete(false); 
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
              <Route path="/chat/:matchId" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><ChatPage /></ProtectedRoute>} />
              <Route path="/galleries" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><PrivateGalleriesPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><ProfilePage onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/profile/my-photos" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><MyPhotosPage /></ProtectedRoute>} />
              <Route path="/profile/:userId" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><UserProfilePage /></ProtectedRoute>} />
              <Route path="/profile/:userId/gallery/:galleryId" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><UserPrivateGalleryPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><SettingsPage /></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute isAuthenticated={isAuthenticated} isKycComplete={isKycComplete}><WalletPage /></ProtectedRoute>} />
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
            <AppContent />
          </Router>
        </UserProvider>
      );
    };

    export default App;