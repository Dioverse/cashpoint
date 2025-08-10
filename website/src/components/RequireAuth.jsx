import React from 'react';
import { useAuth } from '../AuthContext';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children, adminOnly = true }){
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
//   if (adminOnly && !user.is_admin) return <Navigate to="/forbidden" replace />;
  if (adminOnly && !user) return <Navigate to="/forbidden" replace />;
  return children;
}
