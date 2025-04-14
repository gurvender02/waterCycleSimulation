import React from 'react';

const RainParticle = ({ x, y }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 1,
        height: 10,
        backgroundColor: 'rgba(100, 100, 255, 0.7)',
        pointerEvents: 'none'
      }}
    />
  );
};

export default RainParticle;