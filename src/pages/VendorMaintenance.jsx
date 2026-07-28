import { useEffect, useState } from 'react';
import { Table, Badge, Spinner, Alert } from 'react-bootstrap';
import api from '../api/api';

const theme = {
  colors: { primary: '#5D4037', bg: '#FAF9F6', cardBg: '#FFFFFF', textMuted: '#8D7B6F', border: '#D7CCC8' },
  radius: { md: '12px' }
};

export default function VendorMaintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/vendor/maintenance');
        setRequests(res.data);
      } catch (err) {
        setError('Failed to load maintenance requests');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusColor = (status) => {
    if (status === 'Resolved') return 'success';
    if (status === 'In Progress') return 'warning';
    return 'secondary';
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
        Maintenance Requests
      </h3>

      {error && <Alert variant="danger" style={{ borderRadius: '8px' }}>{error}</Alert>}

      <div style={{ backgroundColor: theme.colors.cardBg, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`, overflow: 'hidden' }}>
        <Table responsive hover style={{ marginBottom: 0 }}>
          <thead style={{ backgroundColor: theme.colors.bg }}>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Status</th>
              <th>Requested On</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: theme.colors.textMuted, padding: '32px' }}>No maintenance requests</td></tr>
            ) : requests.map(m => (
              <tr key={m._id}>
                <td>{m.rental?.user?.name}</td>
                <td>{m.rental?.product?.name}</td>
                <td><Badge bg={statusColor(m.status)}>{m.status}</Badge></td>
                <td>{new Date(m.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}