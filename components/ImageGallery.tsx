import React from 'react';
import type { GeneratedImage } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { QuoteIcon } from './icons/QuoteIcon';
import { CameraIcon } from './icons/CameraIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageGalleryProps {
  images: GeneratedImage[];
  isLoading: boolean;
  loadingMessage: string;
  onSelectImage: (image: GeneratedImage) => void;
  onSelectForCaption: (image: GeneratedImage) => void;
}

const LoadingSkeleton: React.FC = () => (
  <div className="aspect-[4/3] bg-slate-700 animate-pulse rounded-xl"></div>
);

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, isLoading, loadingMessage, onSelectImage, onSelectForCaption }) => {
  
  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = `data:${image.mimeType};base64,${image.base64}`;
    const fileName = `${image.dishName.replace(/\s+/g, '-')}.png`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400 mb-4"></div>
        <p className="text-lg font-semibold text-gray-300">Generating Your Photos</p>
        <p className="text-gray-400">{loadingMessage}</p>
      </div>
    );
  }

  if (!isLoading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
        <CameraIcon className="w-20 h-20 mb-4 text-slate-700"/>
        <h3 className="text-xl font-bold text-gray-300">Ready to Get Cooking?</h3>
        <p className="max-w-xs mt-2">Your stunning food photos will appear right here once you generate them.</p>
      </div>
    );
  }

  return (
    <div>
      {isLoading && <p className="text-center mb-4 text-indigo-300 animate-pulse">{loadingMessage}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="group relative rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-indigo-500 transition-all duration-300">
            <img
              src={`data:${image.mimeType};base64,${image.base64}`}
              alt={image.dishName}
              className="w-full h-full object-cover aspect-[4/3] transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <h4 className="font-bold text-white truncate">{image.dishName}</h4>
            </div>
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
              <button 
                onClick={() => onSelectImage(image)}
                className="p-2.5 bg-black/60 backdrop-blur-sm hover:bg-indigo-600 rounded-full text-white transition-colors"
                aria-label={`Edit ${image.dishName}`}
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onSelectForCaption(image)}
                className="p-2.5 bg-black/60 backdrop-blur-sm hover:bg-teal-600 rounded-full text-white transition-colors"
                aria-label={`Generate captions for ${image.dishName}`}
              >
                <QuoteIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleDownload(image)}
                className="p-2.5 bg-black/60 backdrop-blur-sm hover:bg-blue-600 rounded-full text-white transition-colors"
                aria-label={`Download ${image.dishName}`}
              >
                <DownloadIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {isLoading && <LoadingSkeleton />}
      </div>
    </div>
  );
};