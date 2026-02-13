import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthProvider from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    const productId = product._id || product.id;
    const existingItem = cartItems.find(item => (item._id || item.id) === productId);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        (item._id || item.id) === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => (item._id || item.id) !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item =>
        (item._id || item.id) === productId ? { ...item, quantity } : item
      ));
    }
  };

  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <Header cartCount={cartItems.length} />
          <main className="app-container">
            <Routes>
              <Route path="/" element={<ProductList addToCart={addToCart} />} />
              <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
              <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout cartItems={cartItems} />
                  </ProtectedRoute>
                } 
              />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
};

export default App;
