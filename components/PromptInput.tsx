import React from 'react';
import { Sparkles, Send } from 'lucide-react';
import { SAMPLE_PROMPTS, AppStatus } from '../types';

interface PromptInputProps {
  prompt: string;
  setPrompt: (p: string) => void;
  onGenerate: () => void;
  status: AppStatus;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onGenerate, status }) => {
  const isLoading = status === AppStatus.GENERATING;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !isLoading) {
        onGenerate();
      }
    }
  };

  return (
    <div className="w-full space-y-4 animate-fadeIn">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe how you want to change the image..."
          className="w-full min-h-[80px] bg-slate-800/50 border border-slate-600 rounded-xl p-4 pr-14 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all shadow-inner"
          disabled={isLoading}
        />
        
        <button
          onClick={onGenerate}
          disabled={!prompt.trim() || isLoading}
          className={`
            absolute bottom-3 right-3 p-2 rounded-lg transition-all
            ${!prompt.trim() || isLoading 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/20'
            }
          `}
        >
           {isLoading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
           ) : (
             <Send className="w-5 h-5" />
           )}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Sparkles className="w-3 h-3" />
          <span>Try these prompts:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(p)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-white hover:bg-slate-750 transition-colors text-left"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;