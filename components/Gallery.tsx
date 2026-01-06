
import * as React from 'react';
import { useState } from 'react';
import { Image as ImageIcon, Maximize2, X } from 'lucide-react';
import { GALLERY_IMAGES } from '../constants';

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div id="gallery" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <span className="p-1">📸</span> Memory Checkpoints
        </h2>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">SHIRONEKO MEMORY</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {GALLERY_IMAGES.map((img, idx) => (
          <div 
            key={idx}
            className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer bg-slate-200 dark:bg-slate-700 shadow-sm hover:shadow-xl transition-all duration-500"
            onClick={() => setSelectedImage(img.url)}
          >
            <img 
              src={img.url} 
              alt={img.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-center">
              <span className="text-white text-xs font-bold uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {img.title}
              </span>
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
                <Maximize2 size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img 
            src={selectedImage} 
            className="max-w-full max-h-full rounded-xl shadow-2xl animate-in zoom-in duration-300" 
            alt="Enlarged"
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
