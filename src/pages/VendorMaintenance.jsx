import { useState, useEffect } from 'react';
import api from '../services/api';
import { Table, Button, Form, Alert } from 'react-bootstrap';

const theme = {
  colors: {
    primary: '#5D4037', primaryHover: '#4E342E', accent: '#8B5A2B', accentHover: '#6D4620',
    bg: '#FAF9F6', cardBg: '#FFFFFF', text: '#2C2420', textMuted: '#8D7B6F', border: '#D7CCC8',
    tableHeader: '#F5F0EB', success: '#2E7D32', successBg: '#E8F5E9', warning: '#F57F17',
    warningBg: '#FFF8E1', muted: '#8D7B6F', mutedBg: '#F5F0EB', error: '#C62828', errorBg: '#FFEBEE'
  },
  shadows: { soft: '0 4px 12px rgba(93, 64, 55, 0.06)', lifted: '0 12px 24px rgba(93, 64, 55, 0.12)' },
  radius: { sm: '8px', md: '12px', lg: '16px' }
};

const inputStyle = {
  borderRadius: theme.radius.sm, border: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.bg, color: theme.colors.text, padding: '8px 12px',
  fontSize: '0.9rem', boxShadow: 'none', transition: 'border-color 0.2s ease', outline: 'none',
  cursor: 'pointer', width: 'auto', minWidth: '150px'
};

export default function VendorMaintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [actionId, setActionId] = useState(null);
  
  const [hoveredRow, setHoveredRow] = useState(null);
  const [btnHovers, setBtnHovers] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vendor/maintenance');
      setRequests(res.data);
    } catch (err) { 
      setError('Failed to load maintenance requests. Please check your connection.'); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { load(); }, []);

  const update = async (id, status) => {
    setActionId(id);
    try {
      await api.put(`/vendor/maintenance/${id}`, { status });
      load();
    } catch (err) { 
      alert('Update failed. Please try again.'); 
    } finally { 
      setActionId(null); 
    }
  };

  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter);

  const getStatusStyle = (status) => {
    const baseStyle = { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.3px' };
    if (status === 'Resolved') return { ...baseStyle, backgroundColor: theme.colors.successBg, color: theme.colors.success };
    if (status === 'In Progress') return { ...baseStyle, backgroundColor: theme.colors.warningBg, color: theme.colors.warning };
    return { ...baseStyle, backgroundColor: theme.colors.mutedBg, color: theme.colors.muted };
  };

  const handleBtnHover = (key, isHovering) => setBtnHovers(prev => ({ ...prev, [key]: isHovering }));

  if (loading) {
    return (
      <div style={{ backgroundColor: theme.colors.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: theme.colors.cardBg, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.soft }}>
          <div style={{ width: '48px', height: '48px', border: `4px solid ${theme.colors.border}`, borderTopColor: theme.colors.primary, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: theme.colors.textMuted, fontSize: '0.95rem', margin: 0 }}>Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: theme.colors.bg, minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ color: theme.colors.primary, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: '700', fontSize: '1.8rem', letterSpacing: '0.5px', margin: 0 }}>Maintenance Requests</h3>
          <p style={{ color: theme.colors.textMuted, fontSize: '0.95rem', marginTop: '8px', marginBottom: 0 }}>Track and manage customer maintenance issues for your products.</p>
        </div>
        <Form.Select value={filter} onChange={e => setFilter(e.target.value)} style={inputStyle}>
          {['All', 'Open', 'In Progress', 'Resolved'].map(s => <option key={s} value={s}>{s}</option>)}
        </Form.Select>
      </div>

      {error && <Alert style={{ borderRadius: theme.radius.sm, border: `1px solid ${theme.colors.error}`, backgroundColor: theme.colors.errorBg, color: theme.colors.error, fontSize: '0.9rem', marginBottom: '24px', padding: '12px 16px' }}>{error}</Alert>}
      
      <div style={{ backgroundColor: theme.colors.cardBg, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.soft, overflow: 'hidden' }}>
        <Table responsive style={{ margin: 0, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: theme.colors.tableHeader }}>
              {['User', 'Product', 'Issue', 'Status', 'Actions'].map((heading, idx) => (
                <th key={idx} style={{ padding: '14px 16px', color: theme.colors.text, fontWeight: '600', fontSize: '0.85rem', letterSpacing: '0.5px', borderBottom: `2px solid ${theme.colors.border}`, textAlign: idx === 4 ? 'center' : 'left', whiteSpace: 'nowrap' }}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r._id} onMouseEnter={() => setHoveredRow(r._id)} onMouseLeave={() => setHoveredRow(null)} style={{ backgroundColor: hoveredRow === r._id ? '#FAF9F6' : 'transparent', transition: 'background-color 0.2s ease' }}>
                <td style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.colors.border}`, color: theme.colors.text, fontWeight: '500' }}>{r.rental?.user?.name || 'N/A'}</td>
                <td style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.colors.border}`, color: theme.colors.text }}>{r.rental?.product?.name || 'N/A'}</td>
                <td style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.colors.border}`, color: theme.colors.textMuted, fontSize: '0.9rem', maxWidth: '300px', lineHeight: '1.4' }}>{r.issue}</td>
                <td style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.colors.border}`, textAlign: 'center' }}><span style={getStatusStyle(r.status)}>{r.status}</span></td>
                <td style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.colors.border}`, textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {r.status === 'Open' && (
                      <Button size="sm" disabled={actionId === r._id} onMouseEnter={() => handleBtnHover(`start-${r._id}`, true)} onMouseLeave={() => handleBtnHover(`start-${r._id}`, false)} onClick={() => update(r._id, 'In Progress')} style={{ backgroundColor: btnHovers[`start-${r._id}`] ? theme.colors.accentHover : theme.colors.accent, color: '#FFFFFF', border: 'none', borderRadius: theme.radius.sm, padding: '4px 14px', fontWeight: '600', fontSize: '0.8rem', transition: 'all 0.2s ease', boxShadow: 'none', cursor: actionId === r._id ? 'not-allowed' : 'pointer', opacity: actionId === r._id ? 0.6 : 1 }}>
                        {actionId === r._id ? 'Processing...' : 'Start'}
                      </Button>
                    )}
                    {r.status !== 'Resolved' && (
                      <Button size="sm" disabled={actionId === r._id} onMouseEnter={() => handleBtnHover(`resolve-${r._id}`, true)} onMouseLeave={() => handleBtnHover(`resolve-${r._id}`, false)} onClick={() => update(r._id, 'Resolved')} style={{ backgroundColor: btnHovers[`resolve-${r._id}`] ? theme.colors.success : 'transparent', color: btnHovers[`resolve-${r._id}`] ? '#FFFFFF' : theme.colors.success, border: `1.5px solid ${theme.colors.success}`, borderRadius: theme.radius.sm, padding: '4px 14px', fontWeight: '600', fontSize: '0.8rem', transition: 'all 0.2s ease', boxShadow: 'none', cursor: actionId === r._id ? 'not-allowed' : 'pointer', opacity: actionId === r._id ? 0.6 : 1 }}>
                        {actionId === r._id ? 'Processing...' : 'Resolve'}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '60px 20px', textAlign: 'center', color: theme.colors.textMuted }}><div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛠️</div><p style={{ margin: 0, fontSize: '0.95rem' }}>No maintenance requests match this filter</p></td></tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}