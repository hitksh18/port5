import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Play, Square, Lightbulb, User, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { getUserScans, saveScan, ScanData } from '@/lib/scan';
import { useNavigate } from 'react-router-dom';

const Scan = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [scans, setScans] = useState<ScanData[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (user) {
      loadScans();
    }
  }, [user]);

  const loadScans = async () => {
    if (user) {
      try {
        const userScans = await getUserScans(user.uid);
        setScans(userScans);
      } catch (error) {
        console.error('Error loading scans:', error);
      }
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied. Please allow camera access to use body scan.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startScan = async () => {
    if (!stream) {
      await startCamera();
      return;
    }

    setIsScanning(true);
    setCountdown(30);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          completeScan();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeScan = async () => {
    setIsScanning(false);
    
    if (user) {
      try {
        const scanData = {
          scanId: `scan_${Date.now()}`,
          height: null,
          weight: null,
          imageURL: null,
          device: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          tryOnCount: 0
        };

        await saveScan(user.uid, scanData);
        await loadScans();
        
        alert('Body scan completed successfully!');
      } catch (error) {
        console.error('Error saving scan:', error);
        alert('Error saving scan. Please try again.');
      }
    }

    stopCamera();
  };

  const cancelScan = () => {
    setIsScanning(false);
    setCountdown(0);
    stopCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Login Required</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Please login to access body scan feature</p>
          <Button onClick={() => navigate('/')} className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
          </button>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-2">Start New Scan</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Capture your body measurements with AI precision</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Position yourself 6 feet away from your camera in good lighting. The scan takes about 30 seconds to complete.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Your Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <User className="mr-2" size={20} />
              Your Progress
            </h2>
            <div className="space-y-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{scans.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Scans</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {scans.length > 0 
                    ? new Date(scans[0].scanTime).toLocaleDateString()
                    : 'Never'
                  }
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Latest Scan</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {scans.reduce((total, scan) => total + scan.tryOnCount, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Virtual Try-Ons</div>
              </div>
              
              <Button 
                onClick={() => navigate('/scan-history')}
                variant="outline" 
                className="w-full dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                View Scan History
              </Button>
            </div>
          </div>

          {/* Camera Section */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="aspect-video bg-gray-900 rounded-lg mb-6 relative overflow-hidden">
              {stream ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {countdown > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-white text-6xl font-bold">
                        {countdown}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  <div className="text-center">
                    <Camera size={48} className="mx-auto mb-4" />
                    <p>Camera Preview</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-4 flex items-center">
                <Lightbulb className="mr-2" size={20} />
                Scan Tips for Best Results:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700 dark:text-blue-300">
                <div className="flex items-start space-x-2">
                  <Lightbulb size={16} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Good Lighting</div>
                    <div>Ensure bright, even lighting without shadows</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <User size={16} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Fitted Clothing</div>
                    <div>Wear form-fitting clothes for accurate measurements</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock size={16} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Stay Still</div>
                    <div>Keep steady during the 30-second scan</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              {!isScanning ? (
                <Button
                  onClick={startScan}
                  className="flex-1 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 flex items-center justify-center space-x-2 py-3"
                >
                  <Play size={20} />
                  <span>Start Body Scan</span>
                </Button>
              ) : (
                <Button
                  onClick={cancelScan}
                  variant="destructive"
                  className="flex-1 flex items-center justify-center space-x-2 py-3"
                >
                  <Square size={20} />
                  <span>Cancel Scan</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scan;