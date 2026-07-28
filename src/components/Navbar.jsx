import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navbar as BSNavbar, Nav } from 'react-bootstrap';

const theme = {
  colors: {
    primary: '#5D4037',
    primaryHover: '#4E342E',
    accent: '#8B5A2B',
    bg: '#FFFFFF',
    text: '#2C2420',
    textMuted: '#8D7B6F',
    border: '#D7CCC8',
  },
  shadows: {
    navbar: '0 4px 12px rgba(93, 64, 55, 0.04)'
  },
  radius: {
    sm: '8px',
    md: '12px'
  }
};

function StyledNavLink({ to, onClick, children, isActive }) {
  const [hovered, setHovered] = useState(false);

  const baseStyle = {
    color: hovered ? theme.colors.primary : (isActive ? theme.colors.primary : theme.colors.text),
    fontWeight: '500',
    fontSize: '0.95rem',
    padding: '8px 16px',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    position: 'relative',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  };

  return (
    <Nav.Link
      as={to ? Link : 'button'}
      to={to}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={baseStyle}
    >
      {children}
      <span style={{
        position: 'absolute',
        bottom: '4px',
        left: '16px',
        right: '16px',
        height: '2px',
        backgroundColor: theme.colors.accent,
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'center',
        transition: 'transform 0.3s ease'
      }} />
    </Nav.Link>
  );
}

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [btnHover, setBtnHover] = useState(false);

  const cartCount = (() => {
    try {
      const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');

      const cartKey = currentUser?._id || currentUser?.email
        ? `cart_${currentUser._id || currentUser.email}`
        : 'cart_guest';

      const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      return Array.isArray(cart) ? cart.length : 0;
    } catch {
      return 0;
    }
  })();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BSNavbar
      expand="lg"
      style={{
        backgroundColor: theme.colors.bg,
        borderBottom: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.navbar,
        padding: '12px 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>

        <BSNavbar.Brand
          as={Link}
          to="/"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: '700',
            fontSize: '1.6rem',
            color: theme.colors.primary,
            textDecoration: 'none',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginRight: '40px'
          }}
        >
          🪑 RentEase
        </BSNavbar.Brand>

        <BSNavbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{ borderColor: theme.colors.border, color: theme.colors.primary }}
        />

        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <StyledNavLink to="/products">Browse Catalog</StyledNavLink>

            {user ? (
              <>
                <StyledNavLink to="/my-rentals">My Rentals</StyledNavLink>

                {user.role === 'admin' && (
                  <StyledNavLink to="/admin">Admin</StyledNavLink>
                )}
                {user.role === 'vendor' && (
                  <StyledNavLink to="/vendor">Vendor Dashboard</StyledNavLink>
                )}

                <Nav.Link
                  as={Link}
                  to="/cart"
                  style={{
                    position: 'relative',
                    padding: '8px 12px',
                    fontSize: '1.2rem',
                    textDecoration: 'none',
                    color: theme.colors.text,
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.primary}
                  onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text}
                >
                  🛒
                  {cartCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '2px',
                      backgroundColor: theme.colors.primary,
                      color: '#FFFFFF',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '2px 6px',
                      borderRadius: '50%',
                      minWidth: '18px',
                      textAlign: 'center',
                      border: `2px solid ${theme.colors.bg}`,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      lineHeight: '1'
                    }}>
                      {cartCount}
                    </span>
                  )}
                </Nav.Link>

                <StyledNavLink onClick={handleLogout}>Logout</StyledNavLink>
              </>
            ) : (
              <>
                <StyledNavLink to="/login">Login</StyledNavLink>

                <Link
                  to="/register"
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  style={{
                    backgroundColor: btnHover ? theme.colors.primaryHover : theme.colors.primary,
                    color: '#FFFFFF',
                    borderRadius: theme.radius.sm,
                    padding: '8px 24px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    boxShadow: btnHover ? '0 4px 12px rgba(93, 64, 55, 0.25)' : 'none',
                    transition: 'all 0.25s ease',
                    marginLeft: '8px',
                    border: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </div>
    </BSNavbar>
  );
}