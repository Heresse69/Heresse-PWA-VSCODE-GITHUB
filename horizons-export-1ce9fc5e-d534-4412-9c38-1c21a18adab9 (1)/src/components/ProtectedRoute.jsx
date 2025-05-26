import React from 'react';
    import { Navigate, useLocation } from 'react-router-dom';

    const ProtectedRoute = ({ isAuthenticated, isKycComplete, children }) => {
      const location = useLocation();

      if (!isAuthenticated) {
        return <Navigate to="/landing" state={{ from: location }} replace />;
      }
      
      
      if (!isKycComplete && location.pathname !== '/kyc') {
         return <Navigate to="/kyc" state={{ from: location }} replace />;
      }

      return children;
    };

    export default ProtectedRoute;