import { useState, useEffect } from 'react';
import api from '../services/api';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
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
    warning: '#F57F17',
    warningBg: '#FFF8E1',
    error: '#C62828',
    errorBg: '#FFEBEE',
    info: '#1565C0',
    infoBg: '#E3F2FD'
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
  outline: 'none'
};

const STATUS_FILTERS = ['All', 'Pending', 'Active', 'Returned', 'Cancelled'];

export default function MyRentals() {
  const [rentals, setRentals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [issue, setIssue] = useState('');
  const [issueError, setIssueError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('All');
  
  const [hoveredRow, setHoveredRow] = useState(null);
  const [btnHover, setBtnHover] = useState(false);
  const [submitBtnHover, setSubmitBtnHover] = useState(false);

  useEffect(() => {
    api.get('/rentals/my').then(res => setRentals(res.data)).catch(console.error);
  }, []);

  const openMaintenance = (rental) => {
    setSelectedRental(rental);
    setIssue('');
    setIssueError('');
    setSubmitError('');
    setShowModal(true);
  };

  const validateIssue = (value) => {
    if (!value.trim()) return 'Please describe the issue';
    if (value.trim().length < 10) return 'Please provide at least 10 characters of detail';
    return '';
  };

  const submitMaintenance = async () => {
    const err = validateIssue(issue);
    setIssueError(err);
    if (err) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      await api.post(`/rentals/${selectedRental._id}/maintenance`, { issue: issue.trim() });
      setShowModal(false);
      setIssue('');
      alert('Maintenance request submitted successfully!');
      const res = await api.get('/rentals/my');
      setRentals(res.data);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
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
    if (status === 'Cancelled') return { ...styles, backgroundColor: theme.colors.errorBg, color: theme.colors.error };
    return styles;
  };

  const filteredRentals = filter === 'All' ? rentals : rentals.filter(r => r.status === filter);

  return (
    <div style={{ backgroundColor: theme.colors.bg, minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '32px', borderBottom: `2px solid ${theme.colors.border}`, paddingBottom: '16px' }}>
          <h3 style={{ 
            color: theme.colors.primary, 
            fontFamily: "'Playfair Display', Georgia, serif", 
            fontWeight: '700', 
            fontSize: '1.8rem',
            letterSpacing: '0.5px',
            margin: 0 
          }}>
            My Active Rentals
          </h3>
          <p style={{ color: theme.colors.textMuted, fontSize: '0.95rem', marginTop: '8px', marginBottom: 0 }}>
            Manage your current furniture and appliance rentals.
          </p>
        </div>

        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <Form.Select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ ...inputStyle, width: '200px' }}
          >
            {STATUS_FILTERS.map(s => (
              <option key={s} value={s}>{s === 'All' ? 'View All History' : s}</option>
            ))}
          </Form.Select>
        </div>
        {filteredRentals.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            backgroundColor: theme.colors.cardBg, 
            borderRadius: theme.radius.md, 
            border: `1px dashed ${theme.colors.border}` 
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🛋️</div>
            <h5 style={{ color: theme.colors.text, fontWeight: '600', marginBottom: '8px' }}>
              {filter === 'All' ? 'No active rentals' : `No ${filter.toLowerCase()} rentals`}
            </h5>
            <p style={{ color: theme.colors.textMuted }}>
              {filter === 'All' ? "You haven't rented any items yet. Browse our catalog to get started!" : `No rentals found with status "${filter}".`}
            </p>
          </div>
        ) : (
          <div style={{ 
            backgroundColor: theme.colors.cardBg, 
            borderRadius: theme.radius.md, 
            border: `1px solid ${theme.colors.border}`, 
            boxShadow: theme.shadows.soft, 
            overflow: 'hidden' 
          }}>
            <div style={{ overflowX: 'auto' }}>
              <Table style={{ margin: 0, borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr style={{ backgroundColor: theme.colors.tableHeader }}>
                    {['Product', 'Start Date', 'End Date', 'Status', 'Action'].map((heading, idx) => (
                      <th key={idx} style={{ 
                        padding: '16px 20px', 
                        color: theme.colors.text, 
                        fontWeight: '600', 
                        fontSize: '0.9rem', 
                        letterSpacing: '0.5px',
                        borderBottom: `2px solid ${theme.colors.border}`,
                        textAlign: idx === 4 ? 'right' : 'left',
                        whiteSpace: 'nowrap'
                      }}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRentals.map(r => (
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
                        {r.product?.name || 'N/A'}
                      </td>
                      <td style={{ 
                        padding: '16px 20px', 
                        borderBottom: `1px solid ${theme.colors.border}`, 
                        color: theme.colors.textMuted, 
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap'
                      }}>
                        {formatDate(r.startDate)}
                      </td>
                      <td style={{ 
                        padding: '16px 20px', 
                        borderBottom: `1px solid ${theme.colors.border}`, 
                        color: theme.colors.textMuted, 
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap'
                      }}>
                        {formatDate(r.endDate)}
                      </td>
                      <td style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.colors.border}` }}>
                        <span style={getStatusStyle(r.status)}>{r.status}</span>
                      </td>
                      <td style={{ 
                        padding: '16px 20px', 
                        borderBottom: `1px solid ${theme.colors.border}`,
                        textAlign: 'right'
                      }}>
                        {r.status === 'Active' && (
                          <Button 
                            size="sm"
                            onMouseEnter={() => setBtnHover(true)}
                            onMouseLeave={() => setBtnHover(false)}
                            onClick={() => openMaintenance(r)}
                            style={{
                              backgroundColor: btnHover ? theme.colors.accent : 'transparent',
                              color: btnHover ? '#FFFFFF' : theme.colors.accent,
                              border: `1.5px solid ${theme.colors.accent}`,
                              borderRadius: theme.radius.sm,
                              padding: '6px 16px',
                              fontWeight: '600',
                              fontSize: '0.85rem',
                              transition: 'all 0.2s ease',
                              boxShadow: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Request Maintenance
                          </Button>
                        )}
                        {(r.status === 'Returned' || r.status === 'Cancelled') && (
                          <span style={{ color: theme.colors.textMuted, fontSize: '0.85rem' }}>
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(44, 36, 32, 0.6)', backdropFilter: 'blur(4px)',
            display: showModal ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', zIndex: 1050
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
                  Maintenance Request
                </Modal.Title>
              </Modal.Header>
              
              <Modal.Body style={{ padding: '24px' }}>
                {submitError && (
                  <Alert style={{ 
                    borderRadius: theme.radius.sm, 
                    border: `1px solid ${theme.colors.error}`, 
                    backgroundColor: theme.colors.errorBg, 
                    color: theme.colors.error, 
                    fontSize: '0.9rem', 
                    marginBottom: '20px',
                    padding: '12px 16px'
                  }}>
                    {submitError}
                  </Alert>
                )}
                
                {selectedRental && (
                  <p style={{ color: theme.colors.textMuted, fontSize: '0.9rem', marginBottom: '16px' }}>
                    Requesting maintenance for: <strong style={{ color: theme.colors.text }}>{selectedRental.product?.name}</strong>
                  </p>
                )}

                <Form.Group>
                  <Form.Label style={{ fontWeight: '600', fontSize: '0.9rem', color: theme.colors.text, marginBottom: '8px', display: 'block' }}>
                    Describe the issue *
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={issue}
                    onChange={e => {
                      setIssue(e.target.value);
                      if (issueError) setIssueError(validateIssue(e.target.value));
                    }}
                    onBlur={() => setIssueError(validateIssue(issue))}
                    isInvalid={!!issueError}
                    placeholder="e.g. The sofa cushion is tearing, or the AC is not cooling properly..."
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                  />
                  {issueError && (
                    <div style={{ fontSize: '0.8rem', color: theme.colors.error, marginTop: '6px' }}>
                      {issueError}
                    </div>
                  )}
                </Form.Group>
              </Modal.Body>
              
              <Modal.Footer style={{ borderTop: `1px solid ${theme.colors.border}`, padding: '16px 24px', backgroundColor: theme.colors.bg }}>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowModal(false)}
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
                  onClick={submitMaintenance} 
                  disabled={submitting}
                  onMouseEnter={() => setSubmitBtnHover(true)}
                  onMouseLeave={() => setSubmitBtnHover(false)}
                  style={{
                    backgroundColor: submitting ? theme.colors.textMuted : (submitBtnHover ? theme.colors.primaryHover : theme.colors.primary),
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: theme.radius.sm,
                    padding: '8px 24px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    boxShadow: submitting ? 'none' : '0 4px 12px rgba(93, 64, 55, 0.2)',
                    transition: 'all 0.2s ease',
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </Modal.Footer>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}