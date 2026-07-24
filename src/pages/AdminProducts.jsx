import { useState, useEffect } from 'react';
import api from '../services/api';
import { Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';

const theme = {
  colors: {
    primary: '#5D4037', primaryHover: '#4E342E', accent: '#8B5A2B', accentHover: '#6D4620',
    bg: '#FAF9F6', cardBg: '#FFFFFF', text: '#2C2420', textMuted: '#8D7B6F', border: '#D7CCC8',
    tableHeader: '#F5F0EB', success: '#2E7D32', successBg: '#E8F5E9', warning: '#F57F17',
    warningBg: '#FFF8E1', info: '#1565C0', infoBg: '#E3F2FD', error: '#C62828', errorHover: '#B71C1C', errorBg: '#FFEBEE'
  },
  shadows: { soft: '0 4px 12px rgba(93, 64, 55, 0.06)', lifted: '0 12px 24px rgba(93, 64, 55, 0.12)' },
  radius: { sm: '8px', md: '12px', lg: '16px' }
};

const inputStyle = {
  borderRadius: theme.radius.sm, border: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.bg, color: theme.colors.text, padding: '10px 14px',
  fontSize: '0.95rem', boxShadow: 'none', transition: 'border-color 0.2s ease', outline: 'none', width: '100%'
};

const labelStyle = { fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px', color: theme.colors.text, letterSpacing: '0.3px', display: 'block' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', subCategory: '', description: '', monthlyRent: '', securityDeposit: '', stock: 1, status: 'Available', tenureOptions: [{ months: '', discountPercent: '' }] });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [catError, setCatError] = useState('');
  const [savingCat, setSavingCat] = useState(false);
  
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatName, setEditCatName] = useState('');

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [hoveredRow, setHoveredRow] = useState(null);
  const [btnHovers, setBtnHovers] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products', { params: { limit: 100 } }),
        api.get('/categories')
      ]);
      setProducts(prodRes.data.products || prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      setError('Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: '', category: categories[0]?.name || '', subCategory: '', description: '', monthlyRent: '', securityDeposit: '', stock: 1, status: 'Available', tenureOptions: [{ months: '', discountPercent: '' }] });
    setImageFiles([]); setImagePreviews([]); setErrors({}); setSaveError('');
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || '', category: product.category || '', subCategory: product.subCategory || '',
      description: product.description || '', monthlyRent: product.monthlyRent ?? '', securityDeposit: product.securityDeposit ?? '',
      stock: product.stock ?? 1, status: product.status || 'Available',
      tenureOptions: product.tenureOptions?.length ? product.tenureOptions : [{ months: '', discountPercent: '' }]
    });
    if (product.images?.length > 0) setImagePreviews(product.images);
    else setImagePreviews([]);
    setImageFiles([]); setErrors({}); setSaveError(''); setShowModal(true);
  };

  const addTenureRow = () => setForm(prev => ({ ...prev, tenureOptions: [...prev.tenureOptions, { months: '', discountPercent: '' }] }));
  const removeTenureRow = (index) => setForm(prev => ({ ...prev, tenureOptions: prev.tenureOptions.filter((_, i) => i !== index) }));
  const handleTenureChange = (index, field, value) => {
    setForm(prev => {
      const updated = [...prev.tenureOptions];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, tenureOptions: updated };
    });
  };

  const handleSaveCategory = async () => {
    if (!newCategory.trim()) { setCatError('Category name is required'); return; }
    setSavingCat(true); setCatError('');
    try {
      const res = await api.post('/categories', { name: newCategory });
      setCategories(prev => [...prev, res.data]);
      setNewCategory('');
    } catch (err) {
      setCatError(err.response?.data?.message || 'Failed to add category');
    } finally {
      setSavingCat(false);
    }
  };

  const handleUpdateCategory = async (id) => {
    if (!editCatName.trim()) return;
    try {
      const res = await api.put(`/categories/${id}`, { name: editCatName });
      setCategories(prev => prev.map(c => c._id === id ? res.data : c));
      setEditingCatId(null);
      setEditCatName('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?\nNote: Existing products with this category will keep the text, but it will be removed from the dropdown.`)) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleSaveProduct = async () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.subCategory.trim()) newErrors.subCategory = 'Sub-category is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.monthlyRent || Number(form.monthlyRent) <= 0) newErrors.monthlyRent = 'Valid rent is required';
    if (imagePreviews.length === 0 && imageFiles.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true); setSaveError('');
    try {
      let uploadedImageUrls = [];
      if (imageFiles.length > 0) {
        setUploadingImages(true);
        const formData = new FormData();
        imageFiles.forEach(file => formData.append('images', file));
        const uploadRes = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        uploadedImageUrls = uploadRes.data.urls || uploadRes.data.files || [];
        setUploadingImages(false);
      }

      const allImages = [...imagePreviews.filter(url => !url.startsWith('blob:')), ...uploadedImageUrls];
      const payload = {
        name: form.name.trim(), category: form.category, subCategory: form.subCategory.trim(),
        description: form.description.trim(), monthlyRent: Number(form.monthlyRent),
        securityDeposit: Number(form.securityDeposit), images: allImages, stock: Number(form.stock),
        status: form.status,
        tenureOptions: form.tenureOptions.map(t => ({ months: Number(t.months) || 0, discountPercent: Number(t.discountPercent) || 0 }))
      };

      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post('/products', payload);
      
      setShowModal(false); loadData();
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save product.');
      setUploadingImages(false);
    } finally { setSaving(false); }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try { await api.delete(`/products/${product._id}`); loadData(); } catch (err) { alert('Failed to delete'); }
  };
  
  const toggleStatus = async (product) => {
    const nextStatus = product.status === 'Available' ? 'Maintenance' : 'Available';
    try { await api.put(`/products/${product._id}`, { status: nextStatus }); loadData(); } catch (err) { alert('Failed'); }
  };
  
  const getStatusStyle = (status) => {
    const base = { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' };
    if (status === 'Available') return { ...base, backgroundColor: theme.colors.successBg, color: theme.colors.success };
    if (status === 'Maintenance') return { ...base, backgroundColor: theme.colors.warningBg, color: theme.colors.warning };
    return { ...base, backgroundColor: theme.colors.infoBg, color: theme.colors.info };
  };
  
  const handleBtnHover = (key, isHovering) => setBtnHovers(prev => ({ ...prev, [key]: isHovering }));

  return (
    <div style={{ backgroundColor: theme.colors.bg, minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ color: theme.colors.primary, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: '700', fontSize: '1.8rem', margin: 0 }}>Product Catalog</h3>
          <p style={{ color: theme.colors.textMuted, fontSize: '0.95rem', marginTop: '8px' }}>Manage your inventory.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button onClick={() => setShowCatModal(true)} style={{ backgroundColor: 'transparent', color: theme.colors.accent, border: `1.5px solid ${theme.colors.accent}`, borderRadius: theme.radius.sm, padding: '8px 16px', fontWeight: '600', fontSize: '0.9rem' }}>
            ⚙️ Manage Categories
          </Button>
          <Button onClick={openAdd} onMouseEnter={() => handleBtnHover('add', true)} onMouseLeave={() => handleBtnHover('add', false)}
            style={{ backgroundColor: btnHovers['add'] ? theme.colors.primaryHover : theme.colors.primary, color: '#FFF', border: 'none', borderRadius: theme.radius.sm, padding: '8px 20px', fontWeight: '600', fontSize: '0.9rem' }}>
            + Add Product
          </Button>
        </div>
      </div>

      {loading ? <p style={{textAlign:'center', padding:'40px'}}>Loading...</p> : (
        <div style={{ backgroundColor: theme.colors.cardBg, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.soft, overflow: 'hidden' }}>
          <Table responsive style={{ margin: 0, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: theme.colors.tableHeader }}>
                {['', 'Name', 'Category', 'Rent', 'Deposit', 'Stock', 'Status', 'Actions'].map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', color: theme.colors.text, fontWeight: '600', fontSize: '0.85rem', borderBottom: `2px solid ${theme.colors.border}`, textAlign: i === 0 || i === 7 ? 'center' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} onMouseEnter={() => setHoveredRow(p._id)} onMouseLeave={() => setHoveredRow(null)} style={{ backgroundColor: hoveredRow === p._id ? '#FAF9F6' : 'transparent', transition: 'background-color 0.2s ease' }}>
                  <td style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.colors.border}`, textAlign: 'center' }}>
                    <img src={p.images?.[0] || 'https://via.placeholder.com/50'} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: theme.radius.sm }} />
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.colors.border}`, fontWeight: '500' }}>{p.name}</td>
                  <td style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.colors.border}`, color: theme.colors.textMuted }}>{p.category} · {p.subCategory}</td>
                  <td style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.colors.border}` }}>₹{p.monthlyRent}/mo</td>
                  <td style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.colors.border}`, color: theme.colors.textMuted }}>₹{p.securityDeposit}</td>
                  <td style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.colors.border}`, textAlign: 'center' }}>{p.stock}</td>
                  <td style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.colors.border}`, textAlign: 'center' }}>
                    <span style={getStatusStyle(p.status)} role="button" onClick={() => p.status !== 'Rented' && toggleStatus(p)}>{p.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.colors.border}`, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <Button size="sm" onClick={() => openEdit(p)} style={{ backgroundColor: 'transparent', color: theme.colors.accent, border: `1.5px solid ${theme.colors.accent}`, borderRadius: theme.radius.sm, padding: '4px 14px' }}>Edit</Button>
                      <Button size="sm" onClick={() => handleDelete(p)} style={{ backgroundColor: 'transparent', color: theme.colors.error, border: `1.5px solid ${theme.colors.error}`, borderRadius: theme.radius.sm, padding: '4px 14px' }}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showCatModal} onHide={() => { setShowCatModal(false); setEditingCatId(null); setEditCatName(''); setNewCategory(''); setCatError(''); }} centered size="md">
        <Modal.Header closeButton style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
          <Modal.Title style={{ color: theme.colors.primary, fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.2rem' }}>Manage Categories</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          
          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px dashed ${theme.colors.border}` }}>
            <Form.Label style={labelStyle}>Add New Category</Form.Label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Form.Control 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)} 
                placeholder="e.g., Electronics, Decor, Office" 
                style={inputStyle} 
              />
              <Button onClick={handleSaveCategory} disabled={savingCat} style={{ backgroundColor: theme.colors.primary, color: '#FFF', border: 'none', borderRadius: theme.radius.sm, padding: '0 20px', whiteSpace: 'nowrap' }}>
                {savingCat ? '...' : 'Add'}
              </Button>
            </div>
            {catError && <div style={{ color: theme.colors.error, fontSize: '0.8rem', marginTop: '4px' }}>{catError}</div>}
          </div>

          <Form.Label style={labelStyle}>Existing Categories</Form.Label>
          {categories.length === 0 ? (
            <p style={{ color: theme.colors.textMuted, fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>No categories added yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map(cat => (
                <div key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: theme.colors.bg, borderRadius: theme.radius.sm, border: `1px solid ${theme.colors.border}` }}>
                  {editingCatId === cat._id ? (
                    <>
                      <Form.Control 
                        size="sm"
                        value={editCatName}
                        onChange={(e) => setEditCatName(e.target.value)}
                        style={{ ...inputStyle, flex: 1 }}
                        autoFocus
                      />
                      <Button size="sm" onClick={() => handleUpdateCategory(cat._id)} style={{ backgroundColor: theme.colors.success, color: '#FFF', border: 'none', borderRadius: theme.radius.sm, padding: '4px 12px' }}>Save</Button>
                      <Button size="sm" variant="secondary" onClick={() => { setEditingCatId(null); setEditCatName(''); }} style={{ borderRadius: theme.radius.sm, padding: '4px 12px' }}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <span style={{ flex: 1, fontWeight: '500', color: theme.colors.text }}>{cat.name}</span>
                      <Button size="sm" variant="outline-primary" onClick={() => { setEditingCatId(cat._id); setEditCatName(cat.name); }} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Edit</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDeleteCategory(cat._id, cat.name)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Delete</Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(44, 36, 32, 0.6)', backdropFilter: 'blur(4px)', display: showModal ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
          <div style={{ backgroundColor: theme.colors.cardBg, borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.lifted, width: '100%', maxWidth: '1000px', margin: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <Modal.Header closeButton style={{ borderBottom: `1px solid ${theme.colors.border}`, padding: '16px 24px' }}>
              <Modal.Title style={{ color: theme.colors.primary, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: '700', fontSize: '1.3rem' }}>{editingId ? 'Edit Product' : 'Add New Product'}</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ padding: '0', overflowY: 'auto', display: 'flex' }}>
              {/* LEFT: Image Upload */}
              <div style={{ flex: '0 0 40%', backgroundColor: theme.colors.bg, padding: '24px', borderRight: `1px solid ${theme.colors.border}`, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ color: theme.colors.primary, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: '700', fontSize: '1.1rem', margin: '0 0 8px 0' }}>Product Images</h4>
                <div style={{ border: `2px dashed ${theme.colors.border}`, borderRadius: theme.radius.md, padding: '24px', textAlign: 'center', backgroundColor: theme.colors.cardBg, cursor: 'pointer' }} onClick={() => document.getElementById('imageUpload').click()}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📷</div>
                  <p style={{ color: theme.colors.textMuted, fontSize: '0.9rem', margin: '0 0 8px 0' }}>Click to upload images</p>
                  <input id="imageUpload" type="file" accept="image/*" multiple onChange={(e) => { const files = Array.from(e.target.files); setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]); setImageFiles(prev => [...prev, ...files]); }} style={{ display: 'none' }} />
                </div>
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={{ position: 'relative', borderRadius: theme.radius.sm, overflow: 'hidden', border: `1px solid ${theme.colors.border}` }}>
                    <img src={preview} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                    <button onClick={() => { setImagePreviews(prev => prev.filter((_, i) => i !== index)); setImageFiles(prev => prev.filter((_, i) => i !== index)); }} style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: theme.colors.error, color: '#FFF', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}>×</button>
                  </div>
                ))}
                {errors.images && <div style={{ color: theme.colors.error, fontSize: '0.85rem', textAlign: 'center' }}>{errors.images}</div>}
              </div>

              <div style={{ flex: '1 1 60%', padding: '24px' }}>
                {saveError && <Alert variant="danger" style={{ fontSize: '0.85rem', padding: '10px 14px' }}>{saveError}</Alert>}
                <Form noValidate>
                  <Row className="g-3" style={{ marginBottom: '16px' }}>
                    <Col md={12}>
                      <Form.Label style={labelStyle}>Product Name *</Form.Label>
                      <Form.Control size="sm" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} isInvalid={!!errors.name} placeholder="e.g. 3-Seater Fabric Sofa" style={inputStyle} />
                      {errors.name && <div style={{ fontSize: '0.75rem', color: theme.colors.error, marginTop: '4px' }}>{errors.name}</div>}
                    </Col>
                  </Row>

                  <Row className="g-3" style={{ marginBottom: '16px' }}>
                    <Col md={6}>
                      <Form.Label style={labelStyle}>Category *</Form.Label>
                      <Form.Select size="sm" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} isInvalid={!!errors.category} style={inputStyle}>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                      </Form.Select>
                      {errors.category && <div style={{ fontSize: '0.75rem', color: theme.colors.error, marginTop: '4px' }}>{errors.category}</div>}
                    </Col>
                    <Col md={6}>
                      <Form.Label style={labelStyle}>Sub-category *</Form.Label>
                      <Form.Control size="sm" value={form.subCategory} onChange={e => setForm(p => ({ ...p, subCategory: e.target.value }))} isInvalid={!!errors.subCategory} placeholder="e.g. Sofa, Fridge" style={inputStyle} />
                      {errors.subCategory && <div style={{ fontSize: '0.75rem', color: theme.colors.error, marginTop: '4px' }}>{errors.subCategory}</div>}
                    </Col>
                  </Row>

                  <div style={{ marginBottom: '16px' }}>
                    <Form.Label style={labelStyle}>Description *</Form.Label>
                    <Form.Control size="sm" as="textarea" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} isInvalid={!!errors.description} style={{ ...inputStyle, resize: 'vertical' }} />
                    {errors.description && <div style={{ fontSize: '0.75rem', color: theme.colors.error, marginTop: '4px' }}>{errors.description}</div>}
                  </div>

                  <Row className="g-3" style={{ marginBottom: '16px' }}>
                    <Col md={4}>
                      <Form.Label style={labelStyle}>Monthly Rent (₹) *</Form.Label>
                      <Form.Control size="sm" type="number" value={form.monthlyRent} onChange={e => setForm(p => ({ ...p, monthlyRent: e.target.value }))} isInvalid={!!errors.monthlyRent} style={inputStyle} />
                      {errors.monthlyRent && <div style={{ fontSize: '0.75rem', color: theme.colors.error, marginTop: '4px' }}>{errors.monthlyRent}</div>}
                    </Col>
                    <Col md={4}>
                      <Form.Label style={labelStyle}>Deposit (₹) *</Form.Label>
                      <Form.Control size="sm" type="number" value={form.securityDeposit} onChange={e => setForm(p => ({ ...p, securityDeposit: e.target.value }))} isInvalid={!!errors.securityDeposit} style={inputStyle} />
                      {errors.securityDeposit && <div style={{ fontSize: '0.75rem', color: theme.colors.error, marginTop: '4px' }}>{errors.securityDeposit}</div>}
                    </Col>
                    <Col md={4}>
                      <Form.Label style={labelStyle}>Stock *</Form.Label>
                      <Form.Control size="sm" type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} isInvalid={!!errors.stock} style={inputStyle} />
                    </Col>
                  </Row>

                  <div style={{ marginBottom: '16px' }}>
                    <Form.Label style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      Tenure Options *
                      <Button size="sm" variant="outline-primary" onClick={addTenureRow} style={{ fontSize: '0.75rem', padding: '2px 10px', border: `1px solid ${theme.colors.accent}`, color: theme.colors.accent, borderRadius: theme.radius.sm }}>+ Add</Button>
                    </Form.Label>
                    {form.tenureOptions.map((t, i) => (
                      <Row key={i} className="g-2 align-items-center" style={{ marginBottom: '8px' }}>
                        <Col xs={6}>
                          <Form.Control size="sm" type="number" placeholder="e.g., 3" value={t.months} onChange={e => handleTenureChange(i, 'months', e.target.value)} style={inputStyle} />
                        </Col>
                        <Col xs={4}>
                          <Form.Control size="sm" type="number" placeholder="e.g., 10" value={t.discountPercent} onChange={e => handleTenureChange(i, 'discountPercent', e.target.value)} style={inputStyle} />
                        </Col>
                        <Col xs={2}>
                          {form.tenureOptions.length > 1 && <Button size="sm" variant="outline-danger" onClick={() => removeTenureRow(i)} style={{ padding: '4px 8px', border: `1px solid ${theme.colors.error}`, color: theme.colors.error, borderRadius: theme.radius.sm, width: '100%' }}>✕</Button>}
                        </Col>
                      </Row>
                    ))}
                  </div>

                  <div>
                    <Form.Label style={labelStyle}>Status</Form.Label>
                    <Form.Select size="sm" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={inputStyle}>
                      <option>Available</option>
                      <option>Maintenance</option>
                    </Form.Select>
                  </div>
                </Form>
              </div>
            </Modal.Body>

            <Modal.Footer style={{ borderTop: `1px solid ${theme.colors.border}`, padding: '16px 24px', backgroundColor: theme.colors.bg }}>
              <Button variant="secondary" onClick={() => setShowModal(false)} style={{ borderRadius: theme.radius.sm }}>Cancel</Button>
              <Button onClick={handleSaveProduct} disabled={saving || uploadingImages} style={{ backgroundColor: theme.colors.primary, color: '#FFF', border: 'none', borderRadius: theme.radius.sm, padding: '8px 20px' }}>
                {uploadingImages ? 'Uploading...' : (saving ? 'Saving...' : 'Save Product')}
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
}