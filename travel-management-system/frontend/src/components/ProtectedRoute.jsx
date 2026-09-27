import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, redirect to their appropriate dashboard
    if (user.role === 'employee') return <Navigate to="/dashboard/employee" replace />;
    if (user.role === 'manager') return <Navigate to="/dashboard/manager" replace />;
    if (user.role === 'finance') return <Navigate to="/dashboard/finance" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
