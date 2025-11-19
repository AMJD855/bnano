import React, { useState, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, X } from 'lucide-react';
import { processImageFile } from '../utils';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await processImageFile(e.target.files[0]);
        onImageSelected(base64);
      } catch (err) {
        console.error("Error processing file", err);
        alert("Could not process image. Please try another.");
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file.");
        return;
      }
      try {
        const base64 = await processImageFile(file);
        onImageSelected(base64);
      } catch (err) {
        console.error("Error processing drop", err);
      }
    }
  };

  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error", err);
      alert("Could not access camera. Please check permissions.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Limit size while capturing
        const base64 = canvas.toDataURL('image/jpeg', 0.9);
        
        // We might want to resize this if it's huge, 
        // but for now pass it to the main handler which expects base64
        onImageSelected(base64);
        stopCamera();
      }
    }
  };

  if (showCamera) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-[60vh] object-cover bg-black"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <button 
            onClick={stopCamera}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent flex justify-center gap-8 items-center">
             <button 
              onClick={stopCamera}
              className="text-white font-medium hover:text-slate-300"
            >
              Cancel
            </button>
            <button 
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full bg-white border-4 border-indigo-500 shadow-lg active:scale-95 transition-transform flex items-center justify-center"
            >
              <div className="w-14 h-14 rounded-full border-2 border-white bg-transparent" />
            </button>
             <div className="w-12"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
          : 'border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/50 bg-slate-800/30'
        }
      `}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-2">
          <ImageIcon className="w-8 h-8 text-indigo-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-white">Upload your photo</h3>
        <p className="text-slate-400 max-w-sm mx-auto">
          Drag and drop your image here, or choose an option below to get started.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mt-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-900/20"
          >
            <Upload className="w-4 h-4" />
            Choose File
          </button>
          
          <button
            onClick={startCamera}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            <Camera className="w-4 h-4" />
            Open Camera
          </button>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageUploader;