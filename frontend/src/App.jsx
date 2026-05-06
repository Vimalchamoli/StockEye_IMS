import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddItem from './pages/AddItem';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/add-item" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app-container">
          <AppRoutes />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
