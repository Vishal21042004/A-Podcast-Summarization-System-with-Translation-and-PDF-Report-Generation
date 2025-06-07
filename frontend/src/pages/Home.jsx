import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  console.log('🏠 Home rendered');
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/login');
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/bg-home.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: '2rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          padding: '3rem',
          borderRadius: '20px',
          textAlign: 'center',
          color: 'white',
          boxShadow: '0 6px 32px rgba(0,0,0,0.5)',
          maxWidth: '600px',
        }}
      >
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          PODCAST SUMMARIZER
        </h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Transform long podcasts into quick, insightful summaries using NLP.
        </p>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
          }}
        >
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>✨ Why Use It?</h3>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.1rem' }}>
            <li>⏱️ Save time with quick summaries</li>
            <li>🧠 Grasp key insights instantly</li>
            <li>📄 Export summaries for later</li>
          </ul>
        </div>

        {/* Get Started Button */}
        <button
          style={{
            backgroundColor: '#003366',  // Dark bluish color
            color: 'white',
            padding: '0.8rem 2rem',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 4px 20px rgba(0, 51, 102, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
          onClick={handleGetStartedClick}  // Handle button click to navigate
        >
          🚀 Get Started
        </button>
      </div>
    </div>
  );
}
