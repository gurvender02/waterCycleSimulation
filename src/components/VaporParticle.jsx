import React from 'react';

const VaporParticle = ({ x, y, alpha }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 3,
        top: y - 3,
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: `rgba(255, 255, 255, ${alpha / 255})`,
        pointerEvents: 'none'
      }}
    />
  );
};

export default VaporParticle;