import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, AlertTriangle, Info, CheckCircle, Trash2 } from 'lucide-react';
import './Alerts.css';

const Alerts = () => {
  const { alerts, dismissAlert } = useAppContext();
  const navigate = useNavigate();

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="alert-icon warning" size={24} />;
      case 'info': return <Info className="alert-icon info" size={24} />;
      default: return <Info className="alert-icon info" size={24} />;
    }
  };

  return (
    <div className="alerts-page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={24} />
        </button>
        <h2>System Alerts</h2>
        <div style={{ width: 24 }}></div>
      </header>

      <div className="alerts-content">
        <div className="alerts-list">
          {alerts.length === 0 ? (
            <div className="empty-state">
              <CheckCircle size={48} className="success-icon" />
              <h3>All Clear</h3>
              <p>No active alerts in the system.</p>
            </div>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} className={`alert-card glass-panel ${alert.read ? 'read' : 'unread'}`}>
                <div className="alert-body">
                  {getAlertIcon(alert.type)}
                  <div className="alert-text">
                    <p className="alert-message">{alert.message}</p>
                    <span className="alert-status">{alert.read ? 'Acknowledged' : 'New'}</span>
                  </div>
                </div>
                {!alert.read && (
                  <button 
                    className="action-btn dismiss-btn" 
                    onClick={() => dismissAlert(alert.id)}
                    title="Acknowledge Alert"
                  >
                    <CheckCircle size={20} />
                  </button>
                )}
                {alert.read && (
                  <button className="action-btn delete-btn" title="Remove Alert">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
