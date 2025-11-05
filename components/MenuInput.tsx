import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface MenuInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const MenuInput: React.FC<MenuInputProps> = ({ value, onChange, onGenerate, isGenerating }) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-3">
        <label htmlFor="menu-input" className="flex items-center gap-3 text-md font-semibold text-gray-200">
          <span className="flex items-center justify-center w-7 h-7 bg-indigo-600 text-white rounded-full font-bold">1</span>
          Paste Your Menu
        </label>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 hover:text-indigo-200 disabled:text-gray-500 disabled:cursor-wait transition-colors"
        >
          <SparklesIcon className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </button>
      </div>
      <textarea
        id="menu-input"
        rows={10}
        className="w-full bg-slate-900 text-gray-200 border border-slate-600 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-sm placeholder:text-gray-500"
        placeholder="e.g.,&#10;Margherita Pizza - Fresh tomatoes, mozzarella, basil&#10;Carbonara Pasta - Creamy egg sauce, pancetta, pecorino cheese"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};