import React from 'react';
import { lerp } from '../utils/helpers';

const Thunder = ({ pos1, pos2 }) => {
  const mid1 = {
    x: lerp(pos1.x, pos2.x, 0.3),
    y: lerp(pos1.y, pos2.y, 0.3) + 50
  };
  
  const mid2 = {
    x: lerp(pos1.x, pos2.x, 0.6),
    y: lerp(pos1.y, pos2.y, 0.6) - 30
  };

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
      <path
        d={`M${pos1.x},${pos1.y} Q${mid1.x},${mid1.y} ${mid2.x},${mid2.y} T${pos2.x},${pos2.y}`}
        stroke="rgba(255, 215, 0, 0.8)"
        strokeWidth="6"
        fill="none"
      />
    </svg>
  );
};

export default Thunder;