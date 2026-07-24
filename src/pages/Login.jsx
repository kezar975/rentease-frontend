import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import furnitureHero from '../assets/hello.png';
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
    error: '#C62828',
    errorBg: '#FFEBEE'
  },
  shadows: {
    card: '0 12px 32px rgba(93, 64, 55, 0.08)'
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
  padding: '12px 16px',
  fontSize: '0.95rem',
  boxShadow: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  outline: 'none'
};

const labelStyle = {
  color: theme.colors.text,
  fontWeight: '600',
  fontSize: '0.9rem',
  marginBottom: '8px',
  letterSpacing: '0.3px',
  display: 'block'
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = (emailVal, passwordVal) => {
    const newErrors = {};
    if (!emailVal.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) newErrors.email = 'Enter a valid email address';

    if (!passwordVal) newErrors.password = 'Password is required';
    else if (passwordVal.length < 6) newErrors.password = 'Password must be at least 6 characters';

    return newErrors;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate(email, password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const newErrors = validate(email, password);
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await login(email, password);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        width: '100vw',
        maxWidth: '100vw',
        display: 'flex',
        minHeight: '80vh'
      }}
    >
      <style>{`
        @media (max-width: 900px) {
          .login-hero-panel { display: none !important; }
          .login-form-panel { flex: 1 1 100% !important; }
        }
      `}</style>

      <div
        className="login-hero-panel"
        style={{
          flex: '0 0 45%',
          position: 'relative',
          backgroundImage: `linear-gradient(180deg, rgba(44,36,32,0.5), rgba(44,36,32,0.78)), url(${furnitureHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px'
        }}
      >
        <div style={{ textAlign: 'center', color: theme.colors.bg, maxWidth: '380px' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            fontSize: '2.1rem',
            marginBottom: '14px',
            letterSpacing: '0.4px'
          }}>
            RentEase
          </h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.92, lineHeight: 1.6, margin: 0 }}>
            Furniture & appliances, rented monthly — no upfront cost, no long-term commitment.
          </p>
        </div>
      </div>

      <div
        className="login-form-panel"
        style={{
          flex: '1 1 55%',
          backgroundColor: '#F5F0EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 24px',
          position: 'relative'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px' }}>
          <Card style={{
            width: '100%',
            borderRadius: theme.radius.lg,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.card,
            backgroundColor: theme.colors.cardBg,
            overflow: 'hidden'
          }}>
            <div style={{ height: '4px', backgroundColor: theme.colors.primary }} />

            <Card.Body style={{ padding: '48px 40px' }}>
              <h3 style={{
                color: theme.colors.primary,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: '700',
                letterSpacing: '0.5px',
                marginBottom: '8px',
                textAlign: 'center',
                fontSize: '2rem'
              }}>
                Welcome Back
              </h3>

              <p style={{
                color: theme.colors.textMuted,
                textAlign: 'center',
                fontSize: '0.95rem',
                marginBottom: '32px'
              }}>
                Sign in to continue to RentEase
              </p>

              {error && (
                <Alert style={{
                  borderRadius: theme.radius.sm,
                  border: `1px solid ${theme.colors.error}`,
                  backgroundColor: theme.colors.errorBg,
                  color: theme.colors.error,
                  fontSize: '0.9rem',
                  marginBottom: '24px',
                  padding: '12px 16px'
                }}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group style={{ marginBottom: '24px' }}>
                  <Form.Label style={labelStyle}>Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    isInvalid={touched.email && !!errors.email}
                    style={inputStyle}
                  />
                  {touched.email && errors.email && (
                    <div style={{ fontSize: '0.8rem', color: theme.colors.error, marginTop: '6px' }}>
                      {errors.email}
                    </div>
                  )}
                </Form.Group>

                <Form.Group style={{ marginBottom: '28px' }}>
                  <Form.Label style={labelStyle}>Password *</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    isInvalid={touched.password && !!errors.password}
                    style={inputStyle}
                  />
                  {touched.password && errors.password && (
                    <div style={{ fontSize: '0.8rem', color: theme.colors.error, marginTop: '6px' }}>
                      {errors.password}
                    </div>
                  )}
                </Form.Group>

                <Button
                  type="submit"
                  disabled={loading}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: theme.radius.sm,
                    backgroundColor: loading ? theme.colors.textMuted : (btnHover ? theme.colors.primaryHover : theme.colors.primary),
                    borderColor: theme.colors.primary,
                    color: '#FFFFFF',
                    fontWeight: '600',
                    fontSize: '1.05rem',
                    letterSpacing: '0.5px',
                    boxShadow: loading ? 'none' : '0 4px 12px rgba(93, 64, 55, 0.2)',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginBottom: '20px'
                  }}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Link
                  to="/forgot-password"
                  style={{
                    color: theme.colors.accent,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.primary}
                  onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.accent}
                >
                  Forgot Password?
                </Link>
              </div>

              <div style={{
                height: '1px',
                backgroundColor: theme.colors.border,
                margin: '24px 0'
              }} />

              <div style={{ textAlign: 'center', fontSize: '0.95rem', color: theme.colors.textMuted }}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  style={{
                    color: theme.colors.accent,
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.primary}
                  onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.accent}
                >
                  Register here
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}