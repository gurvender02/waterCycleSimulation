import React, { useEffect, useState } from 'react';

const Sun = ({ x, y, size, isDragging }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Add pulsing effect
    const interval = setInterval(() => {
      setAnimate(prev => !prev);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  // Create sun rays
  const rays = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const rayLength = size * (animate ? 0.6 : 0.5);
    rays.push({
      x1: x + Math.cos(angle) * size / 2,
      y1: y + Math.sin(angle) * size / 2,
      x2: x + Math.cos(angle) * (size / 2 + rayLength),
      y2: y + Math.sin(angle) * (size / 2 + rayLength),
      angle: angle
    });
  }

  return (
    <>
      {/* Sun glow effect */}
      <div 
        style={{
          position: 'absolute',
          left: x - size * 0.8,
          top: y - size * 0.8,
          width: size * 1.6,
          height: size * 1.6,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,204,0,0.4) 0%, rgba(255,204,0,0) 70%)',
          transition: 'all 0.3s ease',
          zIndex: 2
        }}
      />
      
      {/* Sun body */}
      <div 
        style={{
          position: 'absolute',
          left: x - size/2,
          top: y - size/2,
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fff176 0%, #ffd600 70%, #ffab00 100%)',
          boxShadow: '0 0 40px rgba(255, 204, 0, 0.8)',
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: 'box-shadow 0.3s ease',
          zIndex: 3
        }}
      />
      
      {/* Sun rays */}
      {rays.map((ray, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: ray.x1,
              top: ray.y1,
              width: Math.sqrt(Math.pow(ray.x2 - ray.x1, 2) + Math.pow(ray.y2 - ray.y1, 2)),
              height: 2,
              backgroundColor: 'rgba(255, 204, 0, 0.6)',
              transformOrigin: 'left center',
              transform: `rotate(${ray.angle}rad)`,
              transition: 'width 0.5s ease'
            }}
          />
        </div>
      ))}
    </>
  );
};

export default Sun;