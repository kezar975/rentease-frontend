import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Table, Button, Alert } from 'react-bootstrap';

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
    error: '#C62828',
    errorHover: '#B71C1C',
    errorBg: '#FFEBEE',
    infoBg: '#FFF8E1',
    infoText: '#F57F17'
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

const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredRemove, setHoveredRemove] = useState(null);
  const [btnHover, setBtnHover] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const cartKey = user._id || user.email ? `cart_${user._id || user.email}` : 'cart_guest';
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem(cartKey) || '[]'));
  }, [cartKey]);
  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem(cartKey, JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => {
    const rent = item.finalAmount || item.finalRent || 0;
    const deposit = item.deposit || 0;
    return sum + rent + deposit;
  }, 0);

  return (
    <div style={{ 
      backgroundColor: theme.colors.bg, 
      minHeight: '100vh', 
      padding: '60px 15px 80px',
      width: '100%'
    }}>
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
            Your Cart
          </h3>
          <p style={{ color: theme.colors.textMuted, fontSize: '0.95rem', marginTop: '8px', marginBottom: 0 }}>
            Review your selected furniture and appliances before checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            backgroundColor: theme.colors.cardBg, 
            borderRadius: theme.radius.md, 
            border: `1px dashed ${theme.colors.border}`,
            boxShadow: theme.shadows.soft
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
            <h5 style={{ color: theme.colors.text, fontWeight: '600', marginBottom: '8px' }}>Your cart is empty</h5>
            <p style={{ color: theme.colors.textMuted, marginBottom: '24px' }}>
              Looks like you haven't added any rental items yet.
            </p>
            <Link 
              to="/products"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              style={{
                display: 'inline-block',
                backgroundColor: theme.colors.primary,
                color: '#FFFFFF',
                borderRadius: theme.radius.sm,
                padding: '10px 28px',
                fontWeight: '600',
                fontSize: '0.95rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(93, 64, 55, 0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <>
            <div style={{ 
              backgroundColor: theme.colors.cardBg, 
              borderRadius: theme.radius.md, 
              border: `1px solid ${theme.colors.border}`, 
              boxShadow: theme.shadows.soft, 
              overflow: 'hidden',
              marginBottom: '32px'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <Table style={{ margin: 0, borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr style={{ backgroundColor: theme.colors.tableHeader }}>
                      {['Item', 'Tenure', 'Rental Amount', 'Security Deposit', 'Action'].map((heading, idx) => (
                        <th key={idx} style={{ 
                          padding: '16px 20px', 
                          color: theme.colors.text, 
                          fontWeight: '600', 
                          fontSize: '0.9rem', 
                          letterSpacing: '0.5px',
                          borderBottom: `2px solid ${theme.colors.border}`,
                          textAlign: idx >= 2 ? 'right' : 'left',
                          whiteSpace: 'nowrap'
                        }}>
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, idx) => (
                      <tr 
                        key={idx}
                        onMouseEnter={() => setHoveredRow(idx)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{ 
                          backgroundColor: hoveredRow === idx ? '#FAF9F6' : 'transparent',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <td style={{ 
                          padding: '16px 20px', 
                          borderBottom: `1px solid ${theme.colors.border}`, 
                          color: theme.colors.text, 
                          fontWeight: '600',
                          minWidth: '200px'
                        }}>
                          {item.name}
                        </td>
                        <td style={{ 
                          padding: '16px 20px', 
                          borderBottom: `1px solid ${theme.colors.border}`, 
                          color: theme.colors.textMuted,
                          textAlign: 'center',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.tenure} Months
                        </td>
                        <td style={{ 
                          padding: '16px 20px', 
                          borderBottom: `1px solid ${theme.colors.border}`, 
                          color: theme.colors.text,
                          textAlign: 'right',
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: '1.05rem',
                          whiteSpace: 'nowrap'
                        }}>
                          {formatCurrency(item.finalAmount || item.finalRent)}
                        </td>
                        <td style={{ 
                          padding: '16px 20px', 
                          borderBottom: `1px solid ${theme.colors.border}`, 
                          color: theme.colors.textMuted,
                          textAlign: 'right',
                          fontSize: '0.95rem',
                          whiteSpace: 'nowrap'
                        }}>
                          {formatCurrency(item.deposit)}
                        </td>
                        <td style={{ 
                          padding: '16px 20px', 
                          borderBottom: `1px solid ${theme.colors.border}`, 
                          textAlign: 'right',
                          whiteSpace: 'nowrap'
                        }}>
                          <Button 
                            size="sm"
                            onMouseEnter={() => setHoveredRemove(idx)}
                            onMouseLeave={() => setHoveredRemove(null)}
                            onClick={() => removeItem(idx)}
                            style={{
                              backgroundColor: hoveredRemove === idx ? theme.colors.error : 'transparent',
                              color: hoveredRemove === idx ? '#FFFFFF' : theme.colors.error,
                              border: `1.5px solid ${theme.colors.error}`,
                              borderRadius: theme.radius.sm,
                              padding: '6px 16px',
                              fontWeight: '600',
                              fontSize: '0.85rem',
                              transition: 'all 0.2s ease',
                              boxShadow: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>

            <div style={{ 
              backgroundColor: theme.colors.cardBg, 
              borderRadius: theme.radius.md, 
              border: `1px solid ${theme.colors.border}`, 
              boxShadow: theme.shadows.soft, 
              padding: '24px 32px',
              maxWidth: '400px',
              marginLeft: 'auto'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: `1px dashed ${theme.colors.border}`
              }}>
                <span style={{ color: theme.colors.text, fontWeight: '600', fontSize: '1.1rem' }}>
                  Total Estimated Cost:
                </span>
                <span style={{ 
                  color: theme.colors.primary, 
                  fontWeight: '700', 
                  fontSize: '1.75rem', 
                  fontFamily: "'Playfair Display', Georgia, serif" 
                }}>
                  {formatCurrency(total)}
                </span>
              </div>
              
              <Button 
                onClick={() => navigate('/checkout')}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: theme.radius.sm,
                  backgroundColor: btnHover ? theme.colors.primaryHover : theme.colors.primary,
                  borderColor: theme.colors.primary,
                  color: '#FFFFFF',
                  fontWeight: '600',
                  fontSize: '1.05rem',
                  letterSpacing: '0.5px',
                  boxShadow: btnHover ? theme.shadows.lifted : '0 4px 12px rgba(93, 64, 55, 0.2)',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Proceed to Checkout
              </Button>
              
              <p style={{ 
                textAlign: 'center', 
                fontSize: '0.8rem', 
                color: theme.colors.textMuted, 
                marginTop: '16px', 
                marginBottom: 0 
              }}>
                🔒 Secure checkout. Free delivery & installation included.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}