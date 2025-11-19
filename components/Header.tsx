import React from 'react';
import { Camera, Wand2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Nano Art Studio
              </h1>
              <span className="text-xs text-slate-400 hidden sm:block">
                Powered by Gemini 2.5 Flash Image
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <a 
                href="https://ai.google.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors"
             >
               Gemini API
             </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;