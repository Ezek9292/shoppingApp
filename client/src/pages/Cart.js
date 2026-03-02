import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = ({ cartItems, removeFromCart, updateQuantity }) => {
  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="cart">
        <h2>Shopping Cart</h2>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/" className="continue-shopping">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item._id || item.id} className="cart-item">
            <div className="item-details">
              <h4>{item.name}</h4>
              <p>GHS {item.price.toFixed(2)}</p>
            </div>
            <div className="item-quantity">
              <button onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)} type="button">-</button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item._id || item.id, parseInt(e.target.value, 10) || 0)}
                min="1"
              />
              <button onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)} type="button">+</button>
            </div>
            <div className="item-total">
              GHS {(item.price * item.quantity).toFixed(2)}
            </div>
            <button
              className="remove-btn"
              onClick={() => removeFromCart(item._id || item.id)}
              type="button"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="total">
          <h3>Total: GHS {calculateTotal().toFixed(2)}</h3>
        </div>
        <div className="cart-actions">
          <Link to="/" className="continue-shopping">Continue Shopping</Link>
          <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
