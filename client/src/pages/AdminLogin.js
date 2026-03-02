import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import './AdminAuth.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const { loginAdmin, createAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await createAdmin(email, password, firstName, lastName, adminSecret);
      } else {
        await loginAdmin(email, password);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-box">
        <h1>{isRegister ? 'Create Admin Account' : 'Admin Login'}</h1>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Admin Setup Secret"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                required
              />
            </>
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : isRegister ? 'Create Admin' : 'Login'}
          </button>
        </form>
        
        <p className="toggle-auth">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={() => setIsRegister(!isRegister)} className="link-btn">
            {isRegister ? 'Login' : 'Create One'}
          </button>
        </p>
      </div>
    </div>
  );
}
