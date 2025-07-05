import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // 認証済みであれば、子ルートを表示 (Outlet)
  // 認証されていなければ、/login にリダイレクト
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};