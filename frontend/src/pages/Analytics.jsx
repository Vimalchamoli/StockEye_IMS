import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';
import './Analytics.css';

const COLORS = ['#0088ff', '#ff3366', '#6a1b9a', '#00f0ff', '#ff0055'];

const Analytics = () => {
  const { inventory, transactions } = useAppContext();
  const navigate = useNavigate();

  // Prepare data for Category Pie Chart
  const categoryData = useMemo(() => {
    return inventory.reduce((acc, item) => {
      const existing = acc.find(c => c.name === item.category);
      if (existing) {
        existing.value += item.quantity;
      } else {
        acc.push({ name: item.category, value: item.quantity });
      }
      return acc;
    }, []);
  }, [inventory]);

  // Prepare data for Inventory Levels Bar Chart
  const inventoryData = useMemo(() => {
    return inventory.map(item => ({
      name: item.name.substring(0, 10) + '...',
      quantity: item.quantity,
      threshold: item.lowStockThreshold || 5
    }));
  }, [inventory]);

  // Prepare data for Transactions Line Chart
  const txData = useMemo(() => {
    const txByDate = transactions.reduce((acc, tx) => {
      const dateStr = new Date(tx.date).toLocaleDateString();
      if (!acc[dateStr]) acc[dateStr] = { date: dateStr, IN: 0, OUT: 0 };
      acc[dateStr][tx.type] += tx.qty;
      return acc;
    }, {});
    return Object.values(txByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

  return (
    <div className="analytics-page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={24} />
        </button>
        <h2>Analytics Dashboard</h2>
        <div style={{ width: 24 }}></div>
      </header>

      <div className="analytics-content">
        
        <div className="charts-grid">
          {/* Inventory Levels */}
          <div className="chart-card glass-panel full-width">
            <div className="chart-header">
              <BarChart3 size={20} className="chart-icon cyan" />
              <h3>Inventory Levels vs Threshold</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inventoryData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                  <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                  <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.1)'}} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-accent)', color: 'var(--text-primary)' }} />
                  <Legend />
                  <Bar dataKey="quantity" name="Current Stock" fill="var(--accent-cyan)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="threshold" name="Alert Threshold" fill="var(--accent-pink)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="chart-card glass-panel half-width">
            <div className="chart-header">
              <PieChartIcon size={20} className="chart-icon purple" />
              <h3>Category Distribution</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-accent)', color: 'var(--text-primary)' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transaction Flow */}
          <div className="chart-card glass-panel half-width">
            <div className="chart-header">
              <TrendingUp size={20} className="chart-icon pink" />
              <h3>Stock Movement</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={txData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                  <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-accent)', color: 'var(--text-primary)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="IN" stroke="var(--accent-cyan)" strokeWidth={3} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="OUT" stroke="var(--accent-pink)" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Analytics;
