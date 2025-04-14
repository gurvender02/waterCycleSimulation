import React, { useState, useEffect } from 'react';

const Cloud = ({ x, y, onDrag }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        onDrag(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onDrag]);

  return (
    <div 
      style={{
        position: 'absolute',
        left: x - 50,
        top: y - 30,
        width: 100,
        height: 60,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 10,
        userSelect: 'none',
        pointerEvents: 'auto',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* Main cloud body */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '40px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '50px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }} />
      
      {/* Cloud bumps */}
      <div style={{
        position: 'absolute',
        left: '25px',
        top: '-15px',
        width: '50px',
        height: '50px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '50%',
      }} />
      
      <div style={{
        position: 'absolute',
        left: '60px',
        top: '-10px',
        width: '40px',
        height: '40px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '50%',
      }} />
      
      <div style={{
        position: 'absolute',
        left: '5px',
        top: '-5px',
        width: '30px',
        height: '30px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '50%',
      }} />
    </div>
  );
};

export default Cloud;