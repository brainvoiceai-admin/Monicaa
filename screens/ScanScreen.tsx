
import React, { useState, useEffect, useRef } from 'react';
import { diagnoseSkinCondition, DiagnosticResult } from '../geminiService';

interface ScanScreenProps {
  onAnalysisComplete: (result: DiagnosticResult) => void;
}

type PermissionStatus = 'prompt' | 'granted' | 'denied' | 'requesting';

const ScanScreen: React.FC<ScanScreenProps> = ({ onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('prompt');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const requestCameraPermission = async () => {
    setPermissionStatus('requesting');
    const constraints = [{ video: { facingMode: 'user' } }, { video: true }];
    let stream: MediaStream | null = null;

    for (const constraint of constraints) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraint);
        if (stream) break;
      } catch (err: any) {
        console.warn(`Constraint failed:`, err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setPermissionStatus('denied');
          return;
        }
      }
    }

    if (stream) {
      streamRef.current = stream;
      setPermissionStatus('granted');
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } else {
      setPermissionStatus('denied');
      setCameraError("Camera hardware unavailable or access denied.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setPreviewImage(base64);
      setPermissionStatus('granted'); // Move to main view to show analysis
      processImage(base64.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64Data: string) => {
    setIsAnalyzing(true);
    setProgress(10);
    try {
      setProgress(40);
      const result = await diagnoseSkinCondition(base64Data);
      setProgress(90);
      setTimeout(() => onAnalysisComplete(result), 500);
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
      setProgress(0);
      setPreviewImage(null);
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || isAnalyzing) return;
    
    setIsAnalyzing(true);
    setProgress(10);

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      
      const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      processImage(base64);
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Permission / Initial Choice Screen
  if (permissionStatus === 'prompt' || permissionStatus === 'requesting' || permissionStatus === 'denied') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*" 
          className="hidden" 
        />
        
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${permissionStatus === 'denied' ? 'bg-rose-50 dark:bg-rose-900/20' : 'bg-[#13ec5b]/10'}`}>
          <span className={`material-icons-round text-5xl ${permissionStatus === 'denied' ? 'text-rose-500' : 'text-[#13ec5b]'}`}>
            {permissionStatus === 'denied' ? 'block' : 'photo_camera'}
          </span>
        </div>
        
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 text-center">
          {permissionStatus === 'denied' ? 'Access Denied' : 'How to Scan?'}
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 text-center text-sm leading-relaxed mb-10 max-w-[280px]">
          {permissionStatus === 'denied' 
            ? "Monica needs camera access for live analysis, but you can still upload a photo from your gallery."
            : "Capture a live photo for the most accurate diagnostic, or upload an existing image from your gallery."}
        </p>

        <div className="w-full max-w-[280px] space-y-4">
          {permissionStatus !== 'denied' && (
            <button 
              onClick={requestCameraPermission}
              disabled={permissionStatus === 'requesting'}
              className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-4 rounded-[20px] font-bold text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {permissionStatus === 'requesting' && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900 rounded-full animate-spin"></div>
              )}
              {permissionStatus === 'requesting' ? 'Requesting...' : 'Live Camera Scan'}
            </button>
          )}

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-700 py-4 rounded-[20px] font-bold text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <span className="material-icons-round text-lg">image</span>
            Upload from Gallery
          </button>
        </div>

        <button 
          onClick={() => window.history.back()}
          className="mt-8 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  // Active Analysis Screen
  return (
    <div className="h-full relative flex flex-col p-6 overflow-hidden bg-[#f6f8f6] dark:bg-slate-900">
      <canvas ref={canvasRef} className="hidden" />
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />
      
      <header className="flex justify-between items-center mb-6 z-10">
        <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full neumorph-card flex items-center justify-center text-slate-500 dark:text-slate-400">
          <span className="material-icons-round text-xl">arrow_back_ios_new</span>
        </button>
        <div className="text-center">
          <h1 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Diagnostic Hub</h1>
          <p className="text-[10px] font-bold text-[#13ec5b] uppercase tracking-widest">Vision Analysis 3.0</p>
        </div>
        <button className="w-10 h-10 rounded-full neumorph-card flex items-center justify-center text-slate-500 dark:text-slate-400">
          <span className="material-icons-round text-xl">settings</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-[40px] neumorph-inset flex items-center justify-center p-3">
          <div className="w-full h-full rounded-[30px] overflow-hidden relative border-[4px] border-white dark:border-slate-800 shadow-2xl bg-slate-900">
            {previewImage ? (
              <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            )}
            
            <div className="absolute inset-0 pointer-events-none border-[1px] border-white/20">
               <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-[#13ec5b]"></div>
               <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-[#13ec5b]"></div>
               <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-[#13ec5b]"></div>
               <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-[#13ec5b]"></div>
               
               {isAnalyzing && (
                 <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#13ec5b] shadow-[0_0_10px_#13ec5b] animate-[scan_2s_infinite]"></div>
               )}
            </div>
          </div>
        </div>

        {isAnalyzing && (
          <div className="mt-8 w-64">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-bold text-[#13ec5b] uppercase animate-pulse">Running AI Diagnostics...</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#13ec5b] transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {!isAnalyzing && (
          <p className="mt-8 text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] text-center max-w-[200px]">
            {previewImage ? 'Processing Uploaded Photo' : 'Place affected area in the scan zone'}
          </p>
        )}
      </div>

      <footer className="pb-8 z-10 flex justify-center items-center gap-8">
        {!isAnalyzing && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-md active:scale-90 transition-all"
          >
            <span className="material-icons-round">image</span>
          </button>
        )}

        <button 
          onClick={handleCapture}
          disabled={isAnalyzing || !!previewImage}
          className={`group w-20 h-20 rounded-full flex items-center justify-center transition-all ${isAnalyzing ? 'bg-slate-100 dark:bg-slate-800 scale-90' : 'bg-white dark:bg-slate-800 shadow-xl hover:scale-105 active:scale-95'}`}
        >
          <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all ${isAnalyzing ? 'border-slate-200 dark:border-slate-700' : 'border-slate-100 dark:border-slate-700 group-hover:border-[#13ec5b]'}`}>
             <div className={`w-12 h-12 rounded-full shadow-inner ${isAnalyzing ? 'bg-slate-300 dark:bg-slate-600' : 'bg-[#13ec5b]'}`}></div>
          </div>
        </button>

        {!isAnalyzing && (
          <button 
            onClick={() => {
              if (previewImage) setPreviewImage(null);
              else requestCameraPermission();
            }}
            className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-md active:scale-90 transition-all"
          >
            <span className="material-icons-round">{previewImage ? 'close' : 'flip_camera_ios'}</span>
          </button>
        )}
      </footer>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-140px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(140px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ScanScreen;
