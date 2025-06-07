import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { FaHome, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.message);
      alert('Error: ' + error.message);
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

      {/* Transparent Login Card */}
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
          Login
        </h2>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="email"
              placeholder="Email"
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

          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 2.6rem 0.8rem 2.6rem',
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
              🔒
            </span>
            <span
              style={{
                position: 'absolute',
                top: '50%',
                right: '0.9rem',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: '1.1rem',
                cursor: 'pointer',
              }}
              onClick={() => setShowPassword((prev) => !prev)}
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
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
            Login
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          Don’t have an account?{' '}
          <Link to="/signup" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
            Sign Up
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          <Link to="/forgot-password" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
