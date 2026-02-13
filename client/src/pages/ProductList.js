import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const baseURL = process.env.REACT_APP_API_BASE || 'http://localhost:5002';
        const response = await fetch(`${baseURL}/api/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="product-list">
      <h2>Products</h2>
      {error && <div className="error-message">Note: Using sample data. Server not running.</div>}
      <div className="products-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
