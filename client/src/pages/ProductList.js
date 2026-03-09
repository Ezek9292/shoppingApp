import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { API_BASE_URL } from '../config/api';
import { ALL_CATEGORY, normalizeCategory } from '../constants/categories';
import './ProductList.css';

const normalize = (value = '') => value.toLowerCase();

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  const query = (searchParams.get('q') || '').trim();
  const selectedCategory = normalizeCategory(searchParams.get('category') || ALL_CATEGORY);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/products`);
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

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalize(query);

    return products.filter((product) => {
      const category = normalizeCategory(product.category || 'Accessories');
      const inCategory = selectedCategory === ALL_CATEGORY || category === selectedCategory;
      if (!inCategory) return false;

      if (!normalizedQuery) return true;

      const haystack = normalize(`${product.name || ''} ${product.description || ''}`);
      return haystack.includes(normalizedQuery);
    });
  }, [products, query, selectedCategory]);

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="product-list">
      <section className="landing-notices">
        <div className="notice notice-primary">
          <p className="notice-eyebrow">Big Notice</p>
          <h2>Discover trending ads by category</h2>
          <p>Use search and category filters to quickly find exactly what you want.</p>
        </div>
        <div className="notice notice-secondary">
          <p className="notice-eyebrow">Filter Status</p>
          <h3>
            {selectedCategory === ALL_CATEGORY ? 'All Categories' : selectedCategory}
            {query ? ` • "${query}"` : ''}
          </h3>
        </div>
      </section>

      {error && <div className="error-message">Note: Using sample data. Server not running.</div>}

      <section className="categories-intro">
        <h2>Available Ads</h2>
        <p>
          Showing {filteredProducts.length} of {products.length} item{products.length === 1 ? '' : 's'}
        </p>
      </section>

      {filteredProducts.length === 0 ? (
        <div className="error-message">No items match your search/category filter yet.</div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
