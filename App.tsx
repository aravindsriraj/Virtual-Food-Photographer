import React, { useState, useCallback } from 'react';
import { MenuInput } from './components/MenuInput';
import { StyleSelector } from './components/StyleSelector';
import { ImageGallery } from './components/ImageGallery';
import { ImageEditor } from './components/ImageEditor';
import { CaptionGenerator } from './components/CaptionGenerator';
import { CameraIcon } from './components/icons/CameraIcon';
import { IMAGE_STYLES } from './constants';
import { parseMenu, generateFoodImage, editImage as editImageWithGemini, generateSampleMenu } from './services/geminiService';
import type { ImageStyle, GeneratedImage, Dish } from './types';

export default function App() {
  const [menuText, setMenuText] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>(IMAGE_STYLES[0]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [editingImage, setEditingImage] = useState<GeneratedImage | null>(null);
  const [captioningImage, setCaptioningImage] = useState<GeneratedImage | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingMenu, setIsGeneratingMenu] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerateMenu = async () => {
    setIsGeneratingMenu(true);
    setError(null);
    try {
        const sampleMenu = await generateSampleMenu();
        setMenuText(sampleMenu);
    } catch (err) {
        console.error("Failed to generate sample menu:", err);
        setError(err instanceof Error ? err.message : 'Failed to generate a sample menu.');
    } finally {
        setIsGeneratingMenu(false);
    }
  };

  const handleGeneratePhotos = useCallback(async () => {
    if (!menuText.trim()) {
      setError('Please enter a menu.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      setLoadingMessage('Parsing your menu...');
      const dishes = await parseMenu(menuText);
      if (!dishes || dishes.length === 0) {
        throw new Error("Could not parse any dishes from the menu.");
      }

      const images: GeneratedImage[] = [];
      for (let i = 0; i < dishes.length; i++) {
        const dish = dishes[i];
        setLoadingMessage(`Generating photo ${i + 1} of ${dishes.length}: ${dish.name}`);
        const { base64, mimeType } = await generateFoodImage(dish.name, dish.description, selectedStyle.prompt);
        images.push({
          id: `${Date.now()}-${i}`,
          dishName: dish.name,
          dishDescription: dish.description,
          stylePrompt: selectedStyle.prompt,
          base64,
          mimeType,
        });
        setGeneratedImages([...images]);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [menuText, selectedStyle]);
  
  const handleSelectImageForEdit = (image: GeneratedImage) => {
    setEditingImage(image);
  };
  
  const handleSelectImageForCaption = (image: GeneratedImage) => {
    setCaptioningImage(image);
  };

  const handleCloseEditor = () => {
    setEditingImage(null);
  };

  const handleCloseCaptionGenerator = () => {
    setCaptioningImage(null);
  };

  const handleEditImage = async (image: GeneratedImage, editPrompt: string) => {
    try {
        const { base64, mimeType } = await editImageWithGemini(image.base64, image.mimeType, editPrompt);
        const updatedImage = { ...image, base64, mimeType };

        setGeneratedImages(prevImages => 
            prevImages.map(img => img.id === image.id ? updatedImage : img)
        );
        setEditingImage(updatedImage); // Update the image in the editor view
        return true; // Indicate success
    } catch (err) {
        console.error("Failed to edit image:", err);
        setError(err instanceof Error ? err.message : 'Failed to edit image.');
        return false; // Indicate failure
    }
  };


  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
           <div className="inline-flex items-center justify-center gap-3 mb-4 p-3 bg-slate-800/50 rounded-full border border-slate-700">
            <CameraIcon className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-400 text-transparent bg-clip-text">
            Virtual Food Photographer
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-4">
            Turn your menu into a masterpiece. Generate stunning, professional photos for every dish instantly.
          </p>
        </header>

        <main>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-1 space-y-8">
              <MenuInput 
                value={menuText} 
                onChange={setMenuText}
                onGenerate={handleGenerateMenu}
                isGenerating={isGeneratingMenu}
              />
              <StyleSelector
                styles={IMAGE_STYLES}
                selectedStyle={selectedStyle}
                onSelectStyle={setSelectedStyle}
              />
              <button
                onClick={handleGeneratePhotos}
                disabled={isLoading || isGeneratingMenu || !menuText.trim()}
                className="w-full flex items-center justify-center gap-3 text-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-600/30 disabled:shadow-none animate-pulse-glow"
              >
                {isLoading ? 'Generating...' : '✨ Generate Photos'}
              </button>
            </div>
            <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl p-6 min-h-[400px]">
              <ImageGallery 
                images={generatedImages}
                isLoading={isLoading}
                loadingMessage={loadingMessage}
                onSelectImage={handleSelectImageForEdit}
                onSelectForCaption={handleSelectImageForCaption}
              />
               {error && <div className="text-red-400 text-center mt-4">{error}</div>}
            </div>
          </div>
        </main>
        
        {editingImage && (
            <ImageEditor 
                image={editingImage}
                onClose={handleCloseEditor}
                onEdit={handleEditImage}
            />
        )}

        {captioningImage && (
          <CaptionGenerator
            image={captioningImage}
            onClose={handleCloseCaptionGenerator}
          />
        )}
      </div>
    </div>
  );
}