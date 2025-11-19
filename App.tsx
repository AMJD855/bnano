import React, { useState } from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PromptInput from './components/PromptInput';
import ComparisonView from './components/ComparisonView';
import { editImageWithGemini } from './services/geminiService';
import { AppStatus, ImageState } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [images, setImages] = useState<ImageState>({ original: null, generated: null });
  const [prompt, setPrompt] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (base64: string) => {
    setImages({ original: base64, generated: null });
    setStatus(AppStatus.UPLOADING);
    // Small timeout to simulate processing or just immediate transition
    setTimeout(() => setStatus(AppStatus.IDLE), 100);
    setError(null);
  };

  const handleReset = () => {
    setImages({ original: null, generated: null });
    setPrompt("");
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!images.original || !prompt) return;

    setStatus(AppStatus.GENERATING);
    setError(null);

    try {
      const generatedBase64 = await editImageWithGemini(images.original, prompt);
      setImages(prev => ({ ...prev, generated: generatedBase64 }));
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Something went wrong while generating the image.");
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction Hero */}
        {!images.original && (
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Transform your photos with <br />
              <span className="text-indigo-400">AI-Powered Text Prompts</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              Use the new Gemini 2.5 Flash Image model to apply styles, remove objects, or completely reimagine your pictures in seconds.
            </p>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-200 animate-fadeIn">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Upload Section */}
          {!images.original ? (
            <ImageUploader onImageSelected={handleImageSelected} />
          ) : (
            <div className="animate-fadeIn space-y-6">
              {/* Control Bar */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Editor Workspace</h3>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  disabled={status === AppStatus.GENERATING}
                >
                  <Trash2 className="w-4 h-4" />
                  Start Over
                </button>
              </div>

              {/* Editor Grid */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                <div className="flex flex-col gap-8">
                  {/* Image Display */}
                  <ComparisonView 
                    original={images.original} 
                    generated={images.generated} 
                    isGenerating={status === AppStatus.GENERATING}
                  />

                  {/* Prompt Section */}
                  <div className="border-t border-slate-800 pt-6">
                    <PromptInput 
                      prompt={prompt} 
                      setPrompt={setPrompt} 
                      onGenerate={handleGenerate}
                      status={status}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;