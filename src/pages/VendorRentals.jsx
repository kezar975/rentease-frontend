import { useEffect, useState } from 'react';
import { Table, Badge, Spinner, Alert } from 'react-bootstrap';
import api from '../services/api';

const theme = {
  colors: { primary: '#5D4037', bg: '#FAF9F6', cardBg: '#FFFFFF', textMuted: '#8D7B6F', border: '#D7CCC8' },
  radius: { md: '12px' }
};

export default function VendorRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/vendor/rentals');
        setRentals(res.data);
      } catch (err) {
        setError('Failed to load rentals');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

 const statusColor = (status) => {
  if (status === 'Active') return 'success';
  if (status === 'Returned') return 'secondary';
  if (status === 'Overdue') return 'danger';
  if (status === 'Cancelled') return 'dark';
  return 'warning'; 
};
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Spinner animation="border" style={{ color: theme.colors.primary }} />
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ color: theme.colors.primary, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: '700', marginBottom: '24px' }}>
        Rentals on My Products
      </h3>

      {error && <Alert variant="danger" style={{ borderRadius: '8px' }}>{error}</Alert>}

      <div style={{ backgroundColor: theme.colors.cardBg, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`, overflow: 'hidden' }}>
        <Table responsive hover style={{ marginBottom: 0 }}>
          <thead style={{ backgroundColor: theme.colors.bg }}>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Monthly Rent</th>
              <th>Status</th>
              <th>Damage Reported</th>
            </tr>
          </thead>
          <tbody>
            {rentals.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: theme.colors.textMuted, padding: '32px' }}>No rentals yet</td></tr>
            ) : rentals.map(r => (
              <tr key={r._id}>
                <td>{r.user?.name} <div style={{ fontSize: '0.8rem', color: theme.colors.textMuted }}>{r.user?.email}</div></td>
                <td>{r.product?.name}</td>
                <td>₹{r.product?.monthlyRent}/mo</td>
                <td><Badge bg={statusColor(r.status)}>{r.status}</Badge></td>
                <td>{r.hasDamage ? <Badge bg="danger">Yes</Badge> : <Badge bg="light" text="dark">No</Badge>}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}