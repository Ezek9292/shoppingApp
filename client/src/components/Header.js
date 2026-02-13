import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Header.css';

const Header = ({ cartCount }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Shopping App</h1>
        </Link>
        <nav className="nav">
          <Link to="/">Products</Link>
          <Link to="/cart" className="cart-link">
            Cart ({cartCount})
          </Link>
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
              <button className="logout-btn" onClick={logout} type="button">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/register" className="auth-link register-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
