import React from 'react';
import { LAKE_CONFIG } from '../utils/constants';

const Lake = () => {
  return (
    <div 
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: LAKE_CONFIG.height,
        background: `linear-gradient(to bottom, #66b3ff, #4da6ff 40%, #0080ff 80%, #0066cc)`,
        overflow: 'hidden'
      }}
    >
      {/* Water surface reflection */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '10px',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0))',
          opacity: 0.6
        }}
      />
      
      {/* Ripples */}
      {[...Array(5)].map((_, i) => (
        <div 
          key={i}
          style={{
            position: 'absolute',
            width: 20 + i * 30,
            height: 20 + i * 30,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)',
            top: 50 + i * 20,
            left: 100 + i * 80,
            animation: `ripple${i} ${5 + i}s infinite`,
            opacity: 0.6
          }}
        />
      ))}

      <style>
        {`
          @keyframes ripple0 { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2); opacity: 0; } }
          @keyframes ripple1 { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2); opacity: 0; } }
          @keyframes ripple2 { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2); opacity: 0; } }
          @keyframes ripple3 { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2); opacity: 0; } }
          @keyframes ripple4 { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2); opacity: 0; } }
        `}
      </style>
    </div>
  );
};

export default Lake;