import React, { useState, useEffect } from 'react';
import { X, Save, Camera } from 'lucide-react';
import './EditItemModal.css';

const EditItemModal = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    quantity: 0,
    lowStockThreshold: 5,
    image: null
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        quantity: item.quantity || 0,
        lowStockThreshold: item.lowStockThreshold || 5,
        image: item.image || null
      });
    }
  }, [item]);

  if (!item) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setFormData(prev => ({ ...prev, image: canvas.toDataURL('image/jpeg', 0.7) }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.quantity < 0 || formData.lowStockThreshold < 0) return;
    
    setIsSaving(true);
    await new Promise(res => setTimeout(res, 500)); // Simulate batched DB update
    
    onSave({
      ...item,
      quantity: formData.quantity,
      lowStockThreshold: formData.lowStockThreshold,
      image: formData.image
    });
    setIsSaving(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <header className="modal-header">
          <h3>Edit {item.name}</h3>
          <button className="icon-btn close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group image-upload-group">
            <label>Item Image</label>
            <div className="image-preview-area">
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="edit-image-preview" />
              ) : (
                <div className="no-image-placeholder">No Image</div>
              )}
            </div>
            <label className="upload-btn sm-btn">
              <Camera size={16} />
              <span>Replace Image</span>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>

          <div className="form-group">
            <label>Total Stock (Quantity)</label>
            <input 
              type="number" 
              name="quantity" 
              value={formData.quantity} 
              onChange={handleChange} 
              min="0"
              required 
            />
          </div>

          <div className="form-group">
            <label>Low Stock Alert Threshold</label>
            <input 
              type="number" 
              name="lowStockThreshold" 
              value={formData.lowStockThreshold} 
              onChange={handleChange} 
              min="0"
              required 
            />
          </div>

          <button type="submit" className="primary-btn glow-btn submit-btn" disabled={isSaving} style={{ opacity: isSaving ? 0.7 : 1 }}>
            <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;
