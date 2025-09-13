import React, { useRef, useEffect, useState } from 'react';
import { Camera as CameraIcon, Loader2, Check, X } from 'lucide-react';
import { simulateAIMeasurement, type Measurements } from '../utils/measurementSimulator';

interface CameraProps {
  onMeasurementsCapture: (measurements: Measurements) => void;
  onClose: () => void;
}

export const Camera: React.FC<CameraProps> = ({ onMeasurementsCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [step, setStep] = useState<'camera' | 'processing' | 'complete'>('camera');
  const [measurements, setMeasurements] = useState<Measurements | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);
    setStep('processing');

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      
      try {
        const measuredData = await simulateAIMeasurement(imageData);
        setMeasurements(measuredData);
        setStep('complete');
      } catch (error) {
        console.error('Measurement processing failed:', error);
        setIsCapturing(false);
        setStep('camera');
      }
    }
    
    setIsCapturing(false);
  };

  const handleConfirm = () => {
    if (measurements) {
      onMeasurementsCapture(measurements);
    }
  };

  const handleRetake = () => {
    setStep('camera');
    setMeasurements(null);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50">
        <h2 className="text-white text-lg font-semibold">
          {step === 'camera' && 'Position yourself in frame'}
          {step === 'processing' && 'Processing measurements...'}
          {step === 'complete' && 'Measurements captured'}
        </h2>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-2"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Camera/Results View */}
      <div className="flex-1 relative">
        {step !== 'complete' && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Measurement guidelines overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-white/50 rounded-lg w-64 h-80 relative">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white/80 text-sm">
                  Stand here
                </div>
                <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-white/50"></div>
                <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-white/50"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-white/50"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-white/50"></div>
              </div>
            </div>

            {step === 'processing' && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
                  <p className="text-white text-lg">Analyzing your measurements...</p>
                  <p className="text-white/60 text-sm mt-2">This may take a few seconds</p>
                </div>
              </div>
            )}
          </>
        )}

        {step === 'complete' && measurements && (
          <div className="h-full bg-gradient-to-br from-green-600 to-blue-600 p-6 overflow-auto">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Measurements Complete!</h3>
                <p className="text-white/80">Your body measurements have been captured</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-4">
                {Object.entries(measurements).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-white/80 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-white font-semibold">
                      {typeof value === 'number' ? `${value.toFixed(1)} ${key === 'weight' ? 'kg' : 'cm'}` : value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={handleRetake}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Retake
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-white hover:bg-white/90 text-green-600 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Capture Button */}
      {step === 'camera' && (
        <div className="p-8 flex justify-center">
          <button
            onClick={captureImage}
            disabled={isCapturing}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {isCapturing ? (
              <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
            ) : (
              <CameraIcon className="w-8 h-8 text-gray-600" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};