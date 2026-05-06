import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Save, Box } from 'lucide-react';
import './AddItem.css';

const ItemPreview3D = ({ category }) => {
  const getColor = () => {
    if (category === 'Hardware') return '#00f0ff';
    if (category === 'Neural') return '#8a2be2';
    return '#ff0055';
  };

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <mesh>
        {category === 'Hardware' ? <boxGeometry args={[1.5, 1.5, 1.5]} /> : 
         category === 'Neural' ? <torusKnotGeometry args={[0.8, 0.2, 100, 16]} /> :
         <octahedronGeometry args={[1.2]} />}
        <meshStandardMaterial color={getColor()} wireframe emissive={getColor()} emissiveIntensity={0.6} />
      </mesh>
    </Float>
  );
};

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    category: 'Hardware',
    image: null
  });
  
  const { addItem } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem({
      ...formData,
      quantity: parseInt(formData.quantity, 10),
      price: parseFloat(formData.price)
    });
    navigate('/dashboard');
  };

  return (
    <div className="add-item-page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={24} />
        </button>
        <h2>Add Inventory Item</h2>
        <div style={{ width: 24 }}></div> {/* Spacer for center alignment */}
      </header>

      <div className="add-item-content">
        <div className="form-container glass-panel">
          <form onSubmit={handleSubmit} className="item-form">
            <div className="form-group">
              <label>Item Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="e.g. Quantum Processor"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Quantity</label>
                <input 
                  type="number" 
                  name="quantity" 
                  value={formData.quantity} 
                  onChange={handleChange} 
                  required 
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input 
                  type="number" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  required 
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="Hardware">Hardware</option>
                <option value="Neural">Neural Components</option>
                <option value="Energy">Energy Systems</option>
              </select>
            </div>

            <div className="form-group">
              <label>Item Image (Optional)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                style={{ padding: '8px' }}
              />
            </div>

            <button type="submit" className="primary-btn glow-btn submit-btn">
              <Save size={18} /> Save Item
            </button>
          </form>
        </div>

        <div className="preview-container glass-panel">
          <h3>Preview</h3>
          <div className="preview-canvas-wrapper" style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {formData.image ? (
              <img src={formData.image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            ) : (
              <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <ItemPreview3D category={formData.category} />
                <OrbitControls autoRotate />
              </Canvas>
            )}
          </div>
          <p className="preview-desc">Holographic or uploaded representation of the {formData.category.toLowerCase()} item type.</p>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
