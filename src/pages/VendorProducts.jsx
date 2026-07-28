import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import api from '../api/api';

const theme = {
  colors: {
    primary: '#5D4037',
    accent: '#8B5A2B',
    bg: '#FAF9F6',
    cardBg: '#FFFFFF',
    textMuted: '#8D7B6F',
    border: '#D7CCC8'
  },
  radius: { sm: '8px', md: '12px' }
};

const emptyForm = {
  name: '', category: '', subCategory: '', description: '',
  monthlyRent: '', securityDeposit: '', stock: 1
};

export default function VendorProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    try {
      const res = await api.get('/vendor/products');
      setProducts(res.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || '',
      category: product.category || '',
      subCategory: product.subCategory || '',
      description: product.description || '',
      monthlyRent: product.monthlyRent || '',
      securityDeposit: product.securityDeposit || '',
      stock: product.stock ?? 1
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        monthlyRent: Number(form.monthlyRent),
        securityDeposit: Number(form.securityDeposit),
        stock: Number(form.stock)
      };
      if (editingId) {
        await api.put(`/vendor/products/${editingId}`, payload);
      } else {
        await api.post('/vendor/products', payload);
      }
      setShowModal(false);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/vendor/products/${id}`);
      loadProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const statusColor = (status) => {
    if (status === 'Available') return 'success';
    if (status === 'Rented') return 'secondary';
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{
          color: theme.colors.primary,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: '700',
          margin: 0
        }}>
          My Products
        </h3>
        <Button
          onClick={openAddModal}
          style={{ backgroundColor: theme.colors.primary, border: 'none', borderRadius: theme.radius.sm }}
        >
          + Add Product
        </Button>
      </div>

      {error && <Alert variant="danger" style={{ borderRadius: theme.radius.sm }}>{error}</Alert>}

      <div style={{ backgroundColor: theme.colors.cardBg, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`, overflow: 'hidden' }}>
        <Table responsive hover style={{ marginBottom: 0 }}>
          <thead style={{ backgroundColor: theme.colors.bg }}>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Monthly Rent</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: theme.colors.textMuted, padding: '32px' }}>No products yet</td></tr>
            ) : products.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.monthlyRent}/mo</td>
                <td>{p.stock}</td>
                <td><Badge bg={statusColor(p.status)}>{p.status}</Badge></td>
                <td>
                  <Button size="sm" variant="outline-secondary" onClick={() => openEditModal(p)} style={{ marginRight: '8px' }}>Edit</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(p._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: theme.colors.primary }}>{editingId ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group style={{ marginBottom: '14px' }}>
              <Form.Label>Name</Form.Label>
              <Form.Control required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </Form.Group>
            <Form.Group style={{ marginBottom: '14px' }}>
              <Form.Label>Category</Form.Label>
              <Form.Control required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            </Form.Group>
            <Form.Group style={{ marginBottom: '14px' }}>
              <Form.Label>Sub Category</Form.Label>
              <Form.Control value={form.subCategory} onChange={e => setForm({ ...form, subCategory: e.target.value })} />
            </Form.Group>
            <Form.Group style={{ marginBottom: '14px' }}>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </Form.Group>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Form.Group style={{ marginBottom: '14px', flex: 1 }}>
                <Form.Label>Monthly Rent</Form.Label>
                <Form.Control required type="number" min={0} value={form.monthlyRent} onChange={e => setForm({ ...form, monthlyRent: e.target.value })} />
              </Form.Group>
              <Form.Group style={{ marginBottom: '14px', flex: 1 }}>
                <Form.Label>Security Deposit</Form.Label>
                <Form.Control required type="number" min={0} value={form.securityDeposit} onChange={e => setForm({ ...form, securityDeposit: e.target.value })} />
              </Form.Group>
              <Form.Group style={{ marginBottom: '14px', flex: 1 }}>
                <Form.Label>Stock</Form.Label>
                <Form.Control required type="number" min={0} value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" disabled={saving} style={{ backgroundColor: theme.colors.primary, border: 'none' }}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}