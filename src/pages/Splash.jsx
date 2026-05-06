import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from 'lucide-react';
import './Splash.css';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="logo-wrapper">
        <Box className="logo-icon" size={64} />
        <h1 className="logo-text">StockEye</h1>
      </div>
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  );
};

export default Splash;
