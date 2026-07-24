import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import furnitureHero from '../assets/hello.png';

const theme = {
  colors: {
    primary: '#5D4037', primaryHover: '#4E342E', accent: '#8B5A2B',
    bg: '#FAF9F6', cardBg: '#FFFFFF', text: '#2C2420', textMuted: '#8D7B6F',
    border: '#D7CCC8', error: '#C62828', errorBg: '#FFEBEE'
  },
  shadows: { card: '0 12px 32px rgba(93, 64, 55, 0.08)' },
  radius: { sm: '8px', md: '12px', lg: '16px' }
};

const inputStyle = {
  borderRadius: theme.radius.sm,
  border: `1px solid ${theme.colors.border}`,
  padding: '10px 14px',
  fontSize: '0.95rem',
  width: '100%'
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontWeight: '600',
  fontSize: '0.9rem',
  color: theme.colors.text
};

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [agreedError, setAgreedError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateAll = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    const agreeErr = agreed ? '' : 'You must agree to Terms';
    setAgreedError(agreeErr);

    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    return Object.keys(newErrors).length === 0 && !agreeErr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateAll()) return;
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <style>{`
        @media (max-width: 900px) {
          .register-hero-panel { display: none !important; }
          .register-form-panel { flex: 1 1 100% !important; }
        }
      `}</style>

      <div
        className="register-hero-panel"
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
            Join thousands of students & professionals renting furniture the smart way — no upfront cost, no long-term commitment.
          </p>
        </div>
      </div>
      <div
        className="register-form-panel"
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
                textAlign: 'center',
                marginBottom: '32px'
              }}>
                Create Account
              </h3>

              {error && <Alert variant="danger" style={{ marginBottom: '24px' }}>{error}</Alert>}

              <Form onSubmit={handleSubmit} noValidate>
                {/* Name and Phone - Two Columns */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <Form.Group>
                      <Form.Label style={labelStyle}>Full Name *</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="name" 
                        placeholder="John Doe"
                        value={formData.name} 
                        onChange={handleChange}
                        style={inputStyle}
                        isInvalid={touched.name && !!errors.name} 
                      />
                      {touched.name && errors.name && (
                        <div style={{ color: theme.colors.error, fontSize: '0.8rem', marginTop: '4px' }}>
                          {errors.name}
                        </div>
                      )}
                    </Form.Group>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Form.Group>
                      <Form.Label style={labelStyle}>Phone</Form.Label>
                      <Form.Control 
                        type="tel" 
                        name="phone" 
                        placeholder="9876543210"
                        value={formData.phone} 
                        onChange={handleChange}
                        style={inputStyle} 
                      />
                    </Form.Group>
                  </div>
                </div>
                <Form.Group style={{ marginBottom: '20px' }}>
                  <Form.Label style={labelStyle}>Email Address *</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email" 
                    placeholder="you@example.com"
                    value={formData.email} 
                    onChange={handleChange}
                    style={inputStyle}
                    isInvalid={touched.email && !!errors.email} 
                  />
                  {touched.email && errors.email && (
                    <div style={{ color: theme.colors.error, fontSize: '0.8rem', marginTop: '4px' }}>
                      {errors.email}
                    </div>
                  )}
                </Form.Group>

                <Form.Group style={{ marginBottom: '20px' }}>
                  <Form.Label style={labelStyle}>I am a *</Form.Label>
                  <Form.Select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="user">Customer (I want to rent/buy furniture)</option>
                    <option value="vendor">Vendor (I want to list my furniture)</option>
                  </Form.Select>
                </Form.Group>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <Form.Group>
                      <Form.Label style={labelStyle}>Password *</Form.Label>
                      <Form.Control 
                        type="password" 
                        name="password" 
                        placeholder="••••••••"
                        value={formData.password} 
                        onChange={handleChange}
                        style={inputStyle}
                        isInvalid={touched.password && !!errors.password} 
                      />
                      {touched.password && errors.password && (
                        <div style={{ color: theme.colors.error, fontSize: '0.8rem', marginTop: '4px' }}>
                          {errors.password}
                        </div>
                      )}
                      <Form.Text style={{ color: theme.colors.textMuted, fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                        Minimum 6 characters
                      </Form.Text>
                    </Form.Group>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Form.Group>
                      <Form.Label style={labelStyle}>Confirm Password *</Form.Label>
                      <Form.Control 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="••••••••"
                        value={formData.confirmPassword} 
                        onChange={handleChange}
                        style={inputStyle}
                        isInvalid={touched.confirmPassword && !!errors.confirmPassword} 
                      />
                      {touched.confirmPassword && errors.confirmPassword && (
                        <div style={{ color: theme.colors.error, fontSize: '0.8rem', marginTop: '4px' }}>
                          {errors.confirmPassword}
                        </div>
                      )}
                    </Form.Group>
                  </div>
                </div>

                <Form.Group style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      style={{ marginTop: '4px', cursor: 'pointer' }}
                    />
                    <div style={{ fontSize: '0.9rem', color: theme.colors.text }}>
                      I agree to the{' '}
                      <a href="/terms" style={{ color: theme.colors.accent, textDecoration: 'underline' }}>Terms of Service</a>
                      {' '}and{' '}
                      <a href="/privacy" style={{ color: theme.colors.accent, textDecoration: 'underline' }}>Privacy Policy</a>
                    </div>
                  </div>
                  {agreedError && (
                    <div style={{ color: theme.colors.error, fontSize: '0.8rem', marginTop: '4px' }}>
                      {agreedError}
                    </div>
                  )}
                </Form.Group>

                <Button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: theme.radius.sm,
                    backgroundColor: theme.colors.primary, 
                    borderColor: theme.colors.primary,
                    fontWeight: '600', 
                    fontSize: '1rem',
                    color: '#FFFFFF',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Creating account...' : 'Register'}
                </Button>
              </Form>

              <hr style={{ borderColor: theme.colors.border, margin: '32px 0' }} />

              <div style={{ textAlign: 'center', fontSize: '0.9rem', color: theme.colors.textMuted }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: theme.colors.accent, fontWeight: '600', textDecoration: 'none' }}>
                  Login here
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}