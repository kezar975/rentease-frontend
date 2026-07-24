import { useState, useEffect } from 'react';
import api from '../services/api';
import { Table, Button, Form, Alert, Modal } from 'react-bootstrap';

const theme = {
  colors: {
    primary: '#5D4037',
    primaryHover: '#4E342E',
    accent: '#8B5A2B',
    accentHover: '#6D4620',
    bg: '#FAF9F6',
    cardBg: '#FFFFFF',
    text: '#2C2420',
    textMuted: '#8D7B6F',
    border: '#D7CCC8',
    tableHeader: '#F5F0EB',
    success: '#2E7D32',
    successBg: '#E8F5E9',
    successHover: '#1B5E20',
    warning: '#F57F17',
    warningBg: '#FFF8E1',
    error: '#C62828',
    errorHover: '#B71C1C',
    errorBg: '#FFEBEE',
    info: '#1565C0',
    infoBg: '#E3F2FD',
    infoHover: '#0D47A1'
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

const inputStyle = {
  borderRadius: theme.radius.sm,
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.bg,
  color: theme.colors.text,
  padding: '10px 14px',
  fontSize: '0.95rem',
  boxShadow: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  outline: 'none',
  cursor: 'pointer'
};

const STATUS_FILTERS = ['All', 'Pending', 'Active', 'Returned', 'Cancelled', 'Overdue'];

export default function AdminRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [damageModal, setDamageModal] = useState(false);
  const [damageTarget, setDamageTarget] = useState(null);
  const [damageNote, setDamageNote] = useState('');
  const [damageError, setDamageError] = useState('');

  const [hoveredRow, setHoveredRow] = useState(null);
  const [btnHovers, setBtnHovers] = useState({});

  const loadRentals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/rentals');
      setRentals(res.data);
    } catch (err) {
      setError('Failed to load rentals. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadRentals(); 
  }, []);

  const updateStatus = async (id, status) => {
    setActionLoadingId(id);
    try {
      await api.put(`/admin/rentals/${id}`, { status });
      loadRentals();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update rental.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const cancelRental = (id) => {
    if (!window.confirm('Are you sure you want to cancel this rental request?')) return;
    updateStatus(id, 'Cancelled');
  };

  const openDamageModal = (rental) => {
    setDamageTarget(rental);
    setDamageNote(rental.damageNote || '');
    setDamageError('');
    setDamageModal(true);
  };

  const submitDamage = async () => {
    if (!damageNote.trim()) {
      setDamageError('Please describe the damage before saving');
      return;
    }
    setActionLoadingId(damageTarget._id);
    try {
      await api.put(`/admin/rentals/${damageTarget._id}`, { 
        damageNote: damageNote.trim(), 
        hasDamage: true 
      });
      setDamageModal(false);
      loadRentals();
    } catch (err) {
      setDamageError(err.response?.data?.message || 'Failed to save damage note.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      display: 'inline-block',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      letterSpacing: '0.3px'
    };

    if (status === 'Active') return { ...styles, backgroundColor: theme.colors.successBg, color: theme.colors.success };
    if (status === 'Pending') return { ...styles, backgroundColor: theme.colors.warningBg, color: theme.colors.warning };
    if (status === 'Returned') return { ...styles, backgroundColor: theme.colors.infoBg, color: theme.colors.info };
    if (status === 'Cancelled' || status === 'Overdue') return { ...styles, backgroundColor: theme.colors.errorBg, color: theme.colors.error };
    return styles;
  };

  const getButtonStyle = (type, isLoading, hoverKey) => {
    const baseStyle = {
      border: 'none',
      borderRadius: theme.radius.sm,
      padding: '6px 16px',
      fontWeight: '600',
      fontSize: '0.85rem',
      transition: 'all 0.2s ease',
      boxShadow: 'none',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      opacity: isLoading ? 0.6 : 1,
      whiteSpace: 'nowrap'
    };

    if (type === 'approve') {
      return {
        ...baseStyle,
        backgroundColor: btnHovers[hoverKey] ? theme.colors.successHover : theme.colors.success,
        color: '#FFFFFF'
      };
    }
    if (type === 'return') {
      return {
        ...baseStyle,
        backgroundColor: btnHovers[hoverKey] ? theme.colors.infoHover : theme.colors.info,
        color: '#FFFFFF'
      };
    }
    if (type === 'damage') {
      return {
        ...baseStyle,
        backgroundColor: btnHovers[hoverKey] ? theme.colors.errorHover : theme.colors.error,
        color: '#FFFFFF'
      };
    }
    if (type === 'cancel') {
      return {
        ...baseStyle,
        backgroundColor: btnHovers[hoverKey] ? theme.colors.textMuted : 'transparent',
        color: btnHovers[hoverKey] ? '#FFFFFF' : theme.colors.textMuted,
        border: `1.5px solid ${theme.colors.border}`
      };
    }
    return baseStyle;
  };

  const filtered = filter === 'All' ? rentals : rentals.filter(r => r.status === filter);

  const handleBtnHover = (key, isHovering) => {
    setBtnHovers(prev => ({ ...prev, [key]: isHovering }));
  };

  return (
    <div style={{ backgroundColor: theme.colors.bg, minHeight: '100vh', width: '100%', padding: '40px 20px', boxSizing: 'border-box' }}>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px', 
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h3 style={{ 
            color: theme.colors.primary, 
            fontFamily: "'Playfair Display', Georgia, serif", 
            fontWeight: '700', 
            fontSize: '1.8rem',
            letterSpacing: '0.5px',
            margin: 0 
          }}>
            Rentals Management
          </h3>
          <p style={{ color: theme.colors.textMuted, fontSize: '0.95rem', marginTop: '8px', marginBottom: 0 }}>
            Manage and monitor all customer rental requests.
          </p>
        </div>
        
        <Form.Select 
          value={filter} 
          onChange={e => setFilter(e.target.value)}
          style={{ ...inputStyle, maxWidth: '200px' }}
        >
          {STATUS_FILTERS.map(s => <option key={s} value={s}>{s}</option>)}
        </Form.Select>
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

      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px',
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
          <p style={{ color: theme.colors.textMuted, fontSize: '0.95rem', margin: 0 }}>Loading rentals...</p>
        </div>
      ) : (
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
                {['User', 'Product', 'Tenure', 'Status', 'Damage', 'Actions'].map((heading, idx) => (
                  <th key={idx} style={{ 
                    padding: '16px 20px', 
                    color: theme.colors.text, 
                    fontWeight: '600', 
                    fontSize: '0.9rem', 
                    letterSpacing: '0.5px',
                    borderBottom: `2px solid ${theme.colors.border}`,
                    textAlign: idx === 5 ? 'center' : 'left',
                    whiteSpace: 'nowrap'
                  }}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr 
                  key={r._id}
                  onMouseEnter={() => setHoveredRow(r._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ 
                    backgroundColor: hoveredRow === r._id ? '#FAF9F6' : 'transparent',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <td style={{ 
                    padding: '16px 20px', 
                    borderBottom: `1px solid ${theme.colors.border}`, 
                    color: theme.colors.text, 
                    fontWeight: '500' 
                  }}>
                    {r.user?.name || 'N/A'}
                  </td>
                  <td style={{ 
                    padding: '16px 20px', 
                    borderBottom: `1px solid ${theme.colors.border}`, 
                    color: theme.colors.text 
                  }}>
                    {r.product?.name || 'N/A'}
                  </td>
                  <td style={{ 
                    padding: '16px 20px', 
                    borderBottom: `1px solid ${theme.colors.border}`, 
                    color: theme.colors.textMuted,
                    fontSize: '0.9rem'
                  }}>
                    {r.tenureMonths ? `${r.tenureMonths} months` : '—'}
                  </td>
                  <td style={{ 
                    padding: '16px 20px', 
                    borderBottom: `1px solid ${theme.colors.border}`
                  }}>
                    <span style={getStatusStyle(r.status)}>{r.status}</span>
                  </td>
                  <td style={{ 
                    padding: '16px 20px', 
                    borderBottom: `1px solid ${theme.colors.border}`
                  }}>
                    {r.hasDamage ? (
                      <span 
                        style={{ ...getStatusStyle('Cancelled'), cursor: 'help' }}
                        title={r.damageNote}
                      >
                        Flagged
                      </span>
                    ) : (
                      <span style={{ color: theme.colors.textMuted, fontSize: '0.9rem' }}>—</span>
                    )}
                  </td>
                  <td style={{ 
                    padding: '16px 20px', 
                    borderBottom: `1px solid ${theme.colors.border}`,
                    textAlign: 'center'
                  }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                      {r.status === 'Pending' && (
                        <Button 
                          size="sm"
                          disabled={actionLoadingId === r._id}
                          onMouseEnter={() => handleBtnHover(`approve-${r._id}`, true)}
                          onMouseLeave={() => handleBtnHover(`approve-${r._id}`, false)}
                          onClick={() => updateStatus(r._id, 'Active')}
                          style={getButtonStyle('approve', actionLoadingId === r._id, `approve-${r._id}`)}
                        >
                          {actionLoadingId === r._id ? 'Processing...' : 'Approve'}
                        </Button>
                      )}
                      {r.status === 'Active' && (
                        <>
                          <Button 
                            size="sm"
                            disabled={actionLoadingId === r._id}
                            onMouseEnter={() => handleBtnHover(`return-${r._id}`, true)}
                            onMouseLeave={() => handleBtnHover(`return-${r._id}`, false)}
                            onClick={() => updateStatus(r._id, 'Returned')}
                            style={getButtonStyle('return', actionLoadingId === r._id, `return-${r._id}`)}
                          >
                            Mark Returned
                          </Button>
                          <Button 
                            size="sm"
                            onMouseEnter={() => handleBtnHover(`damage-${r._id}`, true)}
                            onMouseLeave={() => handleBtnHover(`damage-${r._id}`, false)}
                            onClick={() => openDamageModal(r)}
                            style={getButtonStyle('damage', false, `damage-${r._id}`)}
                          >
                            Flag Damage
                          </Button>
                        </>
                      )}
                      {(r.status === 'Pending' || r.status === 'Active') && (
                        <Button 
                          size="sm"
                          disabled={actionLoadingId === r._id}
                          onMouseEnter={() => handleBtnHover(`cancel-${r._id}`, true)}
                          onMouseLeave={() => handleBtnHover(`cancel-${r._id}`, false)}
                          onClick={() => cancelRental(r._id)}
                          style={getButtonStyle('cancel', actionLoadingId === r._id, `cancel-${r._id}`)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ 
                    padding: '60px 20px', 
                    textAlign: 'center', 
                    color: theme.colors.textMuted 
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📋</div>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>No rentals match this filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      <Modal 
        show={damageModal} 
        onHide={() => setDamageModal(false)} 
        centered
      >
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(44, 36, 32, 0.6)', backdropFilter: 'blur(4px)',
          display: damageModal ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', zIndex: 1050
        }}>
          <div style={{
            backgroundColor: theme.colors.cardBg,
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.lifted,
            width: '100%', maxWidth: '500px', margin: '20px', overflow: 'hidden'
          }}>
            <Modal.Header closeButton style={{ borderBottom: `1px solid ${theme.colors.border}`, padding: '20px 24px' }}>
              <Modal.Title style={{ 
                color: theme.colors.primary, 
                fontFamily: "'Playfair Display', Georgia, serif", 
                fontWeight: '700', 
                fontSize: '1.3rem' 
              }}>
                Flag Damage / Return Issue
              </Modal.Title>
            </Modal.Header>
            
            <Modal.Body style={{ padding: '24px' }}>
              {damageError && (
                <Alert style={{ 
                  borderRadius: theme.radius.sm, 
                  border: `1px solid ${theme.colors.error}`, 
                  backgroundColor: theme.colors.errorBg, 
                  color: theme.colors.error, 
                  fontSize: '0.9rem', 
                  marginBottom: '20px',
                  padding: '12px 16px'
                }}>
                  {damageError}
                </Alert>
              )}
              
              {damageTarget && (
                <p style={{ color: theme.colors.textMuted, fontSize: '0.9rem', marginBottom: '16px' }}>
                  Flagging damage for: <strong style={{ color: theme.colors.text }}>{damageTarget.product?.name}</strong>
                </p>
              )}

              <Form.Group>
                <Form.Label style={{ fontWeight: '600', fontSize: '0.9rem', color: theme.colors.text, marginBottom: '8px', display: 'block' }}>
                  Describe the damage *
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={damageNote}
                  onChange={e => setDamageNote(e.target.value)}
                  isInvalid={!!damageError}
                  placeholder="e.g. Sofa fabric torn on left armrest, or table leg is broken..."
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                />
                {damageError && (
                  <div style={{ fontSize: '0.8rem', color: theme.colors.error, marginTop: '6px' }}>
                    {damageError}
                  </div>
                )}
              </Form.Group>
            </Modal.Body>
            
            <Modal.Footer style={{ borderTop: `1px solid ${theme.colors.border}`, padding: '16px 24px', backgroundColor: theme.colors.bg }}>
              <Button 
                variant="secondary" 
                onClick={() => setDamageModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: theme.colors.textMuted,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radius.sm,
                  padding: '8px 20px',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  boxShadow: 'none'
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={submitDamage} 
                disabled={actionLoadingId === damageTarget?._id}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.errorHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.error}
                style={{
                  backgroundColor: actionLoadingId === damageTarget?._id ? theme.colors.textMuted : theme.colors.error,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: theme.radius.sm,
                  padding: '8px 24px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  boxShadow: actionLoadingId === damageTarget?._id ? 'none' : '0 4px 12px rgba(198, 40, 40, 0.2)',
                  transition: 'all 0.2s ease',
                  cursor: actionLoadingId === damageTarget?._id ? 'not-allowed' : 'pointer'
                }}
              >
                {actionLoadingId === damageTarget?._id ? 'Saving...' : 'Save Damage Report'}
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
}