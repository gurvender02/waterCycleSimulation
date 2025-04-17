// WaterCycleSimulation.jsx  – optimized & feature‑complete
import React, { useState, useEffect, useRef } from 'react';
import Sun            from '../components/Sun';
import Lake           from '../components/Lake';
import Cloud          from '../components/Cloud';
import Wave           from '../components/Wave';
import Thunder        from '../components/Thunder';
import AudioManager   from '../components/AudioManager';
import GuideArrows    from '../components/GuideArrows';
import VaporParticle  from '../components/VaporParticle';
import RainParticle   from '../components/RainParticle';
import usePoseDetection from '../hooks/usePoseDetection';

import { WAVE_CONFIGS, SUN_CONFIG, LAKE_CONFIG } from '../utils/constants';
import { mapValue, distance } from '../utils/helpers';

/* ───────────────────────────────────────── component */
export default function WaterCycleSimulation() {
  /* ---------------- state */
  const hands = usePoseDetection();                 // hand‑pose hook
  const [sun,   setSun]   = useState({ x: SUN_CONFIG.initialX, y: SUN_CONFIG.initialY, size: SUN_CONFIG.size });
  const [clouds,         setClouds]         = useState([]);
  const [vaporParticles, setVaporParticles] = useState([]);
  const [cloudParticles, setCloudParticles] = useState([]);
  const [rainParticles,  setRainParticles]  = useState([]);
  const [cloudFormed,    setCloudFormed]    = useState(false);
  const [thunder, setThunder] = useState({ active: false, frames: 0, pos1: null, pos2: null });
  const [waveOffsets, setWaveOffsets] = useState(WAVE_CONFIGS.map(() => 0));
  const [mousePos,   setMousePos]   = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);

  const wrapRef = useRef();

  /* ---------------- once clouds form */
  useEffect(() => {
    if (!cloudFormed && cloudParticles.length > 150) {
      setCloudFormed(true);
      setClouds([
        { x: 150, y: 100 },
        { x: window.innerWidth / 2, y: 80 },
        { x: window.innerWidth - 150, y: 100 },
      ]);
      setSun({ x: SUN_CONFIG.initialX, y: SUN_CONFIG.initialY, size: SUN_CONFIG.size });
    }
  }, [cloudParticles, cloudFormed]);

  /* ---------------- pointer updates */
  const onMove = e => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  /* ---------------- sun drag (hand > mouse) */
  const updateSun = () => {
    let dragged = false;

    for (const hand of hands) {
      if (distance(hand.x, hand.y, sun.x, sun.y) < sun.size / 2) {
        const dLake = window.innerHeight - hand.y;
        setSun({ x: hand.x, y: hand.y, size: mapValue(dLake, 0, window.innerHeight, SUN_CONFIG.size * 2, SUN_CONFIG.size) });
        dragged = true;
        break;
      }
    }
    if (!dragged && isMouseDown) {
      const cx = Math.max(sun.size / 2, Math.min(window.innerWidth  - sun.size / 2, mousePos.x));
      const cy = Math.max(sun.size / 2, Math.min(window.innerHeight - 100,          mousePos.y));
      const dLake = window.innerHeight - cy;
      setSun({ x: cx, y: cy, size: mapValue(dLake, 0, window.innerHeight, SUN_CONFIG.size * 2, SUN_CONFIG.size) });
    }
  };

  /* ---------------- evaporation & vapor */
  const updateEvaporation = () => {
    /* spawn */
    if (sun.y > window.innerHeight - 300 && !cloudFormed) {
      setVaporParticles(v => [
        ...v,
        ...Array.from({ length: 2 }, () => ({
          x: Math.random() * window.innerWidth,
          y: window.innerHeight - LAKE_CONFIG.height - 10,
          velX: Math.random() - 0.5,
          velY: -1 - Math.random() * 2,
          alpha: 255
        }))
      ]);
    }

    /* update + harvest in one sweep */
    setVaporParticles(vPrev => {
      const toCloud = [];
      const next = vPrev
        .map(p => {
          const n = { ...p, x: p.x + p.velX, y: p.y + p.velY, alpha: p.alpha - 2 };
          if (n.alpha <= 0) toCloud.push({ x: n.x, y: n.y });
          return n;
        })
        .filter(p => p.alpha > 0);

      if (toCloud.length) setCloudParticles(c => [...c, ...toCloud]);
      return next;
    });
  };

  /* ---------------- clouds (drag + collision) & thunder */
  const updateClouds = () => {
    /* drag */
    setClouds(cl => cl.map(c => {
      for (const hand of hands) {
        if (distance(hand.x, hand.y, c.x, c.y) < 50) return { ...c, x: hand.x, y: hand.y };
      }
      return (isMouseDown && distance(mousePos.x, mousePos.y, c.x, c.y) < 50)
        ? { ...c, x: mousePos.x, y: mousePos.y }
        : c;
    }));

    /* collision → thunder */
    if (!thunder.active && clouds.length > 1) {
      outer: for (let i = 0; i < clouds.length; i++) {
        for (let j = i + 1; j < clouds.length; j++) {
          if (distance(clouds[i].x, clouds[i].y, clouds[j].x, clouds[j].y) < 100) {
            setThunder({ active: true, frames: 30, pos1: clouds[i], pos2: clouds[j] });
            break outer;
          }
        }
      }
    }

    /* thunder countdown */
    if (thunder.active) {
      setThunder(t => t.frames > 0 ? { ...t, frames: t.frames - 1 } : { ...t, active: false });
    }
  };

  /* ---------------- rain */
  const updateRain = () => {
    /* spawn while thunder */
    if (thunder.active) {
      setRainParticles(r => [
        ...r,
        ...Array.from({ length: 20 }, () => ({ x: Math.random() * window.innerWidth, y: 0, speed: Math.random() * 10 + 5 }))
      ]);
    }

    /* fall + clear */
    setRainParticles(rPrev => rPrev
      .map(p => ({ ...p, y: p.y + p.speed }))
      .filter(p => p.y < window.innerHeight - LAKE_CONFIG.height)
    );

    /* reset after storm */
    if (rainParticles.length && rainParticles.every(p => p.y >= window.innerHeight - LAKE_CONFIG.height)) {
      setClouds([]); setCloudParticles([]); setCloudFormed(false);
    }
  };

  /* ---------------- waves */
  const advanceWaves = () =>
    setWaveOffsets(o => o.map((v, i) => v + WAVE_CONFIGS[i].speed));

  /* ---------------- central loop */
  useEffect(() => {
    const loop = () => {
      updateSun();
      updateEvaporation();
      updateClouds();
      updateRain();
      advanceWaves();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }, [hands, mousePos, isMouseDown, sun, clouds, rainParticles]);

  /* ---------------- render */
  return (
    <div ref={wrapRef}
         onMouseMove={onMove}
         onMouseDown={() => setIsMouseDown(true)}
         onMouseUp  ={() => setIsMouseDown(false)}
         onMouseLeave={() => setIsMouseDown(false)}
         style={{ position:'relative', width:'100vw', height:'100vh', overflow:'hidden', background:'#87CEEB' }}>

      {/* sky & mountain backdrop */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,#87CEEB 0%,#fff 100%)', zIndex:-2 }} />
      <img src="/assests/images/mountain.jpg"
           alt="mountain"
           style={{ position:'absolute', bottom:LAKE_CONFIG.height+40, width:'100%', objectFit:'cover', zIndex:-1 }} />

      <AudioManager cloudFormed={cloudFormed} rainParticles={rainParticles} vaporParticles={vaporParticles}/>

      {WAVE_CONFIGS.map((cfg,i)=><Wave key={i} offset={waveOffsets[i]} {...cfg}/> )}
      <Lake />
      <Sun {...sun} />
      {clouds.map((c,i)=><Cloud key={i} x={c.x} y={c.y}/> )}
      {vaporParticles.map((p,i)=><VaporParticle key={i} x={p.x} y={p.y} alpha={p.alpha}/> )}
      {rainParticles .map((p,i)=><RainParticle  key={i} x={p.x} y={p.y}/> )}
      {thunder.active && <Thunder pos1={thunder.pos1} pos2={thunder.pos2}/>}

      <GuideArrows sun={sun} cloudFormed={cloudFormed} rainParticles={rainParticles} />

      {/* toast */}
      {!cloudFormed && cloudParticles.length>120 &&
        <div style={{ position:'absolute', top:15, left:'50%', transform:'translateX(-50%)',
                      padding:'6px 18px', borderRadius:12, background:'rgba(0,0,0,0.55)', color:'#fff'}}>
          Cloud forming… ☁️
        </div>}
    </div>
  );
}
