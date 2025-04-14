import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(to bottom, #87CEEB, #1E90FF)',
      color: 'white',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Water Cycle Simulation</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px' }}>
        Experience the water cycle through this interactive simulation. Drag the sun to evaporate water, 
        form clouds, and create rain!
      </p>
      <button
        onClick={() => navigate('/simulation')}
        style={{
          padding: '12px 24px',
          fontSize: '1.2rem',
          background: 'white',
          color: '#1E90FF',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        }}
      >
        Start Simulation
      </button>
    </div>
  );
};

export default HomeScreen;