import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ALL_CATEGORY, PRODUCT_CATEGORIES, normalizeCategory } from '../constants/categories';
import './Header.css';

const Header = ({ cartCount }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const selectedCategory = normalizeCategory(searchParams.get('category') || ALL_CATEGORY);

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  const categoryItems = useMemo(
    () => [{ value: ALL_CATEGORY, label: 'All' }, ...PRODUCT_CATEGORIES],
    []
  );

  const getSearchWith = (nextCategory) => {
    const params = new URLSearchParams(searchParams);
    params.delete('q');
    if (!nextCategory || nextCategory === ALL_CATEGORY) {
      params.delete('category');
    } else {
      params.set('category', normalizeCategory(nextCategory));
    }
    return params.toString() ? `?${params.toString()}` : '';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    const trimmed = searchTerm.trim();
    if (trimmed) {
      params.set('q', trimmed);
    } else {
      params.delete('q');
    }
    navigate({ pathname: '/', search: params.toString() ? `?${params.toString()}` : '' });
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-main">
          <Link to="/" className="logo">
            <h1>NiceThings</h1>
          </Link>

          <form className="header-search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search for items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search products"
            />
            <button type="submit">Search</button>
          </form>

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

        <div className="category-bar">
          {categoryItems.map((category) => (
            <Link
              key={category.value}
              to={{ pathname: '/', search: getSearchWith(category.value) }}
              className={`category-pill ${selectedCategory === category.value ? 'active' : ''}`}
            >
              {category.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
