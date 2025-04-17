import React from 'react';
import { distance } from '../utils/helpers';

const GuideArrows = ({ sun, cloudFormed, rainParticles }) => {
  if (!sun.isDragging && sun.x === 700 && sun.y === 100 && !cloudFormed) {
    return (
      <>
        <div style={{
          position: 'absolute',
          top: 50,
          left: 500,
          color: 'rgba(219, 227, 62, 0.7)',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          Drag the Sun towards the lake
        </div>
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}>
          <line
            x1={sun.x}
            y1={sun.y}
            x2={sun.x - 150}
            y2={window.innerHeight - 50}
            stroke="rgba(255, 0, 0, 0.7)"
            strokeWidth="2"
          />
          <polygon
            points={`${sun.x - 160},${window.innerHeight - 60} ${sun.x - 140},${window.innerHeight - 60} ${sun.x - 150},${window.innerHeight - 50}`}
            fill="rgba(223, 234, 68, 0.7)"
          />
        </svg>
      </>
    );
  }

  if (cloudFormed && rainParticles.length === 0) {
    return (
      <>
        <div style={{
          position: 'absolute',
          top: 25,
          left: 350,
          color: 'rgba(255, 0, 0, 0.7)',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          Collide the clouds
        </div>
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}>
          <line
            x1={200}
            y1={100}
            x2={350}
            y2={100}
            stroke="rgba(255, 0, 0, 0.7)"
            strokeWidth="2"
          />
          <polygon
            points="200,95 200,105 180,100"
            fill="rgba(255, 0, 0, 0.7)"
          />
        </svg>
      </>
    );
  }

  return null;
};

export default GuideArrows;