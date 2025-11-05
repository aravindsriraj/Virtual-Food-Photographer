import React from 'react';
import type { ImageStyle } from '../types';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { HashtagIcon } from './icons/HashtagIcon';

interface StyleSelectorProps {
  styles: ImageStyle[];
  selectedStyle: ImageStyle;
  onSelectStyle: (style: ImageStyle) => void;
}

const styleIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  'Bright & Modern': SunIcon,
  'Rustic & Dark': MoonIcon,
  'Social Media': HashtagIcon,
};


export const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyle, onSelectStyle }) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-xl shadow-md">
       <h3 className="flex items-center gap-3 text-md font-semibold text-gray-200 mb-4">
          <span className="flex items-center justify-center w-7 h-7 bg-indigo-600 text-white rounded-full font-bold">2</span>
          Choose a Style
        </h3>
      <div className="flex flex-col space-y-3">
        {styles.map((style) => {
            const Icon = styleIcons[style.name] || SunIcon;
            return (
              <button
                key={style.name}
                onClick={() => onSelectStyle(style)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-300 flex items-center gap-4 border-2 ${
                  selectedStyle.name === style.name
                    ? 'bg-indigo-500/20 border-indigo-500 shadow-lg'
                    : 'bg-slate-700/50 hover:bg-slate-700 border-transparent hover:border-slate-500'
                }`}
              >
                <div className={`p-2 rounded-md ${ selectedStyle.name === style.name ? 'bg-indigo-500/30' : 'bg-slate-600' }`}>
                    <Icon className={`w-6 h-6 ${ selectedStyle.name === style.name ? 'text-indigo-300' : 'text-gray-300' }`} />
                </div>
                <div>
                    <p className="font-semibold text-gray-100">{style.name}</p>
                    <p className="text-xs text-gray-400">{style.prompt.split('.')[0] + '.'}</p>
                </div>
              </button>
            )
        })}
      </div>
    </div>
  );
};