import { useState } from 'react';

const theme = {
  colors: {
    primary: '#5D4037',
    primaryHover: '#4E342E',
    accent: '#8B5A2B',
    bg: '#FFFFFF',
    pageBg: '#FAF9F6',
    text: '#2C2420',
    textMuted: '#8D7B6F',
    border: '#D7CCC8',
  },
  radius: {
    sm: '8px'
  }
};

export default function Footer() {
  const [privacyHover, setPrivacyHover] = useState(false);
  const [termsHover, setTermsHover] = useState(false);

  return (
    <footer 
      style={{ 
        backgroundColor: theme.colors.bg, 
        borderTop: `1px solid ${theme.colors.border}`,
        padding: '32px 0',
        marginTop: 'auto',
        width: '100%'
      }}
    >
      <div style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 15px',
        textAlign: 'center'
      }}>
        
        <p style={{ 
          color: theme.colors.textMuted, 
          fontSize: '0.85rem', 
          margin: '0 0 12px 0',
          fontFamily: "'Inter', system-ui, sans-serif",
          letterSpacing: '0.3px'
        }}>
          © {new Date().getFullYear()} <span style={{ color: theme.colors.primary, fontWeight: '600' }}>RentEase</span>. All rights reserved.
        </p>
            <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '24px'
        }}>
          <a 
            href="/privacy" 
            onMouseEnter={() => setPrivacyHover(true)}
            onMouseLeave={() => setPrivacyHover(false)}
            style={{ 
              color: privacyHover ? theme.colors.primary : theme.colors.textMuted, 
              fontSize: '0.85rem', 
              textDecoration: 'none', 
              fontWeight: '500',
              transition: 'color 0.2s ease'
            }}
          >
            Privacy Policy
          </a>
          
          <a 
            href="/terms" 
            onMouseEnter={() => setTermsHover(true)}
            onMouseLeave={() => setTermsHover(false)}
            style={{ 
              color: termsHover ? theme.colors.primary : theme.colors.textMuted, 
              fontSize: '0.85rem', 
              textDecoration: 'none', 
              fontWeight: '500',
              transition: 'color 0.2s ease'
            }}
          >
            Terms of Service
          </a>
        </div>
        
      </div>
    </footer>
  );
}