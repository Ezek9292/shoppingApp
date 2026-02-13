import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

export default function AdminProtectedRoute({ children }) {
  const { isAdminAuthenticated, loading } = useAdmin();

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  if (!isAdminAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}
