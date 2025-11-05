import React, { useState } from 'react';
import type { GeneratedImage } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ImageEditorProps {
  image: GeneratedImage;
  onClose: () => void;
  onEdit: (image: GeneratedImage, prompt: string) => Promise<boolean>;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ image, onClose, onEdit }) => {
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrompt.trim()) return;
    
    setIsEditing(true);
    setError(null);
    const success = await onEdit(image, editPrompt);
    if (success) {
      setEditPrompt(''); // Clear prompt on success
    } else {
      setError('Something went wrong. Please try a different prompt.');
    }
    setIsEditing(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col lg:flex-row overflow-hidden border border-slate-700 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full lg:w-2/3 relative flex-shrink-0 bg-slate-900">
          {isEditing && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
              <p className="text-white mt-4">Applying your magic touch...</p>
            </div>
          )}
          <img 
            src={`data:${image.mimeType};base64,${image.base64}`} 
            alt={`Editing ${image.dishName}`}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-full lg:w-1/3 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">{image.dishName}</h3>
              <p className="text-gray-400 text-sm">Image Editor</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
            <label htmlFor="edit-prompt" className="text-sm font-medium text-gray-300 mb-2">
              Describe your edit
            </label>
            <textarea
              id="edit-prompt"
              rows={4}
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              className="w-full bg-slate-900 text-gray-200 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 flex-grow"
              placeholder="e.g., Add a sprinkle of fresh parsley on top"
            />
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            <div className="mt-auto pt-4">
              <button
                type="submit"
                disabled={isEditing || !editPrompt.trim()}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
              >
                <SparklesIcon className="w-5 h-5" />
                {isEditing ? 'Applying...' : 'Apply Edit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};