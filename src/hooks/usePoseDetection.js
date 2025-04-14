import { useState, useEffect, useRef } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';

const usePoseDetection = () => {
  const [hands, setHands] = useState([]);
  const videoRef = useRef();
  const detectorRef = useRef();
  const isVideoReadyRef = useRef(false);

  const setupCamera = async () => {
    const video = document.createElement('video');
    video.width = window.innerWidth;
    video.height = window.innerHeight;
    
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    
    // Wait for video to be properly loaded and ready
    return new Promise((resolve) => {
      video.onloadeddata = () => {
        video.play();
        isVideoReadyRef.current = true;
        resolve(video);
      };
    });
  };

  const detectPoses = async () => {
    if (detectorRef.current && videoRef.current && isVideoReadyRef.current) {
      try {
        // Make sure the video has valid dimensions before processing
        if (videoRef.current.readyState === 4 && 
            videoRef.current.videoWidth > 0 && 
            videoRef.current.videoHeight > 0) {
          const poses = await detectorRef.current.estimatePoses(videoRef.current);
          processPoses(poses);
        }
      } catch (error) {
        console.error("Error in pose detection:", error);
      }
    }
    requestAnimationFrame(detectPoses);
  };

  const processPoses = (poses) => {
    const detectedHands = [];
    poses.forEach(pose => {
      if (pose.keypoints?.[16]?.score > 0.7) {
        detectedHands.push({
          x: window.innerWidth - pose.keypoints[16].x,
          y: pose.keypoints[16].y
        });
      }
    });
    setHands(detectedHands);
  };

  useEffect(() => {
    const setupDetector = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        
        const model = poseDetection.SupportedModels.BlazePose;
        const detector = await poseDetection.createDetector(model, {
          runtime: 'tfjs',
          modelType: 'full'
        });
        
        detectorRef.current = detector;
        const video = await setupCamera();
        videoRef.current = video;
        detectPoses();
      } catch (error) {
        console.error("Error setting up pose detector:", error);
      }
    };

    setupDetector();
    
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return hands;
};

export default usePoseDetection;