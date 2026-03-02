import React, { createContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
  const [loading, setLoading] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!adminToken);

  useEffect(() => {
    if (adminToken) {
      setIsAdminAuthenticated(true);
    }
  }, [adminToken]);

  const createAdmin = async (email, password, firstName, lastName, secret) => {
    setLoading(true);
    try {
      if (!secret) {
        throw new Error('Admin setup secret is required');
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/create-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, secret })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdminToken(data.token);
      setAdmin(data.user);
      localStorage.setItem('adminToken', data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // verify user is admin
      if (!data.user.isAdmin) throw new Error('Not an admin account');
      setAdminToken(data.token);
      setAdmin(data.user);
      localStorage.setItem('adminToken', data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdmin(null);
    localStorage.removeItem('adminToken');
  };

  return (
    <AdminContext.Provider value={{ admin, adminToken, isAdminAuthenticated, loading, createAdmin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = React.useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
