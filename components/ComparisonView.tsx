import React from 'react';
import { Download, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { downloadImage } from '../utils';

interface ComparisonViewProps {
  original: string;
  generated: string | null;
  isGenerating: boolean;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ original, generated, isGenerating }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Original Image */}
      <div className="space-y-3 group">
        <div className="flex items-center justify-between text-sm text-slate-400 px-1">
          <span className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            Original
          </span>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 shadow-xl">
          <img 
            src={original} 
            alt="Original" 
            className="w-full h-full object-contain bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-repeat" 
          />
        </div>
      </div>

      {/* Generated Image or Placeholder */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-400 px-1">
          <span className="flex items-center gap-2 font-medium">
            <span className={`w-2 h-2 rounded-full ${generated ? 'bg-indigo-500' : 'bg-slate-600'}`}></span>
            Generated Result
          </span>
          {generated && (
            <button 
              onClick={() => downloadImage(generated, `gemini-edit-${Date.now()}.png`)}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors text-xs"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
          )}
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 shadow-xl flex items-center justify-center">
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10">
              <div className="relative">
                 <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <RefreshCw className="w-6 h-6 text-indigo-500 animate-pulse" />
                 </div>
              </div>
              <p className="mt-4 text-indigo-300 font-medium animate-pulse">Gemini is dreaming...</p>
            </div>
          ) : generated ? (
            <img 
              src={generated} 
              alt="Generated" 
              className="w-full h-full object-contain bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-repeat animate-fadeIn" 
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-700/30 border border-slate-700/50 flex items-center justify-center mb-3 rotate-3">
                <ImageIcon className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-sm">Your masterpiece will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;