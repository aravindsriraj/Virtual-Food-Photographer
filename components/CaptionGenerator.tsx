import React, { useState, useEffect } from 'react';
import type { GeneratedImage } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { CheckIcon } from './icons/CheckIcon';
import { QuoteIcon } from './icons/QuoteIcon';
import { generateSocialMediaCaptions } from '../services/geminiService';

interface CaptionGeneratorProps {
  image: GeneratedImage;
  onClose: () => void;
}

interface Caption {
  text: string;
  copied: boolean;
}

export const CaptionGenerator: React.FC<CaptionGeneratorProps> = ({ image, onClose }) => {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCaptions = async () => {
    setIsLoading(true);
    setError(null);
    setCaptions([]);
    try {
      const results = await generateSocialMediaCaptions(image.dishName, image.dishDescription, image.stylePrompt);
      setCaptions(results.map(text => ({ text, copied: false })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate captions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (index: number) => {
    const captionText = captions[index].text;
    navigator.clipboard.writeText(captionText);
    setCaptions(prev => prev.map((cap, i) => i === index ? { ...cap, copied: true } : { ...cap, copied: false }));
    setTimeout(() => {
        setCaptions(prev => prev.map((cap, i) => i === index ? { ...cap, copied: false } : cap));
    }, 2000);
  };

  useEffect(() => {
    handleGenerateCaptions();
  }, [image]);

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col lg:flex-row overflow-hidden border border-slate-700 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full lg:w-1/2 relative flex-shrink-0 bg-slate-900">
          <img 
            src={`data:${image.mimeType};base64,${image.base64}`} 
            alt={`Generating captions for ${image.dishName}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">{image.dishName}</h3>
              <p className="text-gray-400 text-sm">Social Media Captions</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-4">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <SparklesIcon className="w-10 h-10 text-indigo-400 animate-pulse" />
                <p className="text-gray-300 mt-2">Generating witty captions...</p>
              </div>
            )}
            {error && <div className="text-red-400 text-center">{error}</div>}
            {!isLoading && captions.length > 0 && (
              <>
                {captions.map((caption, index) => (
                   <div key={index} className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                    <p className="text-gray-300 text-sm whitespace-pre-wrap mb-3">{caption.text}</p>
                    <button 
                      onClick={() => handleCopy(index)}
                      className={`text-xs font-semibold transition-colors flex items-center gap-1.5 ${caption.copied ? 'text-green-400' : 'text-indigo-300 hover:text-indigo-200'}`}
                    >
                      {caption.copied ? <CheckIcon className="w-4 h-4" /> : <QuoteIcon className="w-4 h-4 -scale-x-100"/>}
                      {caption.copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="mt-auto pt-4">
              <button
                onClick={handleGenerateCaptions}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
              >
                <SparklesIcon className="w-5 h-5" />
                {isLoading ? 'Generating...' : '✨ Regenerate'}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};