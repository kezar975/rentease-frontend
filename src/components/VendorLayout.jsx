import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

const theme = {
  colors: {
    primary: '#5D4037',
    primaryHover: '#4E342E',
    accent: '#8B5A2B',
    bg: '#FAF9F6',
    navbarBg: '#FFFFFF',
    text: '#2C2420',
    textMuted: '#8D7B6F',
    border: '#D7CCC8',
    error: '#C62828',
    errorHover: '#B71C1C'
  },
  shadows: {
    navbar: '0 4px 12px rgba(93, 64, 55, 0.04)'
  },
  radius: {
    sm: '8px',
    md: '12px'
  }
};

function VendorNavLink({ to, children, isActive, onClick, isLogout }) {
  const [hovered, setHovered] = useState(false);

  const baseStyle = {
    color: isLogout
      ? (hovered ? theme.colors.errorHover : theme.colors.error)
      : (isActive ? theme.colors.primary : (hovered ? theme.colors.primary : theme.colors.textMuted)),
    fontWeight: isActive ? '600' : '500',
    fontSize: '0.9rem',
    padding: '8px 16px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    position: 'relative',
    cursor: 'pointer',
    backgroundColor: isLogout && hovered ? 'rgba(198, 40, 40, 0.05)' : 'transparent',
    borderRadius: theme.radius.sm,
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
      {!isLogout && (
        <span style={{
          position: 'absolute',
          bottom: '2px',
          left: '16px',
          right: '16px',
          height: '2px',
          backgroundColor: theme.colors.accent,
          transform: (hovered || isActive) ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'center',
          transition: 'transform 0.3s ease',
          opacity: isActive ? 1 : (hovered ? 0.7 : 0)
        }} />
      )}
    </Nav.Link>
  );
}

export default function VendorLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const isActive = (path) => {
    if (path === '/vendor') return location.pathname === '/vendor';
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ backgroundColor: theme.colors.bg, minHeight: '100vh', width: '100%' }}>

      <Navbar
        expand="lg"
        style={{
          backgroundColor: theme.colors.navbarBg,
          borderBottom: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.navbar,
          padding: '10px 0',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          marginBottom: '0'
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
          <Navbar.Brand
            as={Link}
            to="/vendor"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: '700',
              fontSize: '1.3rem',
              color: theme.colors.primary,
              textDecoration: 'none',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0',
              marginRight: '40px'
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>🏪</span> Vendor Panel
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="vendor-navbar-nav"
            style={{ borderColor: theme.colors.border, color: theme.colors.primary }}
          />

          <Navbar.Collapse id="vendor-navbar-nav" style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
            <Nav className="align-items-center" style={{ display: 'flex', gap: '8px' }}>
              <VendorNavLink to="/vendor" isActive={isActive('/vendor') && !location.pathname.includes('/products') && !location.pathname.includes('/rentals') && !location.pathname.includes('/maintenance')}>
                Dashboard
              </VendorNavLink>
              <VendorNavLink to="/vendor/products" isActive={isActive('/vendor/products')}>
                Products
              </VendorNavLink>
              <VendorNavLink to="/vendor/rentals" isActive={isActive('/vendor/rentals')}>
                Rentals
              </VendorNavLink>
              <VendorNavLink to="/vendor/maintenance" isActive={isActive('/vendor/maintenance')}>
                Maintenance
              </VendorNavLink>

              <VendorNavLink onClick={handleLogout} isLogout>
                Logout
              </VendorNavLink>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>

      <div style={{
        height: '3px',
        background: `linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`,
        opacity: 0.6
      }} />

      <div style={{ padding: '40px 15px', width: '100%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}