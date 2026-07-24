import { useState, useEffect } from 'react';
import api from '../services/api';
import { Table, Button, Form, Alert, Modal } from 'react-bootstrap';

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
    error: '#C62828',
    errorBg: '#FFEBEE',
    warning: '#F57F17',
    warningBg: '#FFF8E1'
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
  outline: 'none',
  cursor: 'pointer'
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('user');

  const [hoveredRow, setHoveredRow] = useState(null);
  const [btnHovers, setBtnHovers] = useState({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setActionLoadingId(userId);
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This cannot be undone.`)) return;
    
    setActionLoadingId(userId);
    try {
      await api.delete(`/admin/users/${userId}`);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowModal(true);
  };

  const filteredUsers = filter === 'All' ? users : users.filter(u => u.role === filter);

  const handleBtnHover = (key, isHovering) => {
    setBtnHovers(prev => ({ ...prev, [key]: isHovering }));
  };

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
            User Management
          </h3>
          <p style={{ color: theme.colors.textMuted, fontSize: '0.95rem', marginTop: '8px', marginBottom: 0 }}>
            Manage registered users and their roles.
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

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ 
              backgroundColor: theme.colors.cardBg, 
              padding: '16px 24px', 
              borderRadius: theme.radius.md,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.shadows.soft
            }}>
              <div style={{ fontSize: '0.85rem', color: theme.colors.textMuted, marginBottom: '4px' }}>Total Users</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: theme.colors.primary }}>{users.length}</div>
            </div>
            <div style={{ 
              backgroundColor: theme.colors.cardBg, 
              padding: '16px 24px', 
              borderRadius: theme.radius.md,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.shadows.soft
            }}>
              <div style={{ fontSize: '0.85rem', color: theme.colors.textMuted, marginBottom: '4px' }}>Admins</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: theme.colors.success }}>{users.filter(u => u.role === 'admin').length}</div>
            </div>
          </div>

          <Form.Select 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            style={{ ...inputStyle, width: '200px' }}
          >
            <option value="All">All Users</option>
            <option value="user">Customers</option>
            <option value="admin">Admins</option>
          </Form.Select>
        </div>

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
            <p style={{ color: theme.colors.textMuted, fontSize: '0.95rem', margin: 0 }}>Loading users...</p>
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
                    {['Name', 'Email', 'Phone', 'Role', 'Joined Date', 'Actions'].map((heading, idx) => (
                      <th key={idx} style={{ 
                        padding: '16px 20px', 
                        color: theme.colors.text, 
                        fontWeight: '600', 
                        fontSize: '0.9rem', 
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
                  {filteredUsers.map(u => (
                    <tr 
                      key={u._id}
                      onMouseEnter={() => setHoveredRow(u._id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{ 
                        backgroundColor: hoveredRow === u._id ? '#FAF9F6' : 'transparent',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <td style={{ 
                        padding: '16px 20px', 
                        borderBottom: `1px solid ${theme.colors.border}`, 
                        color: theme.colors.text, 
                        fontWeight: '500' 
                      }}>
                        {u.name || 'N/A'}
                      </td>
                      <td style={{ 
                        padding: '16px 20px', 
                        borderBottom: `1px solid ${theme.colors.border}`, 
                        color: theme.colors.text 
                      }}>
                        {u.email || 'N/A'}
                      </td>
                      <td style={{ 
                        padding: '16px 20px', 
                        borderBottom: `1px solid ${theme.colors.border}`, 
                        color: theme.colors.textMuted,
                        fontSize: '0.9rem'
                      }}>
                        {u.phone || '—'}
                      </td>
                      <td style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.colors.border}` }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          letterSpacing: '0.3px',
                          backgroundColor: u.role === 'admin' ? theme.colors.warningBg : theme.colors.successBg,
                          color: u.role === 'admin' ? theme.colors.warning : theme.colors.success
                        }}>
                          {u.role === 'admin' ? 'Admin' : 'Customer'}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '16px 20px', 
                        borderBottom: `1px solid ${theme.colors.border}`, 
                        color: theme.colors.textMuted,
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap'
                      }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                      <td style={{ 
                        padding: '16px 20px', 
                        borderBottom: `1px solid ${theme.colors.border}`,
                        textAlign: 'center'
                      }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <Button 
                            size="sm"
                            onMouseEnter={() => handleBtnHover(`role-${u._id}`, true)}
                            onMouseLeave={() => handleBtnHover(`role-${u._id}`, false)}
                            onClick={() => openRoleModal(u)}
                            style={{
                              backgroundColor: btnHovers[`role-${u._id}`] ? theme.colors.accent : 'transparent',
                              color: btnHovers[`role-${u._id}`] ? '#FFFFFF' : theme.colors.accent,
                              border: `1.5px solid ${theme.colors.accent}`,
                              borderRadius: theme.radius.sm,
                              padding: '6px 14px',
                              fontWeight: '600',
                              fontSize: '0.8rem',
                              transition: 'all 0.2s ease',
                              boxShadow: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Change Role
                          </Button>
                          <Button 
                            size="sm"
                            onMouseEnter={() => handleBtnHover(`del-${u._id}`, true)}
                            onMouseLeave={() => handleBtnHover(`del-${u._id}`, false)}
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            disabled={actionLoadingId === u._id}
                            style={{
                              backgroundColor: btnHovers[`del-${u._id}`] ? theme.colors.error : 'transparent',
                              color: btnHovers[`del-${u._id}`] ? '#FFFFFF' : theme.colors.error,
                              border: `1.5px solid ${theme.colors.error}`,
                              borderRadius: theme.radius.sm,
                              padding: '6px 14px',
                              fontWeight: '600',
                              fontSize: '0.8rem',
                              transition: 'all 0.2s ease',
                              boxShadow: 'none',
                              cursor: actionLoadingId === u._id ? 'not-allowed' : 'pointer',
                              opacity: actionLoadingId === u._id ? 0.6 : 1
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ 
                        padding: '60px 20px', 
                        textAlign: 'center', 
                        color: theme.colors.textMuted 
                      }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>👥</div>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}>No users found</p>
                      </td>
                    </tr>
                  )}
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
              width: '100%', maxWidth: '400px', margin: '20px', overflow: 'hidden'
            }}>
              <Modal.Header closeButton style={{ borderBottom: `1px solid ${theme.colors.border}`, padding: '20px 24px' }}>
                <Modal.Title style={{ 
                  color: theme.colors.primary, 
                  fontFamily: "'Playfair Display', Georgia, serif", 
                  fontWeight: '700', 
                  fontSize: '1.2rem' 
                }}>
                  Change User Role
                </Modal.Title>
              </Modal.Header>
              
              <Modal.Body style={{ padding: '24px' }}>
                {selectedUser && (
                  <>
                    <p style={{ color: theme.colors.textMuted, fontSize: '0.9rem', marginBottom: '16px' }}>
                      User: <strong style={{ color: theme.colors.text }}>{selectedUser.name}</strong>
                    </p>
                    <p style={{ color: theme.colors.textMuted, fontSize: '0.85rem', marginBottom: '16px' }}>
                      Email: {selectedUser.email}
                    </p>

                    <Form.Group>
                      <Form.Label style={{ fontWeight: '600', fontSize: '0.9rem', color: theme.colors.text, marginBottom: '8px', display: 'block' }}>
                        New Role
                      </Form.Label>
                      <Form.Select 
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        style={{ ...inputStyle }}
                      >
                        <option value="user">Customer</option>
                        <option value="admin">Admin</option>
                      </Form.Select>
                    </Form.Group>
                  </>
                )}
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
                  onClick={() => {
                    handleRoleChange(selectedUser._id, newRole);
                    setShowModal(false);
                  }}
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: theme.radius.sm,
                    padding: '8px 24px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 12px rgba(93, 64, 55, 0.2)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                >
                  Update Role
                </Button>
              </Modal.Footer>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}