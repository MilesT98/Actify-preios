/**
 * ACTIFY iOS-Ready Camera Component
 * Optimized for React Native migration
 */

import React, { useState, useEffect, useRef } from 'react';

const CameraCapture = ({ onCapture, onClose, darkMode }) => {
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    startCamera();
    return cleanup;
  }, []);

  const startCamera = async () => {
    try {
      // iOS-optimized camera constraints
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1080, max: 1920 },
          height: { ideal: 1920, max: 1080 },
          frameRate: { ideal: 30, max: 60 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setError('Failed to access camera. Please check permissions.');
      // Auto-close after error for better mobile UX
      setTimeout(onClose, 3000);
    }
  };

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || isCapturing) return;

    setIsCapturing(true);
    
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      
      // Optimize for mobile - reduce size for better performance
      const maxWidth = 800;
      const maxHeight = 800;
      const aspectRatio = video.videoWidth / video.videoHeight;
      
      let { width, height } = aspectRatio > 1 
        ? { width: maxWidth, height: maxWidth / aspectRatio }
        : { width: maxHeight * aspectRatio, height: maxHeight };
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, width, height);
      
      // Convert to blob with mobile-optimized quality
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(blob);
        }
        setIsCapturing(false);
      }, 'image/jpeg', 0.8); // Good quality/size balance for mobile
      
    } catch (error) {
      console.error('Photo capture error:', error);
      setIsCapturing(false);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center text-white p-6">
          <div className="text-6xl mb-4">📷</div>
          <h2 className="text-xl font-bold mb-2">Camera Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* iOS-style camera overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid lines for better composition */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white border-opacity-30" />
            ))}
          </div>
        </div>
        
        {/* Camera controls - iOS style */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-6">
          <div className="flex items-center justify-center space-x-8">
            {/* Cancel button */}
            <button
              onClick={onClose}
              className="text-white text-lg font-medium px-4 py-2"
              disabled={isCapturing}
            >
              Cancel
            </button>
            
            {/* Capture button - iOS style */}
            <div className="relative">
              <button
                onClick={capturePhoto}
                disabled={isCapturing}
                className={`w-20 h-20 rounded-full border-4 border-white bg-white transition-all duration-200 ${
                  isCapturing ? 'scale-95 opacity-50' : 'hover:scale-105'
                }`}
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  {isCapturing ? (
                    <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-400 border-t-gray-600" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-white" />
                  )}
                </div>
              </button>
            </div>
            
            {/* Gallery button placeholder */}
            <button
              className="text-white text-lg font-medium px-4 py-2 opacity-50"
              disabled
            >
              Gallery
            </button>
          </div>
          
          {/* Capture hint */}
          <div className="text-center mt-4">
            <p className="text-white text-sm opacity-75">
              Tap to capture your activity photo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;