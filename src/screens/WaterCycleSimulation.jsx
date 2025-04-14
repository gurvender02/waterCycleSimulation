import React, { useState, useEffect, useRef } from 'react';
import Sun from '../components/Sun';
import Lake from '../components/Lake';
import Cloud from '../components/Cloud';
import Wave from '../components/Wave';
import Thunder from '../components/Thunder';
import GuideArrows from '../components/GuideArrows';
import AudioManager from '../components/AudioManager';
import usePoseDetection from '../hooks/usePoseDetection';
import useAnimation from '../hooks/useAnimation';
import { WAVE_CONFIGS, SUN_CONFIG, LAKE_CONFIG } from '../utils/constants';
import { mapValue, distance } from '../utils/helpers';
import VaporParticle from '../components/VaporParticle';
import RainParticle from '../components/RainParticle'

const WaterCycleSimulation = () => {
  const [sun, setSun] = useState({
    x: SUN_CONFIG.initialX,
    y: SUN_CONFIG.initialY,
    size: SUN_CONFIG.size,
    isDragging: false
  });
  const [clouds, setClouds] = useState([]);
  const [vaporParticles, setVaporParticles] = useState([]);
  const [rainParticles, setRainParticles] = useState([]);
  const [cloudParticles, setCloudParticles] = useState([]);
  const [thunder, setThunder] = useState({ active: false, frames: 0, pos1: null, pos2: null });
  const [waveOffsets, setWaveOffsets] = useState([0, 0, 0, 0, 0, 0]);
  const [cloudFormed, setCloudFormed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  
  const hands = usePoseDetection();
  const containerRef = useRef();

  // Handle sun interaction
  const handleSunInteraction = () => {
    let isDragging = false;
    let newX = sun.x;
    let newY = sun.y;

    // Check if sun is already being dragged
    if (sun.isDragging) {
      newX = mousePos.x;
      newY = mousePos.y;
      isDragging = true;
    } 
    // Check hand interactions if sun is not already being dragged
    else if (hands.length > 0) {
      for (const hand of hands) {
        if (distance(hand.x, hand.y, sun.x, sun.y) < sun.size / 2) {
          newX = hand.x;
          newY = hand.y;
          isDragging = true;
          break;
        }
      }
    }
    // Check mouse interactions if sun is not already being dragged
    else if (isMouseDown) {
      if (distance(mousePos.x, mousePos.y, sun.x, sun.y) < sun.size / 2) {
        newX = mousePos.x;
        newY = mousePos.y;
        isDragging = true;
      }
    }

    // Limit sun's movement to stay within the visible area
    newX = Math.max(sun.size/2, Math.min(window.innerWidth - sun.size/2, newX));
    newY = Math.max(sun.size/2, Math.min(window.innerHeight - 100, newY));

    // Update sun size based on height
    const distanceToLake = window.innerHeight - newY;
    const newSize = mapValue(
      distanceToLake,
      0,
      window.innerHeight,
      SUN_CONFIG.size * 2,
      SUN_CONFIG.size
    );

    setSun(prev => ({
      ...prev,
      x: newX,
      y: newY,
      size: newSize,
      isDragging
    }));
  };

  // Handle evaporation
  const handleEvaporation = () => {
    if (sun.y > window.innerHeight - 300 && !cloudFormed) {
      // Add new vapor particles
      const newParticles = [...Array(2)].map(() => ({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight - LAKE_CONFIG.height - 10,
        velX: Math.random() * 1 - 0.5,
        velY: -1 - Math.random() * 2,
        alpha: 255
      }));
      
      setVaporParticles(prev => [...prev, ...newParticles]);
    }

    // Update existing vapor particles
    setVaporParticles(prev => 
      prev.map(p => ({
        ...p,
        x: p.x + p.velX,
        y: p.y + p.velY,
        alpha: p.alpha - 2
      })).filter(p => p.alpha > 0)
    );

    // Move particles to cloud particles when they reach top
    const finishedParticles = vaporParticles.filter(p => p.alpha <= 0);
    if (finishedParticles.length > 0) {
      setCloudParticles(prev => [
        ...prev,
        ...finishedParticles.map(p => ({ x: p.x, y: p.y }))
      ]);
    }

    // Form clouds when enough particles accumulate
    if (cloudParticles.length > 150 && !cloudFormed) {
      setCloudFormed(true);
      setClouds([
        { x: 150, y: 100 },
        { x: window.innerWidth / 2, y: 80 },
        { x: window.innerWidth - 150, y: 100 }
      ]);
      setSun(prev => ({
        ...prev,
        x: SUN_CONFIG.initialX,
        y: SUN_CONFIG.initialY,
        size: SUN_CONFIG.size
      }));
    }
  };

  // Handle cloud movement and interactions
  const handleClouds = () => {
    let updatedClouds = [...clouds];
    let thunderActivated = false;

    // Check for hand interactions with clouds
    if (hands.length > 0) {
      updatedClouds = updatedClouds.map(cloud => {
        for (const hand of hands) {
          if (distance(hand.x, hand.y, cloud.x, cloud.y) < 50) {
            return { ...cloud, x: hand.x, y: hand.y };
          }
        }
        return cloud;
      });
    }

    // Check for mouse interactions with clouds
    if (isMouseDown) {
      updatedClouds = updatedClouds.map(cloud => {
        if (distance(mousePos.x, mousePos.y, cloud.x, cloud.y) < 50) {
          return { ...cloud, x: mousePos.x, y: mousePos.y };
        }
        return cloud;
      });
    }

    // Check for cloud collisions
    for (let i = 0; i < updatedClouds.length; i++) {
      for (let j = i + 1; j < updatedClouds.length; j++) {
        const cloud1 = updatedClouds[i];
        const cloud2 = updatedClouds[j];
        
        if (distance(cloud1.x, cloud1.y, cloud2.x, cloud2.y) < 100) {
          thunderActivated = true;
          setThunder({
            active: true,
            frames: 30,
            pos1: { x: cloud1.x, y: cloud1.y },
            pos2: { x: cloud2.x, y: cloud2.y }
          });
          startRain();
        }
      }
    }

    setClouds(updatedClouds);

    // Update thunder frames
    if (thunder.active) {
      if (thunder.frames > 0) {
        setThunder(prev => ({ ...prev, frames: prev.frames - 1 }));
      } else {
        setThunder(prev => ({ ...prev, active: false }));
      }
    }
  };

  // Handle rain particles
  const handleRain = () => {
    setRainParticles(prev => 
      prev.map(p => ({
        ...p,
        y: p.y + p.speed
      })).filter(p => p.y < window.innerHeight - LAKE_CONFIG.height)
    );

    // Reset simulation when rain ends
    if (rainParticles.length > 0 && rainParticles.every(p => p.y >= window.innerHeight - LAKE_CONFIG.height)) {
      setClouds([]);
      setCloudFormed(false);
      setCloudParticles([]);
    }
  };

  // Start rain effect
  const startRain = () => {
    const newRainParticles = [...Array(20)].map(() => ({
      x: Math.random() * window.innerWidth,
      y: 0,
      speed: 5 + Math.random() * 10
    }));
    setRainParticles(prev => [...prev, ...newRainParticles]);
  };

  // Update wave offsets
  const updateWaveOffsets = () => {
    setWaveOffsets(prev => [
      prev[0] + 2.5,
      prev[1] + 2,
      prev[2] + 1.5,
      prev[3] + 1.8,
      prev[4] + 1.2,
      prev[5] + 0.9
    ]);
  };

  // Mouse event handlers
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  // Animation loop
  useAnimation(() => {
    handleSunInteraction();
    handleEvaporation();
    handleClouds();
    handleRain();
    updateWaveOffsets();
  });

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#87CEEB'
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        <img 
          src="/assests/images/mountain.jpg" 
          alt="background" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '75%',
            objectFit: 'cover',
            objectPosition: 'center bottom'
          }} 
        />
      </div>
      
      <AudioManager 
        cloudFormed={cloudFormed} 
        rainParticles={rainParticles} 
        vaporParticles={vaporParticles} 
      />
      
      {WAVE_CONFIGS.map((config, i) => (
        <Wave 
          key={i} 
          offset={waveOffsets[i]} 
          {...config} 
        />
      ))}
      
      <Lake />
      
      <Sun 
        x={sun.x} 
        y={sun.y} 
        size={sun.size} 
        isDragging={sun.isDragging} 
      />
      
      {clouds.map((cloud, i) => (
        <Cloud 
          key={i} 
          x={cloud.x} 
          y={cloud.y} 
          onDrag={(x, y) => {
            const updatedClouds = [...clouds];
            updatedClouds[i] = { x, y };
            setClouds(updatedClouds);
          }} 
        />
      ))}
      
      {vaporParticles.map((particle, i) => (
        <VaporParticle 
          key={`vapor-${i}`} 
          x={particle.x} 
          y={particle.y} 
          alpha={particle.alpha} 
        />
      ))}
      
      {rainParticles.map((particle, i) => (
        <RainParticle 
          key={`rain-${i}`} 
          x={particle.x} 
          y={particle.y} 
        />
      ))}
      
      {thunder.active && (
        <Thunder 
          pos1={thunder.pos1} 
          pos2={thunder.pos2} 
        />
      )}
      
      <GuideArrows 
        sun={sun} 
        cloudFormed={cloudFormed} 
        rainParticles={rainParticles} 
      />
    </div>
  );
};

export default WaterCycleSimulation;