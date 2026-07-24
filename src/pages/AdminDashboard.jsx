import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Table, Alert, Row, Col } from 'react-bootstrap';

const theme = {
  colors: {
    primary: '#5D4037',       
    primaryHover: '#4E342E',  
    accent: '#8B5A2B',        
    bg: '#FAF9F6',           
    cardBg: '#FFFFFF',        
    text: '#2C2420',          
    textMuted: '#8D7B6F',     
    border: '#D7CCC8',       
    tableHeader: '#F5F0EB',  
    
    success: '#2E7D32',      
    successBg: '#E8F5E9',     
    warning: '#F57F17',      
    warningBg: '#FFF8E1',     
    muted: '#8D7B6F',         
    mutedBg: '#F5F0EB',      
    error: '#C62828',         
    errorBg: '#FFEBEE'       
  },
  shadows: {
    soft: '0 4px 12px rgba(93, 64, 55, 0.06)',
    lifted: '0 12px 24px rgba(93, 64, 55, 0.12)'
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px'
  }
};

export default function AdminDashboard() {
  const [rentals, setRentals] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [linkHover, setLinkHover] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [rentalsRes, usersRes, productsRes] = await Promise.all([
          api.get('/admin/rentals'),
          api.get('/admin/users'),
          api.get('/products')
        ]);
        setRentals(rentalsRes.data);
        setUsers(usersRes.data);
        setProducts(productsRes.data.products || productsRes.data);
      } catch (err) {
        setError('Failed to load dashboard data. Please check your connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const activeRentals = rentals.filter(r => r.status === 'Active');
  const pendingRentals = rentals.filter(r => r.status === 'Pending');
  const mrr = activeRentals.reduce((sum, r) => sum + (r.product?.monthlyRent || 0), 0);
  const utilizationRate = products.length ? Math.round((activeRentals.length / products.length) * 100) : 0;

  if (loading) {
    return (
      <div style={{ 
        backgroundColor: theme.colors.bg, 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: theme.colors.cardBg,
          borderRadius: theme.radius.md,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.soft
        }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: `4px solid ${theme.colors.border}`,
            borderTopColor: theme.colors.primary,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: theme.colors.textMuted, fontSize: '0.95rem', margin: 0 }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: theme.colors.bg, minHeight: '100vh', width: '100%', padding: '40px 20px', boxSizing: 'border-box' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ 
          color: theme.colors.primary, 
          fontFamily: "'Playfair Display', Georgia, serif", 
          fontWeight: '700', 
          fontSize: '1.8rem',
          letterSpacing: '0.5px',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          📈 Dashboard Overview
        </h3>
        <p style={{ color: theme.colors.textMuted, fontSize: '0.95rem', marginTop: '8px', marginBottom: 0 }}>
          Welcome back. Here's what's happening with your furniture rentals today.
        </p>
      </div>

      {error && (
        <Alert style={{ 
          borderRadius: theme.radius.sm, 
          border: `1px solid ${theme.colors.error}`, 
          backgroundColor: theme.colors.errorBg, 
          color: theme.colors.error, 
          fontSize: '0.9rem', 
          marginBottom: '24px',
          padding: '12px 16px'
        }}>
          {error}
        </Alert>
      )}

      <Row className="g-3 mb-4">
        <Col md={4}><StatCard label="Total Users" value={users.length} color="primary" /></Col>
        <Col md={4}><StatCard label="Active Rentals" value={activeRentals.length} color="success" /></Col>
        <Col md={4}><StatCard label="Pending Requests" value={pendingRentals.length} color="warning" /></Col>
        <Col md={4}><StatCard label="Monthly Revenue" value={`₹${mrr.toLocaleString('en-IN')}`} color="primary" /></Col>
        <Col md={4}><StatCard label="Total Listings" value={products.length} color="primary" /></Col>
        <Col md={4}><StatCard label="Utilization Rate" value={`${utilizationRate}%`} color="warning" /></Col>
      </Row>

      <div style={{ height: '1px', backgroundColor: theme.colors.border, margin: '32px 0' }} />

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h5 style={{ 
          color: theme.colors.text, 
          fontFamily: "'Playfair Display', Georgia, serif", 
          fontWeight: '700', 
          fontSize: '1.2rem',
          margin: 0 
        }}>
          Recent Rentals
        </h5>
        <Link 
          to="/admin/rentals" 
          onMouseEnter={() => setLinkHover(true)}
          onMouseLeave={() => setLinkHover(false)}
          style={{
            color: linkHover ? theme.colors.primary : theme.colors.accent,
            fontSize: '0.9rem',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          View all <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>→</span>
        </Link>
      </div>
      
      <div style={{ 
        backgroundColor: theme.colors.cardBg, 
        borderRadius: theme.radius.md, 
        border: `1px solid ${theme.colors.border}`, 
        boxShadow: theme.shadows.soft, 
        overflow: 'hidden' 
      }}>
        <Table responsive style={{ margin: 0, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: theme.colors.tableHeader }}>
              {['User', 'Product', 'Status', 'Start Date'].map((heading, idx) => (
                <th key={idx} style={{ 
                  padding: '14px 16px', 
                  color: theme.colors.text, 
                  fontWeight: '600', 
                  fontSize: '0.85rem', 
                  letterSpacing: '0.5px',
                  borderBottom: `2px solid ${theme.colors.border}`,
                  textAlign: 'left',
                  whiteSpace: 'nowrap'
                }}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rentals.slice(0, 5).map(r => (
              <tr 
                key={r._id}
                onMouseEnter={() => setHoveredRow(r._id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ 
                  backgroundColor: hoveredRow === r._id ? '#FAF9F6' : 'transparent',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <td style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.colors.border}`, color: theme.colors.text, fontWeight: '500' }}>
                  {r.user?.name || 'N/A'}
                </td>
                <td style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.colors.border}`, color: theme.colors.text }}>
                  {r.product?.name || 'N/A'}
                </td>
                <td style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.colors.border}` }}>
                  <StatusBadge status={r.status} />
                </td>
                <td style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.colors.border}`, color: theme.colors.textMuted, fontSize: '0.9rem' }}>
                  {r.startDate ? new Date(r.startDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                </td>
              </tr>
            ))}
            {rentals.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '60px 20px', textAlign: 'center', color: theme.colors.textMuted }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📋</div>
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>No rentals recorded yet</p>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}


function StatCard({ label, value, color = 'primary' }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const colorMap = {
    primary: { text: '#5D4037', bg: '#FAF9F6' },
    success: { text: '#2E7D32', bg: '#E8F5E9' },
    warning: { text: '#F57F17', bg: '#FFF8E1' }
  };
  
  const themeColor = colorMap[color] || colorMap.primary;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        border: `1px solid #D7CCC8`,
        borderRadius: '12px',
        boxShadow: isHovered ? '0 12px 24px rgba(93, 64, 55, 0.12)' : '0 4px 12px rgba(93, 64, 55, 0.06)',
        padding: '24px 20px',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        height: '100%'
      }}
    >
      <div style={{ 
        color: themeColor.text, 
        fontSize: '0.8rem', 
        fontWeight: '600', 
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        marginBottom: '8px'
      }}>
        {label}
      </div>
      <div style={{ 
        color: '#2C2420', 
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '1.75rem', 
        fontWeight: '700',
        lineHeight: '1.2'
      }}>
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusStyles = {
    Active: { backgroundColor: '#E8F5E9', color: '#2E7D32' },
    Pending: { backgroundColor: '#FFF8E1', color: '#F57F17' },
    Completed: { backgroundColor: '#F5F0EB', color: '#8D7B6F' },
    Cancelled: { backgroundColor: '#FFEBEE', color: '#C62828' }
  };

  const style = statusStyles[status] || statusStyles.Completed;

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '600',
      letterSpacing: '0.3px',
      backgroundColor: style.backgroundColor,
      color: style.color
    }}>
      {status}
    </span>
  );
}