import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default ProtectedRoute;