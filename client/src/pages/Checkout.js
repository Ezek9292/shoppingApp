import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL } from '../config/api';
import './Checkout.css';

const Checkout = ({ cartItems }) => {
  const { token, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [paymentMethod, setPaymentMethod] = useState('mobile-money');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const verifyPaystackPayment = useCallback(async (reference, orderId) => {
    setVerifyingPayment(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reference, orderId })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError('Payment verification failed');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError('Failed to verify payment');
    } finally {
      setVerifyingPayment(false);
    }
  }, [navigate, token]);

  // Handle payment verification after redirect from Paystack
  useEffect(() => {
    const reference = searchParams.get('reference');
    const orderId = searchParams.get('orderId');
    
    if (reference && orderId && isAuthenticated) {
      verifyPaystackPayment(reference, orderId);
    }
  }, [isAuthenticated, searchParams, verifyPaystackPayment]);

  if (!isAuthenticated) {
    return (
      <div className="checkout">
        <h2>Checkout</h2>
        <div className="auth-required">
          <p>You must be logged in to checkout.</p>
          <Link to="/login" className="auth-link">Go to Login</Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, items: cartItems, total })
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/'), 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleMobileMoneyPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          items: cartItems,
          total
        })
      });

      const data = await response.json();
      if (data.success) {
        // Redirect to Paystack payment page
        window.location.href = data.authorization_url;
      } else {
        setError('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      setError('Failed to initialize payment');
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout">
        <h2>Checkout</h2>
        <p>Your cart is empty. Please add items before checking out.</p>
        <Link to="/">Back to Products</Link>
      </div>
    );
  }

  if (verifyingPayment) {
    return (
      <div className="checkout verifying-message">
        <h2>Verifying Payment...</h2>
        <p>Please wait while we confirm your payment.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="checkout success-message">
        <h2>Order Successful!</h2>
        <p>Thank you for your purchase. Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      {error && <div className="error-banner">{error}</div>}
      
      <div className="checkout-container">
        <form className="checkout-form" onSubmit={paymentMethod === 'mobile-money' ? handleMobileMoneyPayment : handleCardPayment}>
          <div className="form-section">
            <h3>Shipping Information</h3>
            <div className="form-row">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Street Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-section">
            <h3>Payment Method</h3>
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  value="mobile-money"
                  checked={paymentMethod === 'mobile-money'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="radio-label">
                  <strong>Mobile Money (MTN/Vodafone)</strong>
                  <small>Pay via Mobile Money in Ghana</small>
                </span>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="radio-label">
                  <strong>Debit/Credit Card</strong>
                  <small>Visa, Mastercard, etc.</small>
                </span>
              </label>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="form-section">
              <h3>Card Information</h3>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={formData.cardNumber}
                onChange={handleChange}
                required={paymentMethod === 'card'}
              />
              <div className="form-row">
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required={paymentMethod === 'card'}
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleChange}
                  required={paymentMethod === 'card'}
                />
              </div>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={processing}>
            {processing ? 'Processing...' : `${paymentMethod === 'mobile-money' ? 'Pay with Mobile Money' : 'Pay'} GHS ${(total * 6.5).toFixed(2)}`}
          </button>
          <small style={{ display: 'block', marginTop: '10px', textAlign: 'center', color: '#666' }}>
            Approximate amount: GHS {(total * 6.5).toFixed(2)} (1 USD ≈ 6.5 GHS)
          </small>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item._id || item.id} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <strong>Total: ${total.toFixed(2)}</strong>
            <small>≈ GHS {(total * 6.5).toFixed(2)}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
