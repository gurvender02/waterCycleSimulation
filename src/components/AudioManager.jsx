import React, { useEffect, useRef } from 'react';
import { Howl } from 'howler';

const AudioManager = ({ cloudFormed, rainParticles, vaporParticles }) => {
  const oceanSound = useRef(null);
  const vaporSound = useRef(null);
  const rainSound = useRef(null);

  useEffect(() => {
    // Initialize sounds
    oceanSound.current = new Howl({
      src: ['/assests/audio/ocean.mp3'],
      loop: true,
      volume: 0.5
    });
    
    vaporSound.current = new Howl({
      src: ['/assests/audio/vapour.mp3'],
      loop: true,
      volume: 0.3
    });
    
    rainSound.current = new Howl({
      src: ['/assests/audio/rain.mp3'],
      loop: true,
      volume: 0.4
    });

    // Start ocean sound
    oceanSound.current.play();

    return () => {
      oceanSound.current.unload();
      vaporSound.current.unload();
      rainSound.current.unload();
    };
  }, []);

  useEffect(() => {
    // Handle vapor sound
    if (vaporParticles.length > 0 && !vaporSound.current.playing()) {
      vaporSound.current.play();
    } else if (vaporParticles.length === 0 && vaporSound.current.playing()) {
      vaporSound.current.stop();
    }
  }, [vaporParticles]);

  useEffect(() => {
    // Handle rain sound
    if (rainParticles.length > 0 && !rainSound.current.playing()) {
      rainSound.current.play();
    } else if (rainParticles.length === 0 && rainSound.current.playing()) {
      rainSound.current.stop();
    }
  }, [rainParticles]);

  return null;
};

export default AudioManager;