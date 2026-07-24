import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

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
    success: '#2E7D32',       
    successBg: '#E8F5E9',     
    error: '#C62828',         
    errorBg: '#FFEBEE'        
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

const formatCurrency = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [tenure, setTenure] = useState(3);
  const [loading, setLoading] = useState(true);
  const [btnHover, setBtnHover] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        // Set default tenure to the first available option if exists
        if (res.data.tenureOptions?.length > 0) {
          setTenure(res.data.tenureOptions[0].months);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container style={{ backgroundColor: theme.colors.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: theme.colors.textMuted }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🪑</div>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.2rem' }}>Fetching product details...</p>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container style={{ backgroundColor: theme.colors.bg, minHeight: '100vh', paddingTop: '60px' }}>
        <Alert style={{ 
          borderRadius: theme.radius.md, 
          border: `1px solid ${theme.colors.error}`, 
          backgroundColor: theme.colors.errorBg, 
          color: theme.colors.error,
          textAlign: 'center',
          padding: '32px'
        }}>
          <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Product Not Found</h5>
          <p style={{ margin: 0 }}>The item you are looking for might have been removed or is unavailable.</p>
        </Alert>
      </Container>
    );
  }

  const totalRent = product.monthlyRent * tenure;
  const selectedPlan = product.tenureOptions?.find(t => t.months === tenure);
  const discount = selectedPlan ? (totalRent * selectedPlan.discountPercent / 100) : 0;
  const finalRent = totalRent - discount;
  const grandTotal = finalRent + product.securityDeposit;

  const addToCart = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
   const cartKey = user._id || user.email ? `cart_${user._id || user.email}` : 'cart_guest';  
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]'); 
    cart.push({ 
      productId: product._id, 
      name: product.name, 
      tenure, 
      finalRent, 
      deposit: product.securityDeposit,
      grandTotal 
    });
    
    localStorage.setItem(cartKey, JSON.stringify(cart));
    navigate('/cart');
  };

  return (
    <Container style={{ backgroundColor: theme.colors.bg, minHeight: '100vh', padding: '40px 15px 80px' }}>
      <Row className="g-4" style={{ alignItems: 'flex-start' }}>
        
        <Col md={6}>
          <div style={{ 
            position: 'relative', 
            borderRadius: theme.radius.md, 
            overflow: 'hidden', 
            boxShadow: theme.shadows.soft,
            border: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.cardBg
          }}>
            <img 
              src={product.images?.[0] || 'https://via.placeholder.com/600x400?text=Furniture+Image'} 
              alt={product.name} 
              style={{ 
                width: '100%', 
                height: 'auto', 
                maxHeight: '500px', 
                objectFit: 'cover', 
                display: 'block' 
              }} 
            />
            <span style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: theme.colors.text,
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              letterSpacing: '0.5px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {product.category}
            </span>
          </div>
        </Col>
        <Col md={6}>
          <h2 style={{ 
            color: theme.colors.text, 
            fontFamily: "'Playfair Display', Georgia, serif", 
            fontWeight: '700', 
            fontSize: '2rem',
            marginBottom: '12px',
            lineHeight: '1.2'
          }}>
            {product.name}
          </h2>
          
          <p style={{ 
            color: theme.colors.textMuted, 
            fontSize: '1.05rem', 
            lineHeight: '1.6', 
            marginBottom: '32px' 
          }}>
            {product.description}
          </p>
          
          <Card style={{ 
            backgroundColor: theme.colors.cardBg, 
            border: `1px solid ${theme.colors.border}`, 
            borderRadius: theme.radius.md, 
            boxShadow: theme.shadows.soft,
            overflow: 'hidden'
          }}>
            <Card.Body style={{ padding: '28px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h5 style={{ 
                  color: theme.colors.primary, 
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: '700', 
                  fontSize: '1.75rem',
                  marginBottom: '4px'
                }}>
                  {formatCurrency(product.monthlyRent)} <span style={{ fontSize: '1rem', color: theme.colors.textMuted, fontWeight: '400' }}>/ month</span>
                </h5>
                <p style={{ color: theme.colors.textMuted, fontSize: '0.9rem', margin: 0 }}>
                  Refundable Security Deposit: <strong style={{ color: theme.colors.text }}>{formatCurrency(product.securityDeposit)}</strong>
                </p>
              </div>

              <Form.Group style={{ marginBottom: '24px' }}>
                <Form.Label style={{ fontWeight: '600', fontSize: '0.9rem', color: theme.colors.text, marginBottom: '8px', display: 'block' }}>
                  Select Rental Tenure
                </Form.Label>
                <Form.Select 
                  value={tenure} 
                  onChange={e => setTenure(Number(e.target.value))}
                  style={inputStyle}
                >
                  {product.tenureOptions?.map(t => (
                    <option key={t.months} value={t.months}>
                      {t.months} Months {t.discountPercent > 0 ? `— Save ${t.discountPercent}%` : ''}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div style={{ 
                borderTop: `1px dashed ${theme.colors.border}`, 
                margin: '24px 0', 
                paddingTop: '24px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: theme.colors.textMuted, fontSize: '0.95rem' }}>
                  <span>Base Rent ({tenure} months)</span>
                  <span>{formatCurrency(totalRent)}</span>
                </div>
                
                {discount > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px', 
                    color: theme.colors.success, 
                    fontWeight: '500',
                    fontSize: '0.95rem'
                  }}>
                    <span>Long-term Discount</span>
                    <span>- {formatCurrency(discount)}</span>
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '8px', 
                  color: theme.colors.textMuted, 
                  fontSize: '0.95rem'
                }}>
                  <span>Security Deposit</span>
                  <span>{formatCurrency(product.securityDeposit)}</span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderTop: `1px solid ${theme.colors.border}`, 
                  paddingTop: '16px', 
                  marginTop: '16px' 
                }}>
                  <span style={{ color: theme.colors.text, fontWeight: '700', fontSize: '1.1rem' }}>Total Payable</span>
                  <span style={{ color: theme.colors.primary, fontWeight: '700', fontSize: '1.5rem', fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={addToCart}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: theme.radius.sm,
                  backgroundColor: btnHover ? theme.colors.accentHover : theme.colors.accent,
                  borderColor: theme.colors.accent,
                  color: '#FFFFFF',
                  fontWeight: '600',
                  fontSize: '1.05rem',
                  letterSpacing: '0.5px',
                  boxShadow: btnHover ? theme.shadows.lifted : 'none',
                  transition: 'all 0.3s ease',
                  marginTop: '8px',
                  border: 'none'
                }}
              >
                Add to Cart & Proceed
              </Button>
              
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: theme.colors.textMuted, marginTop: '16px', marginBottom: 0 }}>
                🔒 Secure checkout. Free delivery & installation included.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}