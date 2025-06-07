import React from 'react';
import { FaEnvelope, FaPhone, FaUniversity } from 'react-icons/fa';

export default function ContactPage() {
  console.log('📞 Contact Page rendered');
  
  const handleBackToHome = () => {
    window.location.href = '/'; // Redirect to home page
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/bg-home.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: 'calc(100vh - 64px)', // To account for header height
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
          maxWidth: '900px',
          width: '100%',
        }}
      >
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Meet Our Team
        </h2>

        {/* Centered sentence about the team */}
        <p
          style={{
            fontSize: '1.2rem',
            marginTop: '2rem',
            textAlign: 'right', // Centered the sentence
            paddingBottom: '1rem', // Reduced space
          }}
        >
          Our dedicated team members are here to assist you.
        </p>

        {/* Team Member Boxes */}
        <div
          style={{
            display: 'grid',
            gridTemplateRows: '1fr 1fr', // 2 rows
            gridTemplateColumns: '1fr 1fr', // 2 columns
            gap: '1rem', // Reduced gap for smaller boxes
            justifyContent: 'center',
          }}
        >
          {/* Member 1 */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '1rem', // Smaller padding
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              color: 'white',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Aditi Nikam</h3>
            <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>USN No.: 02fe23bcs416</p>
            <p>
              <FaEnvelope /> <strong>02fe23bcs416@kletech.ac.in</strong>
            </p>
            <p>
              <FaUniversity /> <strong>KLE Dr. M S Sheshgiri College of Engg & Technology, Belagavi</strong>
            </p>
            <p>
              <FaPhone /> <strong>+91 7777777777</strong>
            </p>
          </div>

          {/* Member 2 */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '1rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              color: 'white',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Shruti Balekundri</h3>
            <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>USN No.: 02fe23bcs425</p>
            <p>
              <FaEnvelope /> <strong>02fe23bcs425@kletech.ac.in</strong>
            </p>
            <p>
              <FaUniversity /> <strong>KLE Dr. M S Sheshgiri College of Engg & Technology, Belagavi</strong>
            </p>
            <p>
              <FaPhone /> <strong>+91 8888888888</strong>
            </p>
          </div>

          {/* Member 3 */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '1rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              color: 'white',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Amna Bijapuri</h3>
            <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>USN No.: 02fe23bcs427</p>
            <p>
              <FaEnvelope /> <strong>02fe23bcs427@kletech.ac.in</strong>
            </p>
            <p>
              <FaUniversity /> <strong>KLE Dr. M S Sheshgiri College of Engg & Technology, Belagavi</strong>
            </p>
            <p>
              <FaPhone /> <strong>+91 9999999999</strong>
            </p>
          </div>

          {/* Member 4 */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '1rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              color: 'white',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Vishal Kadalagi</h3>
            <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>USN No.: 02fe23bcs431</p>
            <p>
              <FaEnvelope /> <strong>02fe23bcs431@kletech.ac.in</strong>
            </p>
            <p>
              <FaUniversity /> <strong>KLE Dr. M S Sheshgiri College of Engg & Technology, Belagavi</strong>
            </p>
            <p>
              <FaPhone /> <strong>+91 6360430056</strong>
            </p>
          </div>
        </div>

        <button
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '0.8rem 2rem',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            marginTop: '2rem',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 4px 20px rgba(0, 255, 100, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
          onClick={handleBackToHome}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
