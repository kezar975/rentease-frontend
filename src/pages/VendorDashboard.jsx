import { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import api from '../services/api'; 

const theme = {
  colors: {
    primary: '#5D4037',
    accent: '#8B5A2B',
    bg: '#FAF9F6',
    cardBg: '#FFFFFF',
    text: '#2C2420',
    textMuted: '#8D7B6F',
    border: '#D7CCC8'
  },
  shadows: { card: '0 8px 24px rgba(93, 64, 55, 0.06)' },
  radius: { md: '12px' }
};

function StatCard({ label, value, icon }) {
  return (
    <Card style={{
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.radius.md,
      boxShadow: theme.shadows.card,
      backgroundColor: theme.colors.cardBg,
      padding: '24px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: '700', color: theme.colors.primary }}>{value}</div>
      <div style={{ color: theme.colors.textMuted, fontSize: '0.9rem', marginTop: '4px' }}>{label}</div>
    </Card>
  );
}

export default function VendorDashboard() {
  const [stats, setStats] = useState({ products: 0, rentals: 0, maintenance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, rentalsRes, maintenanceRes] = await Promise.all([
          api.get('/vendor/products'),
          api.get('/vendor/rentals'),
          api.get('/vendor/maintenance')
        ]);
        setStats({
          products: productsRes.data.length,
          rentals: rentalsRes.data.length,
          maintenance: maintenanceRes.data.filter(m => m.status !== 'Resolved').length
        });
      } catch (err) {
        console.error('Failed to load vendor stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Spinner animation="border" style={{ color: theme.colors.primary }} />
      </div>
    );
  }

  return (
    <div>
      <h3 style={{
        color: theme.colors.primary,
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: '700',
        marginBottom: '28px'
      }}>
        Vendor Dashboard
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <StatCard label="My Products" value={stats.products} icon="📦" />
        <StatCard label="Active Rentals" value={stats.rentals} icon="🧾" />
        <StatCard label="Open Maintenance Requests" value={stats.maintenance} icon="🔧" />
      </div>
    </div>
  );
}