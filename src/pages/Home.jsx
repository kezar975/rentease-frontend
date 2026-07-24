import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

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
    disabledBg: '#F5F5F5',
    disabledText: '#B0B0B0'
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

export default function Home() {
  const [ctaHover, setCtaHover] = useState(false);
  const [cardHovers, setCardHovers] = useState({ 0: false, 1: false, 2: false });
  const [btnHovers, setBtnHovers] = useState({ 0: false, 1: false });

  const handleCardHover = (index, isHovering) => {
    setCardHovers(prev => ({ ...prev, [index]: isHovering }));
  };

  const handleBtnHover = (index, isHovering) => {
    setBtnHovers(prev => ({ ...prev, [index]: isHovering }));
  };

  return (
    <Container style={{ backgroundColor: theme.colors.bg, minHeight: '100vh', padding: '80px 15px 60px' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px' }}>
        <h1 style={{ 
          color: theme.colors.primary, 
          fontFamily: "'Playfair Display', Georgia, serif", 
          fontWeight: '700', 
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          lineHeight: '1.2',
          marginBottom: '20px',
          letterSpacing: '-0.5px'
        }}>
          Rent Furniture & Appliances Monthly
        </h1>
        <p style={{ 
          color: theme.colors.textMuted, 
          fontSize: '1.15rem', 
          lineHeight: '1.6',
          marginBottom: '32px',
          maxWidth: '600px',
          margin: '0 auto 32px'
        }}>
          Affordable, flexible, and hassle-free rentals for students & professionals. 
          Elevate your space with our curated collection.
        </p>
        
        <Link 
          to="/products" 
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          style={{
            display: 'inline-block',
            backgroundColor: ctaHover ? theme.colors.primaryHover : theme.colors.primary,
            color: '#FFFFFF',
            borderRadius: theme.radius.sm,
            padding: '14px 36px',
            fontWeight: '600',
            fontSize: '1.05rem',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(93, 64, 55, 0.25)',
            transition: 'all 0.3s ease',
            transform: ctaHover ? 'translateY(-2px)' : 'translateY(0)'
          }}
        >
          Browse Catalog
        </Link>
      </div>
      
      <Row className="g-4">
        <Col md={4}>
          <Card 
            onMouseEnter={() => handleCardHover(0, true)}
            onMouseLeave={() => handleCardHover(0, false)}
            style={{
              backgroundColor: theme.colors.cardBg,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.md,
              boxShadow: cardHovers[0] ? theme.shadows.lifted : theme.shadows.soft,
              transform: cardHovers[0] ? 'translateY(-6px)' : 'translateY(0)',
              transition: 'all 0.3s ease',
              height: '100%',
              padding: '8px'
            }}
          >
            <Card.Body style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🛋️</div>
              <h4 style={{ 
                color: theme.colors.text, 
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: '700',
                marginBottom: '12px'
              }}>
                Premium Furniture
              </h4>
              <p style={{ color: theme.colors.textMuted, fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>
                Beds, Sofas, Dining Tables, Wardrobes & more.
              </p>
              <Link 
                to="/products?category=Furniture"
                onMouseEnter={() => handleBtnHover(0, true)}
                onMouseLeave={() => handleBtnHover(0, false)}
                style={{
                  display: 'inline-block',
                  backgroundColor: btnHovers[0] ? theme.colors.accent : 'transparent',
                  color: btnHovers[0] ? '#FFFFFF' : theme.colors.accent,
                  border: `2px solid ${theme.colors.accent}`,
                  borderRadius: theme.radius.sm,
                  padding: '8px 28px',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                View Collection
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card 
            onMouseEnter={() => handleCardHover(1, true)}
            onMouseLeave={() => handleCardHover(1, false)}
            style={{
              backgroundColor: theme.colors.cardBg,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.md,
              boxShadow: cardHovers[1] ? theme.shadows.lifted : theme.shadows.soft,
              transform: cardHovers[1] ? 'translateY(-6px)' : 'translateY(0)',
              transition: 'all 0.3s ease',
              height: '100%',
              padding: '8px'
            }}
          >
            <Card.Body style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📺</div>
              <h4 style={{ 
                color: theme.colors.text, 
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: '700',
                marginBottom: '12px'
              }}>
                Home Appliances
              </h4>
              <p style={{ color: theme.colors.textMuted, fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>
                Refrigerators, Smart TVs, Washing Machines, ACs.
              </p>
              <Link 
                to="/products?category=Appliance"
                onMouseEnter={() => handleBtnHover(1, true)}
                onMouseLeave={() => handleBtnHover(1, false)}
                style={{
                  display: 'inline-block',
                  backgroundColor: btnHovers[1] ? theme.colors.accent : 'transparent',
                  color: btnHovers[1] ? '#FFFFFF' : theme.colors.accent,
                  border: `2px solid ${theme.colors.accent}`,
                  borderRadius: theme.radius.sm,
                  padding: '8px 28px',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                View Collection
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card 
            onMouseEnter={() => handleCardHover(2, true)}
            onMouseLeave={() => handleCardHover(2, false)}
            style={{
              backgroundColor: theme.colors.cardBg,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.md,
              boxShadow: cardHovers[2] ? theme.shadows.lifted : theme.shadows.soft,
              transform: cardHovers[2] ? 'translateY(-6px)' : 'translateY(0)',
              transition: 'all 0.3s ease',
              height: '100%',
              padding: '8px'
            }}
          >
            <Card.Body style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🚚</div>
              <h4 style={{ 
                color: theme.colors.text, 
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: '700',
                marginBottom: '12px'
              }}>
                Delivery & Setup
              </h4>
              <p style={{ color: theme.colors.textMuted, fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>
                Free, hassle-free delivery and professional assembly within city limits.
              </p>
              <Button 
                variant="secondary" 
                disabled
                style={{
                  backgroundColor: theme.colors.disabledBg,
                  color: theme.colors.disabledText,
                  border: `2px solid ${theme.colors.border}`,
                  borderRadius: theme.radius.sm,
                  padding: '8px 28px',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: 'not-allowed'
                }}
              >
                Coming Soon
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}