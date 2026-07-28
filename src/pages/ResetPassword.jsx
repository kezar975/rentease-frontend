import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

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
  padding: '10px 14px',
  fontSize: '0.95rem',
  boxShadow: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  outline: 'none'
};

const labelStyle = {
  color: theme.colors.text,
  fontWeight: '600',
  fontSize: '0.9rem',
  marginBottom: '6px',
  letterSpacing: '0.3px'
};

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const validate = (data) => {
    const newErrors = {};
    if (!data.password) newErrors.password = 'Password is required';
    else if (data.password.length < 6) newErrors.password = 'Min 6 characters';
    if (data.password !== data.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    const newErrors = validate({ password, confirmPassword });
    setErrors(newErrors);
    setTouched({ password: true, confirmPassword: true });
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setMsg(res.data.message || 'Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{
      backgroundColor: theme.colors.bg,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 15px'
    }}>
      <Card style={{
        width: '100%',
        maxWidth: '450px',
        borderRadius: theme.radius.lg,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.card,
        backgroundColor: theme.colors.cardBg,
        overflow: 'hidden'
      }}>

        <div style={{ height: '4px', backgroundColor: theme.colors.primary }} />

        <Card.Body style={{ padding: '40px' }}>
          <h4 style={{
            color: theme.colors.primary,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: '700',
            letterSpacing: '0.5px',
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            Set New Password
          </h4>
          <p style={{
            color: theme.colors.textMuted,
            fontSize: '0.95rem',
            textAlign: 'center',
            marginBottom: '32px',
            lineHeight: '1.5'
          }}>
            Enter a new password for your RentEase account.
          </p>

          {msg && (
            <Alert style={{
              borderRadius: theme.radius.sm,
              border: `1px solid ${theme.colors.success}`,
              backgroundColor: theme.colors.successBg,
              color: theme.colors.success,
              fontSize: '0.9rem',
              marginBottom: '24px',
              padding: '12px 16px'
            }}>
              ✅ {msg}
            </Alert>
          )}

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

          {!msg && (
            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-4">
                <Form.Label style={labelStyle}>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                  isInvalid={touched.password && !!errors.password}
                  style={inputStyle}
                />
                {touched.password && errors.password && (
                  <div style={{ fontSize: '0.8rem', color: theme.colors.error, marginTop: '6px' }}>
                    {errors.password}
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={labelStyle}>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
                  isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                  style={inputStyle}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <div style={{ fontSize: '0.8rem', color: theme.colors.error, marginTop: '6px' }}>
                    {errors.confirmPassword}
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
                  padding: '12px',
                  borderRadius: theme.radius.sm,
                  backgroundColor: loading ? theme.colors.textMuted : (btnHover ? theme.colors.primaryHover : theme.colors.primary),
                  borderColor: theme.colors.primary,
                  color: '#FFFFFF',
                  fontWeight: '600',
                  fontSize: '1rem',
                  letterSpacing: '0.5px',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(93, 64, 55, 0.2)',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Form>
          )}

          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <Link
              to="/login"
              style={{
                color: theme.colors.accent,
                fontSize: '0.9rem',
                textDecoration: 'none',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.primary}
              onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.accent}
            >
              ← Back to Login
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}