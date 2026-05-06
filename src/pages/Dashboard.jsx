import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { useAppContext } from '../context/AppContext';
import { Bell, Plus, Home as HomeIcon, Settings, List, Box as BoxIcon, Edit2, BarChart2 } from 'lucide-react';
import EditItemModal from '../components/EditItemModal';
import './Dashboard.css';

// 3D Item Component
const Item3D = ({ type }) => {
  const meshRef = useRef();
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.5;
  });

  const getColor = () => {
    if (type === 'Hardware') return '#00f0ff';
    if (type === 'Neural') return '#8a2be2';
    return '#ff0055';
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        {type === 'Hardware' ? <boxGeometry args={[1.5, 1.5, 1.5]} /> : 
         type === 'Neural' ? <torusKnotGeometry args={[0.8, 0.2, 100, 16]} /> :
         <octahedronGeometry args={[1.2]} />}
        <meshStandardMaterial color={getColor()} wireframe emissive={getColor()} emissiveIntensity={0.6} />
      </mesh>
    </Float>
  );
};

const InventoryCard = React.memo(({ item, onEdit }) => {
  return (
    <div className="inventory-card glass-panel">
      <div className="card-header-actions">
        <button className="icon-btn edit-card-btn" onClick={() => onEdit(item)}>
          <Edit2 size={16} />
        </button>
      </div>
      <div className="card-3d-preview" style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {item.image ? (
          <img src={item.image} alt={item.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Item3D type={item.category} />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        )}
      </div>
      <div className="card-info">
        <h3>{item.name}</h3>
        <p className="category">{item.category}</p>
        <div className="stats">
          <span className="qty">Qty: {item.quantity}</span>
          <span className="price">₹{item.price}</span>
        </div>
      </div>
    </div>
  );
});

const Dashboard = () => {
  const { user, inventory, transactions, alerts, updateItem } = useAppContext();
  const navigate = useNavigate();
  const unreadAlerts = alerts.filter(a => !a.read).length;
  const [editingItem, setEditingItem] = useState(null);

  const handleSaveEdit = (updatedItem) => {
    updateItem(updatedItem.id, updatedItem);
    setEditingItem(null);
  };

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <header className="top-bar glass-panel">
        <div className="logo">
          <BoxIcon className="icon-glow" size={24} />
          <span>StockEye</span>
        </div>
        <div className="user-section">
          <button className="icon-btn" onClick={() => navigate('/alerts')}>
            <Bell size={20} />
            {unreadAlerts > 0 && <span className="badge">{unreadAlerts}</span>}
          </button>
          <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="dashboard-header">
          <h2>Inventory Overview</h2>
          <button className="primary-btn sm-btn" onClick={() => navigate('/add-item')}>
            <Plus size={16} /> Add New
          </button>
        </div>

        {/* 3D Inventory Cards */}
        <div className="inventory-grid">
          {inventory.map(item => (
            <InventoryCard key={item.id} item={item} onEdit={setEditingItem} />
          ))}
        </div>

        {/* Transactions & Alerts Section */}
        <div className="bottom-sections">
          <div className="recent-transactions glass-panel">
            <h3>Recent Transactions</h3>
            <ul className="transaction-list">
              {transactions.slice(0, 3).map(tx => (
                <li key={tx.id} className="transaction-item">
                  <div className={`tx-type ${tx.type.toLowerCase()}`}>{tx.type}</div>
                  <div className="tx-details">
                    <span className="tx-item">{tx.item}</span>
                    <span className="tx-date">{new Date(tx.date).toLocaleDateString()}</span>
                  </div>
                  <div className="tx-qty">{tx.type === 'IN' ? '+' : '-'}{tx.qty}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {editingItem && (
          <EditItemModal 
            item={editingItem} 
            onClose={() => setEditingItem(null)} 
            onSave={handleSaveEdit} 
          />
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="bottom-nav glass-panel">
        <button className="nav-item active" onClick={() => navigate('/dashboard')}>
          <HomeIcon size={24} />
          <span>Home</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/add-item')}>
          <Plus size={24} />
          <span>Add</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/analytics')}>
          <BarChart2 size={24} />
          <span>Analytics</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/settings')}>
          <Settings size={24} />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
