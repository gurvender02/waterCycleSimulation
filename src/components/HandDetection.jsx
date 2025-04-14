import React, { useEffect } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';

const HandDetection = ({ onHandsDetected }) => {
  const videoRef = useRef();
  const detectorRef = useRef();
  const animationRef = useRef();

  useEffect(() => {
    const setupDetector = async () => {
      await tf.ready();
      const model = poseDetection.SupportedModels.BlazePose;
      const detector = await poseDetection.createDetector(model);
      detectorRef.current = detector;
      
      // Set up video stream
      const video = await setupCamera();
      videoRef.current = video;
      
      detectPoses();
    };

    const setupCamera = async () => {
      const video = document.createElement('video');
      video.width = window.innerWidth;
      video.height = window.innerHeight;
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      
      video.srcObject = stream;
      video.play();
      return video;
    };

    const detectPoses = async () => {
      if (detectorRef.current && videoRef.current) {
        const poses = await detectorRef.current.estimatePoses(videoRef.current);
        processPoses(poses);
      }
      animationRef.current = requestAnimationFrame(detectPoses);
    };

    const processPoses = (poses) => {
      const hands = [];
      // Process poses similar to original getHandPositions function
      onHandsDetected(hands);
    };

    setupDetector();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return null;
};

export default HandDetection;