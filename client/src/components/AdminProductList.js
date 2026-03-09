import React, { useState } from 'react';
import AdminProductForm from './AdminProductForm';
import { API_BASE_URL } from '../config/api';
import './AdminProductList.css';

export default function AdminProductList({ products, adminToken, onProductsUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) onProductsUpdate();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="admin-product-list-container">
      <div className="admin-list-header">
        <h2>Products</h2>
        <button className="add-product-btn" onClick={handleCreate}>
          + Add Product
        </button>
      </div>

      {showForm && (
        <AdminProductForm
          product={editingProduct}
          adminToken={adminToken}
          onSuccess={() => {
            handleFormClose();
            onProductsUpdate();
          }}
          onCancel={handleFormClose}
        />
      )}

      <div className="admin-products-grid">
        {products.map((product) => (
          <div key={product._id} className="admin-product-card">
            <img src={product.image} alt={product.name} />
            <div className="admin-product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-category">Category: {product.category || 'Accessories'}</p>
              <p className="product-category">Sizes: {product.sizes?.length ? product.sizes.join(', ') : 'N/A'}</p>
              <p className="product-category">Colors: {product.colors?.length ? product.colors.join(', ') : 'N/A'}</p>
              <p className="product-price">GHS {Number(product.price).toFixed(2)}</p>
              <p className="product-stock">Stock: {product.stock}</p>
              <div className="product-actions">
                <button className="edit-btn" onClick={() => handleEdit(product)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(product._id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !showForm && (
        <p className="no-products">No products. Click "Add Product" to create one.</p>
      )}
    </div>
  );
}
