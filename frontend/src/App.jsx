import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';

// Import your pages
import Home from './pages/Home.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UploadPage from './pages/UploadPage.jsx';
import NotFound from './pages/NotFound.jsx';
import Contact from './pages/Contact.jsx';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const isDashboard = pathname === '/dashboard';
  const isLogin = pathname === '/login';
  const isSignup = pathname === '/signup';
  const isContact = pathname === '/contact';
  const isHome = pathname === '/';

  const handleLogout = () => {
    // Implement logout logic (clear tokens, etc.)
    navigate('/');
  };

  return (
    <header
      style={{
        padding: '1rem 2rem',
        background: 'linear-gradient(to right, rgb(5, 10, 15), rgb(5, 28, 51))',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Podcast Summarizer</h1>
      <nav style={{ display: 'flex', alignItems: 'center' }}>
        {isDashboard ? (
          <button
            onClick={handleLogout}
            style={{
              ...navLinkStyle({ isActive: false }),
              backgroundColor: '#CC0000',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >
            Logout
          </button>
        ) : (
          <>
            {/* Dashboard Button (hide on home, login, signup, contact) */}
            {!isHome && !isLogin && !isSignup && !isContact && (
              <NavLink
                to="/dashboard"
                style={navLinkStyle}
                onMouseEnter={hoverEnter}
                onMouseLeave={hoverLeave}
              >
                Dashboard
              </NavLink>
            )}

            {/* Login Button (hide on login) */}
            {!isLogin && (
              <NavLink
                to="/login"
                style={navLinkStyle}
                onMouseEnter={hoverEnter}
                onMouseLeave={hoverLeave}
              >
                Login
              </NavLink>
            )}

            {/* Signup Button (hide on signup) */}
            {!isSignup && (
              <NavLink
                to="/signup"
                style={navLinkStyle}
                onMouseEnter={hoverEnter}
                onMouseLeave={hoverLeave}
              >
                Sign Up
              </NavLink>
            )}

            {/* Contact Button (show on all except dashboard) */}
            {!isDashboard && (
              <NavLink
                to="/contact"
                style={navLinkStyle}
                onMouseEnter={hoverEnter}
                onMouseLeave={hoverLeave}
              >
                Contact
              </NavLink>
            )}
          </>
        )}
      </nav>
    </header>
  );
};

// NavLink styling
const navLinkStyle = ({ isActive }) => ({
  color: isActive ? '#FF6F61' : 'white',
  marginRight: '1.5rem',
  fontSize: '1.1rem',
  textDecoration: 'none',
  fontWeight: 'bold',
  position: 'relative',
  transition: 'color 0.3s ease-in-out, transform 0.3s ease, background 0.3s ease',
  padding: '0.5rem 1rem',
  borderRadius: '5px',
  backgroundColor: isActive ? '#003366' : 'transparent',
});

const hoverEnter = (e) => {
  e.target.style.color = '#FF6F61';
  e.target.style.transform = 'scale(1.1)';
};

const hoverLeave = (e) => {
  e.target.style.color = 'white';
  e.target.style.transform = 'scale(1)';
};

export default function App() {
  console.log('✅ App rendered');

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
