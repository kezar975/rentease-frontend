import { useState, useEffect } from 'react';
import api from '../services/api';
import { Row, Col, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
    infoBg: '#E3F2FD',
    infoText: '#1565C0',
    warningBg: '#FFF8E1',
    warningText: '#F57F17'
  },
  shadows: {
    soft: '0 4px 12px rgba(93, 64, 55, 0.06)',
    lifted: '0 12px 24px rgba(93, 64, 55, 0.12)'
  },
  radius: {
    sm: '8px',
    md: '12px'
  }
};

const inputStyle = {
  borderRadius: theme.radius.sm,
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.cardBg,
  color: theme.colors.text,
  padding: '10px 14px',
  fontSize: '0.9rem',
  boxShadow: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  outline: 'none',
  width: '100%'
};

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  return (
    <div
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
      <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=Premium+Furniture'}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        <div style={{
          color: theme.colors.textMuted,
          fontSize: '0.7rem',
          fontWeight: '600',
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          marginBottom: '6px'
        }}>
          {product.category} • {product.subCategory}
        </div>

        <h5 style={{
          color: theme.colors.text,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: '700',
          fontSize: '1.05rem',
          lineHeight: '1.3',
          marginBottom: '12px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          margin: 0
        }}>
          {product.name}
        </h5>

        <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: `1px solid ${theme.colors.border}` }}>
          
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
              fontSize: '1.35rem'
            }}>
              {formatCurrency(product.monthlyRent)}
            </span>
            <span style={{ color: theme.colors.textMuted, fontSize: '0.85rem', fontWeight: '500' }}>
              /mo
            </span>
          </div>

          <p style={{
            color: theme.colors.textMuted,
            fontSize: '0.8rem',
            marginBottom: '12px',
            margin: '0 0 12px 0'
          }}>
            + {formatCurrency(product.securityDeposit)} deposit
          </p>

          <Link
            to={`/product/${product._id}`}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '8px 16px',
              borderRadius: theme.radius.sm,
              backgroundColor: btnHover ? theme.colors.primaryHover : theme.colors.primary,
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: '0.85rem',
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
      </div>
    </div>
  );
}

export default function BrowseProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ Categories state added
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', minRent: '', maxRent: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
            const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products', { params: filters }),
          api.get('/categories') 
        ]);
        
        setProducts(productsRes.data.products || []);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [filters]);

  return (
    <div style={{
      backgroundColor: theme.colors.bg,
      minHeight: '100vh',
      padding: '40px 15px',
      width: '100%'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '32px', borderBottom: `2px solid ${theme.colors.border}`, paddingBottom: '16px' }}>
          <h2 style={{
            color: theme.colors.primary,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: '700',
            fontSize: '2rem',
            letterSpacing: '0.5px',
            margin: 0
          }}>
            Browse Rentals
          </h2>
          <p style={{ color: theme.colors.textMuted, fontSize: '0.95rem', marginTop: '8px', marginBottom: 0 }}>
            Discover premium furniture and appliances for your space.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
            <Form.Select
              value={filters.category}
              onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </div>
          <div style={{ flex: '1 1 150px', minWidth: '120px' }}>
            <Form.Control
              placeholder="Min Rent (₹)"
              type="number"
              min="0"
              value={filters.minRent}
              onChange={e => setFilters(f => ({ ...f, minRent: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: '1 1 150px', minWidth: '120px' }}>
            <Form.Control
              placeholder="Max Rent (₹)"
              type="number"
              min="0"
              value={filters.maxRent}
              onChange={e => setFilters(f => ({ ...f, maxRent: e.target.value }))}
              style={inputStyle}
            />
          </div>
        </div>

        {loading ? (
          <Alert variant="info" style={{
            borderRadius: theme.radius.sm,
            border: `1px solid ${theme.colors.infoText}33`,
            backgroundColor: theme.colors.infoBg,
            color: theme.colors.infoText,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🪑</span> Loading our curated collection...
          </Alert>
        ) : products.length === 0 ? (
          <Alert variant="warning" style={{
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.warningText}33`,
            backgroundColor: theme.colors.warningBg,
            color: theme.colors.warningText,
            textAlign: 'center',
            padding: '40px 20px'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛋️</div>
            <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>No products found</h5>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Try adjusting your filters to discover more premium items.</p>
          </Alert>
        ) : (
          <Row className="g-4">
            {products.map(p => (
              <Col key={p._id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={p} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}