import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => (
  <div className="product-card">
    <Link to={`/product/${product._id}`} className="product-link">
      <div className="product-image">
        <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <p className="price">GHS {product.price.toFixed(2)}</p>
        {product.sizes?.length > 0 && (
          <p className="variants-text">Sizes: {product.sizes.join(', ')}</p>
        )}
        {product.colors?.length > 0 && (
          <p className="variants-text">Colors: {product.colors.join(', ')}</p>
        )}
      </div>
    </Link>
    <button
      className="add-to-cart-btn"
      onClick={() => onAddToCart(product)}
      type="button"
    >
      Add to Cart
    </button>
  </div>
);

export default ProductCard;
