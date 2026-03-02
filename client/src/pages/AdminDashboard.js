import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminProductList from '../components/AdminProductList';
import { API_BASE_URL } from '../config/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { adminToken, logoutAdmin, admin } = useAdmin();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/products`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) setProducts(await res.json());
    } catch (err) {
      console.error('Fetch products error:', err);
    }
  }, [adminToken]);

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchProducts();
  }, [adminToken, fetchProducts, navigate]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {admin?.firstName} {admin?.lastName}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="admin-content">
        <AdminProductList products={products} adminToken={adminToken} onProductsUpdate={fetchProducts} />
      </div>
    </div>
  );
}
