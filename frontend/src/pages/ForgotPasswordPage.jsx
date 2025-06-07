// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';        // adjust path if needed
import { useNavigate, Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter your email address.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert('✅ Password reset email sent! Check your inbox.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('❌ ' + (err.message || 'Failed to send reset email.'));
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/bg-home.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
        padding: '1rem',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Home Button */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          fontSize: '1.8rem',
          color: 'white',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
        title="Go to Home"
      >
        <FaHome />
      </button>

      {/* Transparent Forgot Password Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          borderRadius: '20px',
          padding: '2rem',
          color: 'white',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(12px)',
          boxSizing: 'border-box',
        }}
      >
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 'bold' }}>
          Forgot Password
        </h2>

        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 0.8rem 0.8rem 2.6rem',
                borderRadius: '10px',
                backgroundColor: '#1e293b',
                color: 'white',
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
            <span
              style={{
                position: 'absolute',
                top: '50%',
                left: '0.9rem',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: '1.1rem',
              }}
            >
              📧
            </span>
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.8rem',
              fontSize: '1rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: '600',
              width: '100%',
              boxSizing: 'border-box',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Send Reset Email
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          Remembered your password?{' '}
          <Link to="/login" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
