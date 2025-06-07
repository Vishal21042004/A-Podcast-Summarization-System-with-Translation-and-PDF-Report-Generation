import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: '', type: 'info' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Inline validation for first/last name and username
    if (name === 'firstName' && value && value[0] !== value[0].toUpperCase()) {
      setErrors(prev => ({ ...prev, firstName: 'First letter must be uppercase.' }));
    } else if (name === 'firstName') {
      setErrors(prev => ({ ...prev, firstName: '' }));
    }
    if (name === 'lastName' && value && value[0] !== value[0].toUpperCase()) {
      setErrors(prev => ({ ...prev, lastName: 'First letter must be uppercase.' }));
    } else if (name === 'lastName') {
      setErrors(prev => ({ ...prev, lastName: '' }));
    }
    if (name === 'username' && /[A-Z]/.test(value)) {
      setErrors(prev => ({ ...prev, username: 'Username must be lowercase only.' }));
    } else if (name === 'username') {
      setErrors(prev => ({ ...prev, username: '' }));
    }
  };

  // Password validation function
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUpper && hasLower && hasSpecial;
  };

  const showPopup = (message, type = 'info') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'info' }), 2500);
  };

  const handleSignup = async e => {
    e.preventDefault();

    // Name and username validation
    if (form.firstName[0] !== form.firstName[0]?.toUpperCase()) {
      setErrors(prev => ({ ...prev, firstName: 'First letter must be uppercase.' }));
      return;
    }
    if (form.lastName[0] !== form.lastName[0]?.toUpperCase()) {
      setErrors(prev => ({ ...prev, lastName: 'First letter must be uppercase.' }));
      return;
    }
    if (/[A-Z]/.test(form.username)) {
      setErrors(prev => ({ ...prev, username: 'Username must be lowercase only.' }));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
      showPopup("❌ Passwords do not match", "error");
      return;
    }

    if (!validatePassword(form.password)) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters, include uppercase, lowercase, and a special character.' }));
      showPopup(
        "Password must be at least 8 characters, include uppercase, lowercase, and a special character.",
        "error"
      );
      return;
    }

    try {
      // Firebase Auth signup
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const { uid } = userCredential.user;

      // Save extra user info in Firestore
      await setDoc(doc(db, 'users', uid), {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        username: form.username,
        createdAt: serverTimestamp(),
      });

      // Clear errors and form after successful signup
      setErrors({});
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
      });

      // Show success popup and redirect after a short delay
      showPopup('🎉 Account created successfully!', 'success');
      setTimeout(() => navigate('/login'), 2500);

    } catch (error) {
      // Firebase error handling
      let msg = "Signup failed. Try again.";
      if (error.code === "auth/email-already-in-use") {
        msg = "Email is already in use.";
        setErrors(prev => ({ ...prev, email: msg }));
      } else if (error.code === "auth/invalid-email") {
        msg = "Invalid email address.";
        setErrors(prev => ({ ...prev, email: msg }));
      } else if (error.code === "auth/weak-password") {
        msg = "Password is too weak.";
        setErrors(prev => ({ ...prev, password: msg }));
      }
      showPopup(`❌ ${msg}`, "error");
      console.error(error); // For debugging
    }
  };

  const inputStyle = {
    padding: '0.8rem',
    borderRadius: '10px',
    backgroundColor: '#1e293b',
    color: 'white',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    width: '100%',
  };

  const inputContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const iconStyle = {
    position: 'absolute',
    left: '0.8rem',
    color: '#94a3b8',
    fontSize: '1.1rem',
  };

  const inputWithIconStyle = {
    ...inputStyle,
    paddingLeft: '2.5rem',
  };

  const eyeIconStyle = {
    position: 'absolute',
    right: '0.8rem',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '1.1rem',
  };

  // Popup modal styles
  const popupStyle = {
    position: 'fixed',
    top: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    background: popup.type === 'success'
      ? 'linear-gradient(90deg, #22c55e, #16a34a)'
      : popup.type === 'error'
      ? 'linear-gradient(90deg, #ef4444, #b91c1c)'
      : 'linear-gradient(90deg, #3b82f6, #1e40af)',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
    zIndex: 9999,
    fontWeight: 'bold',
    fontSize: '1.1rem',
    display: popup.show ? 'block' : 'none',
    transition: 'all 0.3s',
    textAlign: 'center',
    minWidth: '300px',
    maxWidth: '90vw',
  };

  const hintStyle = {
    fontSize: '0.92rem',
    color: '#fbbf24',
    marginTop: '0.2rem',
    marginBottom: '-0.5rem',
    fontWeight: 500,
    letterSpacing: '0.01em',
  };

  const errorStyle = {
    fontSize: '0.92rem',
    color: '#ef4444',
    marginTop: '0.2rem',
    marginBottom: '-0.5rem',
    fontWeight: 500,
    letterSpacing: '0.01em',
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
      }}
    >
      {/* Popup Message */}
      <div style={popupStyle}>{popup.message}</div>

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

      {/* Signup Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          borderRadius: '20px',
          padding: '2.5rem',
          color: 'white',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 'bold' }}>
          Sign Up
        </h2>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={inputContainerStyle}>
              <FaUser style={iconStyle} />
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
                style={{
                  ...inputWithIconStyle,
                  border: errors.firstName ? '2px solid #ef4444' : 'none'
                }}
              />
            </div>
            <div style={inputContainerStyle}>
              <FaUser style={iconStyle} />
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
                style={{
                  ...inputWithIconStyle,
                  border: errors.lastName ? '2px solid #ef4444' : 'none'
                }}
              />
            </div>
          </div>
          {/* Hints for names */}
          <div style={hintStyle}>
            First and last name should start with an uppercase letter.
          </div>
          {/* Name validation errors */}
          {errors.firstName && <div style={errorStyle}>{errors.firstName}</div>}
          {errors.lastName && <div style={errorStyle}>{errors.lastName}</div>}

          <div style={inputContainerStyle}>
            <FaEnvelope style={iconStyle} />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                ...inputWithIconStyle,
                border: errors.email ? '2px solid #ef4444' : 'none'
              }}
            />
          </div>
          {/* Email hint */}
          <div style={hintStyle}>
            Enter a valid email address.
          </div>
          {errors.email && <div style={errorStyle}>{errors.email}</div>}

          <div style={inputContainerStyle}>
            <FaUser style={iconStyle} />
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              style={{
                ...inputWithIconStyle,
                border: errors.username ? '2px solid #ef4444' : 'none'
              }}
              autoComplete="username"
            />
          </div>
          {/* Username hint and error */}
          <div style={hintStyle}>
            Username must be lowercase, can include numbers and underscores.
          </div>
          {errors.username && <div style={errorStyle}>{errors.username}</div>}

          <div style={inputContainerStyle}>
            <FaLock style={iconStyle} />
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                ...inputWithIconStyle,
                border: errors.password ? '2px solid #ef4444' : 'none'
              }}
              autoComplete="new-password"
            />
            {showPassword ? (
              <FaEyeSlash onClick={() => setShowPassword(false)} style={eyeIconStyle} />
            ) : (
              <FaEye onClick={() => setShowPassword(true)} style={eyeIconStyle} />
            )}
          </div>
          {/* Password requirements */}
          <div style={hintStyle}>
            Password must be at least 8 characters, include uppercase, lowercase, and a special character.
          </div>
          {errors.password && <div style={errorStyle}>{errors.password}</div>}

          <div style={inputContainerStyle}>
            <FaLock style={iconStyle} />
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              style={{
                ...inputWithIconStyle,
                border: errors.confirmPassword ? '2px solid #ef4444' : 'none'
              }}
              autoComplete="new-password"
            />
            {showConfirmPassword ? (
              <FaEyeSlash onClick={() => setShowConfirmPassword(false)} style={eyeIconStyle} />
            ) : (
              <FaEye onClick={() => setShowConfirmPassword(true)} style={eyeIconStyle} />
            )}
          </div>
          {/* Confirm password hint */}
          <div style={hintStyle}>
            Re-enter your password to confirm.
          </div>
          {errors.confirmPassword && <div style={errorStyle}>{errors.confirmPassword}</div>}

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
            Sign Up
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
