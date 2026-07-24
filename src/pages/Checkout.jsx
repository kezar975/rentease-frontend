import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Card, Form, Button, Alert } from 'react-bootstrap';

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
    success: '#2E7D32',
    successBg: '#E8F5E9',
    error: '#C62828',
    errorBg: '#FFEBEE',
    info: '#1565C0',       
    infoBg: '#E3F2FD'      
  },
  shadows: {
    card: '0 12px 32px rgba(93, 64, 55, 0.08)',
    soft: '0 4px 12px rgba(93, 64, 55, 0.06)'
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
  width: '100%'
};

const labelStyle = {
  color: theme.colors.text,
  fontWeight: '600',
  fontSize: '0.9rem',
  marginBottom: '6px',
  letterSpacing: '0.3px',
  display: 'block'
};

const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

function CheckoutProductCard({ cartItem, product }) {
  const [imageError, setImageError] = useState(false);

  const totalRent = cartItem.finalRent || cartItem.finalAmount || 0;
  const deposit = cartItem.deposit || 0;
  const lineTotal = totalRent + deposit;

  const imageSrc = (!imageError && product?.images?.[0])
    ? product.images[0]
    : 'https://via.placeholder.com/400x300?text=Product+Image';

  return (
    <div style={{
      backgroundColor: theme.colors.cardBg,
      borderRadius: theme.radius.md,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: theme.shadows.soft,
      overflow: 'hidden',
      marginBottom: '20px',
      display: 'flex'
    }}>
      <img
        src={imageSrc}
        alt={product?.name || cartItem.name}
        onError={() => setImageError(true)}
        style={{
          width: '110px',
          height: '110px',
          objectFit: 'cover',
          flexShrink: 0
        }}
      />
      <div style={{ padding: '14px 16px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h5 style={{
            color: theme.colors.text,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: '700',
            fontSize: '1.05rem',
            margin: 0
          }}>
            {product?.name || cartItem.name}
          </h5>
          <span style={{
            color: theme.colors.primary,
            fontWeight: '700',
            fontSize: '1.05rem',
            fontFamily: "'Playfair Display', Georgia, serif",
            whiteSpace: 'nowrap',
            marginLeft: '12px'
          }}>
            {formatCurrency(lineTotal)}
          </span>
        </div>
        {product && (
          <p style={{ color: theme.colors.textMuted, fontSize: '0.8rem', margin: '2px 0 8px' }}>
            {product.category} • {product.subCategory}
          </p>
        )}
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: theme.colors.textMuted, flexWrap: 'wrap' }}>
          <span>{cartItem.tenure} months</span>
          <span>Rent: {formatCurrency(totalRent)}</span>
          <span>Deposit: {formatCurrency(deposit)}</span>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const [address, setAddress] = useState({ line1: '', city: '', state: '', pincode: '', date: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [productsById, setProductsById] = useState({});
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const cartKey = user._id || user.email ? `cart_${user._id || user.email}` : 'cart_guest';

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
        console.log('Cart from localStorage:', cartKey, cart);

        if (cart.length === 0) {
          setProductError('Your cart is empty. Please add a product first.');
          setProductLoading(false);
          return;
        }

        setCartItems(cart);

        const results = await Promise.all(
          cart.map(item =>
            api.get(`/products/${item.productId}`)
              .then(res => ({ id: item.productId, data: res.data }))
              .catch(err => {
                console.error(`Failed to fetch product ${item.productId}:`, err);
                return { id: item.productId, data: null };
              })
          )
        );

        const map = {};
        results.forEach(r => { map[r.id] = r.data; });
        setProductsById(map);
        setProductLoading(false);
      } catch (err) {
        console.error('Error loading checkout data:', err);
        setProductError(err.response?.data?.message || 'Failed to load product details');
        setProductLoading(false);
      }
    };

    loadCheckoutData();
  }, [cartKey]);

  const validate = (data) => {
    const newErrors = {};
    if (!data.date) newErrors.date = 'Delivery date is required';
    else if (new Date(data.date) < new Date(new Date().toDateString())) {
      newErrors.date = 'Delivery date cannot be in the past';
    }
    if (!data.line1.trim()) newErrors.line1 = 'Address is required';
    if (!data.city.trim()) newErrors.city = 'City is required';
    else if (!/^[a-zA-Z\s]+$/.test(data.city)) newErrors.city = 'City should only contain letters';
    if (!data.state.trim()) newErrors.state = 'State is required';
    else if (!/^[a-zA-Z\s]+$/.test(data.state)) newErrors.state = 'State should only contain letters';
    if (!data.pincode) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(data.pincode)) newErrors.pincode = 'Pincode must be exactly 6 digits';
    return newErrors;
  };

  const handleChange = (field, value) => {
    const updated = { ...address, [field]: value };
    setAddress(updated);
    if (touched[field]) setErrors(validate(updated));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate(address));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(address);
    setErrors(newErrors);
    setTouched({ date: true, line1: true, city: true, state: true, pincode: true });

    if (Object.keys(newErrors).length > 0) {
      setMsg('Please fix the errors below to proceed.');
      return;
    }

    setMsg('Processing your order...');
    setLoading(true);

    try {
      const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      if (cart.length === 0) throw new Error('Cart is empty');

      await Promise.all(
        cart.map(item =>
          api.post('/rentals', {
            productId: item.productId,
            tenureMonths: item.tenure,
            startDate: address.date,
            deliveryAddress: address
          })
        )
      );

      localStorage.removeItem(cartKey);
      setMsg(' Order placed successfully! Redirecting to your rentals...');
      setTimeout(() => navigate('/my-rentals'), 2000);
    } catch (err) {
      setMsg(' Failed: ' + (err.response?.data?.message || 'Server error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const isMsgSuccess = msg.includes('✅');
  const grandTotal = cartItems.reduce((sum, item) => {
    const rent = item.finalRent || item.finalAmount || 0;
    const deposit = item.deposit || 0;
    return sum + rent + deposit;
  }, 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <style>{`
        @media (max-width: 900px) {
          .checkout-product-panel { display: none !important; }
          .checkout-form-panel { flex: 1 1 100% !important; }
        }
      `}</style>
      <div
        className="checkout-product-panel"
        style={{
          flex: '0 0 45%',
          backgroundColor: theme.colors.bg,
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflowY: 'auto'
        }}
      >
        {productLoading ? (
          <div style={{ textAlign: 'center', color: theme.colors.textMuted }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', animation: 'pulse 2s infinite' }}>🪑</div>
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
            <p>Loading product details...</p>
          </div>
        ) : productError ? (
          <div style={{ textAlign: 'center', color: theme.colors.error }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
            <p>{productError}</p>
            <Button
              onClick={() => navigate('/products')}
              style={{
                marginTop: '16px',
                backgroundColor: theme.colors.primary,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: theme.radius.sm,
                padding: '8px 20px',
                cursor: 'pointer'
              }}
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div>
            <h3 style={{
              color: theme.colors.text,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: '700',
              fontSize: '1.4rem',
              marginBottom: '20px'
            }}>
              {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} in your order
            </h3>

            {cartItems.map((item, idx) => (
              <CheckoutProductCard
                key={idx}
                cartItem={item}
                product={productsById[item.productId]}
              />
            ))}

            <div style={{
              backgroundColor: theme.colors.cardBg,
              borderRadius: theme.radius.md,
              padding: '24px',
              boxShadow: theme.shadows.soft,
              marginTop: '12px'
            }}>
              <h4 style={{
                color: theme.colors.primary,
                fontWeight: '700',
                fontSize: '1.2rem',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: `2px solid ${theme.colors.border}`
              }}>
                Order Summary
              </h4>

              <div style={{
                paddingTop: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: theme.colors.text, fontWeight: '700', fontSize: '1.1rem' }}>
                  Total Payable
                </span>
                <span style={{
                  color: theme.colors.primary,
                  fontWeight: '700',
                  fontSize: '1.5rem',
                  fontFamily: "'Playfair Display', Georgia, serif"
                }}>
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🔒</span>
                <span style={{ fontSize: '0.85rem', color: theme.colors.textMuted }}>Secure Payment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🚚</span>
                <span style={{ fontSize: '0.85rem', color: theme.colors.textMuted }}>Free Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🛠️</span>
                <span style={{ fontSize: '0.85rem', color: theme.colors.textMuted }}>Free Installation</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="checkout-form-panel"
        style={{
          flex: '1 1 55%',
          backgroundColor: '#F5F0EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 24px'
        }}
      >
        <div style={{ width: '100%', maxWidth: '580px' }}>
          <Card style={{
            width: '100%',
            borderRadius: theme.radius.lg,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.card,
            backgroundColor: theme.colors.cardBg,
            overflow: 'hidden'
          }}>
            <div style={{ height: '4px', backgroundColor: theme.colors.primary }} />
            <Card.Body style={{ padding: '40px' }}>
              <h3 style={{
                color: theme.colors.primary,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: '700',
                letterSpacing: '0.5px',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                Delivery Details
              </h3>
              <p style={{
                color: theme.colors.textMuted,
                fontSize: '0.95rem',
                textAlign: 'center',
                marginBottom: '24px'
              }}>
                Please provide your delivery address to complete the rental.
              </p>

              <div style={{ 
                backgroundColor: theme.colors.infoBg,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radius.sm,
                padding: '12px 16px',
                marginBottom: '24px',
                fontSize: '0.85rem',
                color: theme.colors.textMuted,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>📍</span>
                <span>
                  <strong style={{ color: theme.colors.text }}>Service Areas:</strong> Currently delivering in Mumbai, Delhi, Bangalore, and Pune. Please ensure your pincode is serviceable.
                </span>
              </div>

              {msg && (
                <Alert style={{
                  borderRadius: theme.radius.sm,
                  border: `1px solid ${isMsgSuccess ? theme.colors.success : theme.colors.error}`,
                  backgroundColor: isMsgSuccess ? theme.colors.successBg : theme.colors.errorBg,
                  color: isMsgSuccess ? theme.colors.success : theme.colors.error,
                  fontSize: '0.9rem',
                  marginBottom: '24px',
                  padding: '12px 16px'
                }}>
                  {msg}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group style={{ marginBottom: '20px' }}>
                  <Form.Label style={labelStyle}>Preferred Delivery Date *</Form.Label>
                  <Form.Control
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={address.date}
                    onChange={e => handleChange('date', e.target.value)}
                    onBlur={() => handleBlur('date')}
                    isInvalid={touched.date && !!errors.date}
                    style={inputStyle}
                  />
                  {touched.date && errors.date && (
                    <div style={{ fontSize: '0.8rem', color: theme.colors.error, marginTop: '6px' }}>{errors.date}</div>
                  )}
                </Form.Group>

                <Form.Group style={{ marginBottom: '20px' }}>
                  <Form.Label style={labelStyle}>Address Line 1 *</Form.Label>
                  <Form.Control
                    placeholder="House/Flat No., Building, Street"
                    value={address.line1}
                    onChange={e => handleChange('line1', e.target.value)}
                    onBlur={() => handleBlur('line1')}
                    isInvalid={touched.line1 && !!errors.line1}
                    style={inputStyle}
                  />
                  {touched.line1 && errors.line1 && (
                    <div style={{ fontSize: '0.8rem', color: theme.colors.error, marginTop: '6px' }}>{errors.line1}</div>
                  )}
                </Form.Group>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <Form.Group>
                      <Form.Label style={labelStyle}>City *</Form.Label>
                      <Form.Control
                        placeholder="e.g. Mumbai"
                        value={address.city}
                        onChange={e => handleChange('city', e.target.value)}
                        onBlur={() => handleBlur('city')}
                        isInvalid={touched.city && !!errors.city}
                        style={inputStyle}
                      />
                      {touched.city && errors.city && (
                        <div style={{ fontSize: '0.8rem', color: theme.colors.error, marginTop: '6px' }}>{errors.city}</div>
                      )}
                    </Form.Group>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Form.Group>
                      <Form.Label style={labelStyle}>State *</Form.Label>
                      <Form.Control
                        placeholder="e.g. Maharashtra"
                        value={address.state}
                        onChange={e => handleChange('state', e.target.value)}
                        onBlur={() => handleBlur('state')}
                        isInvalid={touched.state && !!errors.state}
                        style={inputStyle}
                      />
                      {touched.state && errors.state && (
                        <div style={{ fontSize: '0.8rem', color: theme.colors.error, marginTop: '6px' }}>{errors.state}</div>
                      )}
                    </Form.Group>
                  </div>
                </div>

                <Form.Group style={{ marginBottom: '24px' }}>
                  <Form.Label style={labelStyle}>Pincode *</Form.Label>
                  <Form.Control
                    placeholder="e.g. 400001"
                    maxLength={6}
                    value={address.pincode}
                    onChange={e => handleChange('pincode', e.target.value.replace(/\D/g, ''))}
                    onBlur={() => handleBlur('pincode')}
                    isInvalid={touched.pincode && !!errors.pincode}
                    style={inputStyle}
                  />
                  {touched.pincode && errors.pincode && (
                    <div style={{ fontSize: '0.8rem', color: theme.colors.error, marginTop: '6px' }}>{errors.pincode}</div>
                  )}
                </Form.Group>

                <Button
                  type="submit"
                  disabled={loading || cartItems.length === 0}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: theme.radius.sm,
                    backgroundColor: (loading || cartItems.length === 0) ? theme.colors.textMuted : (btnHover ? theme.colors.primaryHover : theme.colors.primary),
                    borderColor: theme.colors.primary,
                    color: '#FFFFFF',
                    fontWeight: '600',
                    fontSize: '1.05rem',
                    letterSpacing: '0.5px',
                    boxShadow: (loading || cartItems.length === 0) ? 'none' : '0 4px 12px rgba(93, 64, 55, 0.2)',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    cursor: (loading || cartItems.length === 0) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Processing Order...' : 'Confirm & Pay'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}