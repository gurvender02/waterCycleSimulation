import React from 'react';

const Wave = ({ offset, color, height, yOffset, waveLength = 100 }) => {
  const points = [];
  const segmentWidth = 10;
  const segments = Math.ceil(window.innerWidth / segmentWidth) + 1;
  const yBase = window.innerHeight + yOffset;

  for (let i = 0; i <= segments; i++) {
    const x = i * segmentWidth;
    const y = Math.sin((x + offset) * 0.03) * height;
    points.push(`${x},${y + yBase}`);
  }

  // Add bottom corners to complete the shape
  points.push(`${window.innerWidth},${window.innerHeight}`);
  points.push(`0,${window.innerHeight}`);

  return (
    <svg 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    >
      <polygon
        points={points.join(' ')}
        fill={color}
      />
    </svg>
  );
};

export default Wave;