import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const theme = {
  colors: {
    primary: '#5D4037',      
    primaryHover: '#4E342E', 
    accent: '#8B5A2B',        
    accentHover: '#6D4620',   
    cardBg: '#FFFFFF',        
    text: '#2C2420',         
    textMuted: '#8D7B6F',     
    border: '#D7CCC8',       
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

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: theme.colors.cardBg,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.md,
        boxShadow: isHovered ? theme.shadows.lifted : theme.shadows.soft,
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <Card.Img 
          variant="top" 
          src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=Premium+Furniture'} 
          style={{ 
            height: '220px', 
            objectFit: 'cover', 
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }} 
        />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: isHovered ? 'rgba(93, 64, 55, 0.05)' : 'transparent',
          transition: 'background-color 0.3s ease'
        }} />
      </div>

      <Card.Body style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        <div style={{ 
          color: theme.colors.textMuted, 
          fontSize: '0.75rem', 
          fontWeight: '600', 
          letterSpacing: '0.8px', 
          textTransform: 'uppercase',
          marginBottom: '6px' 
        }}>
          {product.category} • {product.subCategory}
        </div>

        <Card.Title style={{ 
          color: theme.colors.text, 
          fontFamily: "'Playfair Display', Georgia, serif", 
          fontWeight: '700', 
          fontSize: '1.15rem', 
          lineHeight: '1.3',
          marginBottom: '12px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.name}
        </Card.Title>

        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: `1px solid ${theme.colors.border}` }}>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'baseline', 
            gap: '4px',
            marginBottom: '4px'
          }}>
            <span style={{ 
              color: theme.colors.primary, 
              fontFamily: "'Playfair Display', Georgia, serif", 
              fontWeight: '700', 
              fontSize: '1.5rem' 
            }}>
              {formatCurrency(product.monthlyRent)}
            </span>
            <span style={{ color: theme.colors.textMuted, fontSize: '0.9rem', fontWeight: '500' }}>
              /mo
            </span>
          </div>

          <p style={{ 
            color: theme.colors.textMuted, 
            fontSize: '0.85rem', 
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>
            + {formatCurrency(product.securityDeposit)} refundable deposit
          </p>

\          <Link 
            to={`/product/${product._id}`}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '10px 16px',
              borderRadius: theme.radius.sm,
              backgroundColor: btnHover ? theme.colors.primaryHover : theme.colors.primary,
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: btnHover ? '0 4px 12px rgba(93, 64, 55, 0.25)' : 'none',
              transition: 'all 0.25s ease',
              border: 'none'
            }}
          >
            View Details
            <span style={{ marginLeft: '6px', transition: 'transform 0.25s ease', transform: btnHover ? 'translateX(4px)' : 'translateX(0)' }}>
              →
            </span>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}