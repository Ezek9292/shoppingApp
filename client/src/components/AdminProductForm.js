import React, { useState, useRef } from 'react';
import './AdminProductForm.css';

export default function AdminProductForm({ product, adminToken, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    image: null,
    images: []
  });
  const [imagePreview, setImagePreview] = useState(product?.image || null);
  const [galleryPreviews, setGalleryPreviews] = useState(product?.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();
  const galleryInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setFormData((prev) => ({ ...prev, image: base64 }));
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = [...galleryPreviews];
      let filesProcessed = 0;

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newPreviews.push({ url: event.target.result, isNew: true });
          filesProcessed++;
          if (filesProcessed === files.length) {
            setGalleryPreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });

      setFormData((prev) => ({
        ...prev,
        images: newPreviews.map((p) => p.url)
      }));
    }
  };

  const removeGalleryImage = (index) => {
    const updated = galleryPreviews.filter((_, i) => i !== index);
    setGalleryPreviews(updated);
    setFormData((prev) => ({
      ...prev,
      images: updated.map((p) => p.url)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const baseURL = process.env.REACT_APP_API_BASE || 'http://localhost:5002';
      const url = product
        ? `${baseURL}/api/admin/products/${product._id}`
        : `${baseURL}/api/admin/products`;
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
          image: formData.image,
          images: formData.images
        })
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Failed to save product');
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-overlay">
      <div className="admin-form-modal">
        <h2>{product ? 'Edit Product' : 'Create Product'}</h2>
        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Primary Image</label>
            <div className="image-upload">
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              )}
              <button
                type="button"
                className="upload-button"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? 'Change Image' : 'Upload Image'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Gallery Images (Multiple)</label>
            <div className="gallery-upload">
              <button
                type="button"
                className="upload-button"
                onClick={() => galleryInputRef.current?.click()}
              >
                + Add Gallery Images
              </button>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
                style={{ display: 'none' }}
              />
              {galleryPreviews.length > 0 && (
                <div className="gallery-grid">
                  {galleryPreviews.map((preview, idx) => (
                    <div key={idx} className="gallery-item">
                      <img src={preview.url} alt={`Gallery ${idx}`} />
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeGalleryImage(idx)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
